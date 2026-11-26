# Lab 12 · Load Shedding, Backpressure & Token-Bucket Rate Limiting

**Goal:** protect an overloaded API service from queue-induced latency collapse by implementing bounded queues, LIFO/priority load shedding, and a Token Bucket rate limiter, then verifying `p99` latency under `150%` overload.
**Level:** Advanced
**Estimated effort:** 60–90 minutes

## Scenario and setup

Your **Order Ingestion Service** has a hard downstream capacity of `200 req/s` (`4` workers × `20 ms` average DB write). During a flash sale, traffic spikes to `320 req/s` (`160%` capacity) with a `1,000 ms` client deadline. Without shedding, an unbounded FIFO queue fills up until every request spends `> 1,200 ms` waiting in line and times out—zero useful work completes!

**Prerequisites & tools:**
- Python 3.10+ (or Go) local HTTP server + load driver (`aiohttp`/`asyncio` or `net/http`) on `127.0.0.1`.
- Optional: `hey` or `wrk` for external HTTP benchmarking.
- Safety note: Execute strictly against `127.0.0.1` loopback; zero external traffic or cloud cost.

## Starting assumptions

| Input | Value | How to validate |
|---|---:|---|
| Healthy service throughput | `200 req/s` (`4` workers, `20 ms`/req) | Measure steady-state max RPS at `100%` utilization |
| Flash-sale offered load | `320 req/s` (`80%` `tier=browse`, `20%` `tier=checkout`) | Load driver tags `X-Priority: high\|low` |
| Client SLA deadline | `500 ms` end-to-end | Load driver marks any response `> 500 ms` as timed-out failure |
| Unbounded FIFO baseline | `queue_cap = unlimited`, FIFO order | Baseline run for `30 s` at `320 req/s` |
| Shedding target | `queue_cap = 20`, LIFO for same priority, shed `tier=browse` first (`429` / `503` + `Retry-After`) | Hardened run for `30 s` at `320 req/s` |

## Tasks

- [ ] **Task 1 — Reproduce FIFO queue collapse:** Run an HTTP worker pool (`200 req/s` capacity) behind an unbounded FIFO queue under `320 req/s` offered load for `30 s`. Measure `p50`, `p95`, `p99` latency and "useful goodput" (requests completed within the `500 ms` client deadline).
- [ ] **Task 2 — Enforce a bounded queue + deadline propagation:** Limit queue capacity to `20` items (`100 ms` max queue wait) and check `request_deadline` before starting work in the worker. Observe how `p99` of accepted `200 OK` requests changes and confirm rejected requests return `503 Service Unavailable` in `< 2 ms`.
- [ ] **Task 3 — Add Priority + LIFO shedding:** Give `tier=checkout` priority over `tier=browse` and process within-tier queues in **LIFO** order during overload (dropping oldest expired items). Measure `checkout` vs `browse` success rates at `320 req/s`.
- [ ] **Task 4 — Add a Token Bucket edge rate limiter:** Implement an atomic per-tenant Token Bucket (`rate = 20 req/s`, `burst = 40`) in front of the service (pure Python/Go or local Redis Lua script). Inject one noisy tenant sending `150 req/s` and verify healthy tenants keep `100%` availability.

## Expected evidence

- Server + load-test scripts and exact run commands.
- Comparison table across all 4 runs showing:
  - Offered RPS vs Accepted RPS vs Useful Goodput (`< 500 ms`)
  - `p50`, `p95`, `p99` latency (`ms`) for `200 OK` responses
  - `checkout` success rate (`%`) vs `browse` success rate (`%`)
  - CPU/memory utilization or queue depth snapshot.
- Short explanation of why LIFO outperforms FIFO when a queue cannot drain faster than arrivals.

## Reflection

1. What did you expect useful goodput to be at `320 req/s` with an unbounded FIFO queue?
2. What actually happened to `p99` and useful work in Task 1 vs Task 3?
3. Which assumption about "fairness" (FIFO) fails during sustained overload?
4. What would you change at 10× scale (`3,200 req/s` across `16` API replicas sharing Redis-backed tenant rate limits)?

## Cleanup

Terminate local test server and Redis container (if started, e.g., `docker rm -f lab12-redis`). Verify no processes remain bound to test ports.

## References

- [Lesson 33 · Reliability Engineering, SLIs/SLOs & Overload Control](../lessons/33-reliability-overload.md)
- [Google SRE Book · Handling Overload](https://sre.google/sre-book/handling-overload/)
- [AWS Builders' Library · Using Load Shedding to Avoid Overload](https://aws.amazon.com/builders-library/using-load-shedding-to-avoid-overload/)
