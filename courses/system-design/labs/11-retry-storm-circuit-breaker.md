# Lab 11 · Retry Storms, Jitter & Circuit Breakers

**Goal:** reproduce a cascading retry storm against a degraded downstream dependency and verify quantitatively how bounded timeouts, Full Jitter backoff, retry budgets, and a circuit breaker restore service stability.
**Level:** Advanced
**Estimated effort:** 60–90 minutes

## Scenario and setup

You operate a **Checkout API** calling a downstream **Payment Ledger** over HTTP. During a 10-second database lock stall on the ledger, the ledger's capacity drops from `1,000 req/s` to `200 req/s` (`p99` climbs from `25 ms` to `4,500 ms`). Naive clients have a `30 s` timeout and `3` immediate retries.

**Prerequisites & tools:**
- Python 3.10+ (or Go / Node.js) to run a local single-file discrete-event or HTTP simulator (`localhost` only; zero cloud spend).
- Optional: `curl`, `hey` or `vegeta` if testing against two local processes on loopback ports `127.0.0.1:8081` and `127.0.0.1:8082`.
- Safety note: Run all load generation strictly against `127.0.0.1` loopback endpoints.

## Starting assumptions

| Input | Value | How to validate |
|---|---:|---|
| Healthy client arrival rate | `400 req/s` | Fixed generator tick in local harness |
| Downstream healthy capacity | `1,000 req/s` (`25 ms` service time) | Local server semaphore / worker pool size |
| Degraded interval (`t = 10 s .. 20 s`) | Capacity drops to `150 req/s` (`800 ms` service time) | Scheduled fault-injection window |
| Naive retry policy | `max_retries = 3`, `delay = 0 ms`, `timeout = 5,000 ms` | Client config under test |
| Hardened retry policy | `timeout = 300 ms`, Full Jitter (`base = 50 ms`, `cap = 1,000 ms`), retry budget `10%`, Circuit Breaker (`50%` fail over `20` reqs, `5 s` Open) | Client config under test |

## Tasks

- [ ] **Task 1 — Build the local fault-injection harness:** Write a small local simulator (or two-process HTTP server + client driver in Python/Go) where downstream handles `C` concurrent workers with service latency `L`, and between `t = 10 s` and `t = 20 s` drops workers/increases `L` to simulate brownout.
- [ ] **Task 2 — Measure the naive retry storm:** Run `400 req/s` for `45 s` with naive retries (`3` immediate retries, `5,000 ms` timeout). Record incoming arrival rate to downstream (`req/s`), queue depth, goodput (successful `200 OK` responses/s), and time until full recovery after `t = 20 s`.
- [ ] **Task 3 — Add deadlines + Exponential Backoff with Full Jitter:** Cap per-attempt timeout at `300 ms` and sleep `random.uniform(0, min(1000, 50 * 2**attempt))` ms. Re-run the exact `45 s` trace and compare downstream peak QPS and retry synchronization.
- [ ] **Task 4 — Add a Retry Budget + Circuit Breaker:** Enforce a `10%` token-bucket retry budget per client plus a `Closed -> Open -> Half-Open` breaker (`Open` for `5 s` when error rate exceeds `50%` over `20` requests; `3` probes in `Half-Open`). Re-run and measure recovery time and caller `p99` fail-fast latency during the outage.

## Expected evidence

- Simulator/harness source file (committed to your scratch/study repo) and exact invocation command.
- Time-series table or plot (`t = 0..45 s` at `1 s` buckets) comparing Naive vs. Full Jitter vs. Full Jitter + Circuit Breaker:
  - Caller offered load (`req/s`)
  - Downstream received load (`req/s` including retries)
  - Successful goodput (`req/s`)
  - Caller `p95` / `p99` latency (`ms`)
  - Recovery timestamp (`s` after `t = 20 s` when goodput returns to `400 req/s`).
- Brief note explaining why the naive configuration remained overloaded *after* `t = 20 s` (metastable failure).

## Reflection

1. What did you expect the downstream QPS to be at `t = 22 s` after the downstream fault healed?
2. What actually happened under naive retries vs. Full Jitter + Circuit Breaker?
3. Which assumption about "retrying makes my service more reliable" broke when upstream timeouts exceeded downstream queue drain time?
4. What would you change at 10× scale (`4,000 req/s` across `50` stateless client pods where each pod maintains an independent in-memory circuit breaker)?

## Cleanup

Stop any local background server processes (`pkill -f` or `Ctrl+C`) and remove temporary log files in `/tmp`. No cloud resources are used.

## References

- [Lesson 28 · Partial Failure, Timeouts, Backoff, Jitter & Circuit Breakers](../lessons/28-partial-failure.md)
- [AWS Builders' Library · Timeouts, Retries & Backoff with Jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)
- [Marc Brooker · Exponential Backoff and Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)
