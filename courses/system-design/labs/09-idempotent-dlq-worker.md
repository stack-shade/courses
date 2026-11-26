# Lab 09 · Idempotent Consumer & Dead-Letter Queue (DLQ) Worker

**Goal:** Build a worker pipeline that survives duplicate deliveries, mid-processing crashes, and poison-pill messages using an idempotency store, bounded exponential backoff with jitter, and a Dead-Letter Queue with safe replay.
**Level:** Intermediate → Advanced
**Estimated effort:** 60–90 minutes

## Scenario and setup

Your billing worker consumes `PaymentCaptured` events from a message broker. Because the broker guarantees **at-least-once** delivery, network timeouts and consumer crashes before `ACK` cause the same `event_id` to be delivered `2–3` times. Worse, a malformed legacy payload (`amount: -50` or invalid JSON) crashes the consumer in an infinite retry loop, blocking healthy messages behind it.

Prerequisites:
- Python 3.10+ with `sqlite3` (for durable atomic ledger + idempotency table) or Docker Compose with Redis/Postgres.
- Zero external cloud services required.

## Starting assumptions

| Input | Value | How to validate |
|---|---:|---|
| Event stream batch | 1,000 events (15% duplicates, 2% poison pills) | Deterministic generator script |
| Transient failure rate | 10% simulated downstream 503 errors | Mock downstream RPC with fault injector |
| Max retry attempts | 4 attempts (`100ms, 200ms, 400ms, 800ms` + jitter) | Log timestamps per attempt |
| Ledger invariant | `sum(credits) == count(unique valid events) × amount` | Assert exact balance at end of run |

## Tasks

- [ ] **Task 1 — Naive consumer failure demo:** Run a baseline worker without idempotency checks against 1,000 events where 15% are redelivered and 5% crash after updating the ledger but before `ACK`. Record the corrupted final balance (double-charges).
- [ ] **Task 2 — Atomic idempotent processing:** Create `processed_events(event_id TEXT PRIMARY KEY, processed_at TEXT)` in the **same SQLite/Postgres database** as `account_ledger`. Wrap the idempotency insert (`INSERT OR IGNORE` / `ON CONFLICT DO NOTHING`) and the ledger balance update inside a single `BEGIN ... COMMIT` transaction.
- [ ] **Task 3 — Retry with exponential backoff + full jitter:** Catch transient `503` errors and retry up to 4 times using `sleep = random(0, min(cap, base * 2^attempt))`. Verify non-blocking or per-retry-topic handling so one slow message does not stall the entire partition.
- [ ] **Task 4 — Poison-pill quarantine to DLQ:** Route permanent deserialization/validation errors (and messages exhausting 4 retries) to a `dead_letter_queue` table/file with `original_payload`, `error_reason`, `attempt_count`, and `failed_at`.
- [ ] **Task 5 — Verify invariants & DLQ replay:** Assert zero double-charges across all `850` unique valid events despite `150` duplicates and simulated crashes. Fix the malformed poison-pill payloads in a replay script and re-drive them cleanly through the same idempotent consumer.

## Expected evidence

- Worker + fault-injector code and SQLite/Postgres schema.
- Summary log output:
  - Total messages consumed vs unique valid events committed
  - Duplicates safely skipped (exact count)
  - Poison pills quarantined to DLQ (`error_reason` recorded)
  - Final ledger balance matching expected exact total (`0` drift)
  - DLQ replay output proving re-driven messages succeed once and remain idempotent if replayed twice.

## Reflection

1. What did you expect to happen if the idempotency check used Redis *before* committing to the SQL ledger?
2. What actually happened when you simulated a crash between the SQL commit and the broker `ACK`?
3. Which assumption about ordering or retry blocking broke when a poison pill sat at the head of a single-threaded queue?
4. What would you change at 10× scale (50,000 events/s across 32 Kafka partitions where a single DB row lock on `processed_events` becomes hot)?

## Cleanup

Remove the local SQLite `.db` file and any temporary DLQ files (`rm -f lab09_ledger.db`).

## References

- [Apache Kafka Documentation · Delivery Semantics](https://kafka.apache.org/documentation/#semantics) — at-least-once vs exactly-once boundaries.
- [Stripe Engineering · Designing Robust and Predictable APIs with Idempotency](https://stripe.com/blog/idempotency) — atomic state + idempotency key commits.
- [Uber Engineering · Building Reliable Reprocessing and Dead Letter Queues with Kafka](https://www.uber.com/blog/reliable-reprocessing/) — non-blocking retry topics and DLQ replay.
