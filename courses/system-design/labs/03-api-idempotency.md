# Lab 03 · Building and Testing an Idempotent Payment API

**Goal:** Reproduce a real-world duplicate-charge bug caused by client retries after a dropped response, then fix and verify it using an atomic `Idempotency-Key` store.
**Level:** Beginner → Intermediate
**Estimated effort:** 45–60 minutes

## Scenario and setup

Imagine a checkout client sends `POST /v1/charges` for `$49.00`. The server debits the customer's card and writes ledger entry `#101`, **but the HTTP response is lost** in transit because the user walks into an elevator. Five seconds later, the client's retry logic sends the exact same `POST /v1/charges` again.

Without idempotency protection, the customer is charged **`$98.00`**.

**Prerequisites:**
- Python `3.10+` (or Node.js `18+`) to run a 60-line local HTTP server on `127.0.0.1:8080`.
- `curl` to send requests and simulate retries.

> **Safety note:** Run everything locally against `127.0.0.1`. Keep state in an in-memory dictionary or local SQLite file in `/tmp` so nothing touches external APIs or real payment processors.

## Starting assumptions

| Input | Value | How to validate |
|---|---|---|
| Local server binds cleanly | `127.0.0.1:8080` | `curl -i http://127.0.0.1:8080/health` returns `200 OK` |
| Non-idempotent retry creates duplicate | 2 ledger rows for 1 purchase | Inspect `/ledger` endpoint after two identical POSTs |
| Idempotent retry returns cached result | 1 ledger row + identical response | Compare `charge_id` across original and retried `POST` |

## Tasks

- [ ] **Task 1 · Run a minimal local mock server without idempotency**
  Implement a tiny local HTTP server (Python `http.server` or FastAPI/Flask, or Node `http`) with:
  - `POST /v1/charges` — accepts JSON `{"order_id": "ord_1", "amount_cents": 4900}`, appends a new charge (`chg_1`, `chg_2`, ...) to an in-memory ledger list, and returns `201 Created`.
  - `GET /v1/ledger` — returns all recorded charges and total amount charged.
  Send two identical `POST /v1/charges` requests (simulating a timeout retry) and verify via `GET /v1/ledger` that **two charges** were recorded.

- [ ] **Task 2 · Add `Idempotency-Key` + request fingerprint validation**
  Update `POST /v1/charges` to read the `Idempotency-Key` HTTP header:
  1. Require `Idempotency-Key` on `POST /v1/charges` (return `400 Bad Request` if missing).
  2. Compute a SHA-256 hash of the canonical request body (`order_id` + `amount_cents`).
  3. If the key does not exist yet: acquire an in-flight lock/marker (`status = "IN_PROGRESS"`), create the single charge, store `(key -> {payload_hash, status_code, response_body})`, and return `201 Created` with header `Idempotency-Replayed: false`.
  4. If the key already exists **and `payload_hash` matches**: return the exact stored status code and JSON body with `Idempotency-Replayed: true`—without creating a second ledger row.
  5. If the key already exists **and `payload_hash` differs**: return `422 Unprocessable Content` (or `409 Conflict`) to catch client key-reuse bugs.

- [ ] **Task 3 · Verify all three test cases via `curl`**
  - **Fresh request:** `Idempotency-Key: key-abc-1` with `$49.00` → `201 Created`, `chg_1`.
  - **Safe retry:** Repeat exact `Idempotency-Key: key-abc-1` with `$49.00` → `201 Created`, same `chg_1`, `Idempotency-Replayed: true`, ledger still has **1 row**.
  - **Key-collision mismatch:** Send `Idempotency-Key: key-abc-1` with `$99.00` → `422` / `409` error, ledger unchanged.

- [ ] **Task 4 · Simulate a concurrent duplicate race (optional stretch)**
  Send two `curl` requests with the *same new key* simultaneously (`curl ... & curl ... & wait`). Confirm that locking / atomic `INSERT ... ON CONFLICT` prevents two workers from both passing the initial lookup check.

## Expected evidence

- Server script snippet or file path plus `curl` commands and raw HTTP responses (`-i` showing status codes and `Idempotency-Replayed` headers).
- Output of `GET /v1/ledger` before and after fixing idempotency showing total charges (`1` row instead of `2`).
- Explicit note of how concurrent in-flight keys behave (`409` retry-later vs. waiting).

## Reflection

1. What did you expect when two identical requests arrived concurrently before adding an in-flight lock?
2. What actually happened in your test?
3. Why is hashing the request payload alongside storing the `Idempotency-Key` essential?
4. What would you change at `10×` scale (e.g., moving from in-memory map to PostgreSQL unique constraint + Redis/TTL cleanup, key expiration after `24h`, and separating transient `5xx` errors from permanent `4xx` cached responses)?

## Cleanup

Stop the local HTTP server (`Ctrl+C` or `kill` its PID) and remove any temporary `/tmp` SQLite file if created.

## References

- [Stripe Engineering · Designing Robust and Predictable APIs with Idempotency](https://stripe.com/blog/idempotency)
- [Stripe Docs · Idempotent Requests](https://stripe.com/docs/api/idempotent_requests)
- [IETF Draft / HTTP Semantics · RFC 9110 Section 9.2.2 (Idempotent Methods)](https://www.rfc-editor.org/rfc/rfc9110#section-9.2.2)
