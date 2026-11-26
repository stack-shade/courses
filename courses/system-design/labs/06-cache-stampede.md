# Lab 06 · Cache Stampedes, Singleflight & Penetration

**Goal:** Reproduce a thundering-herd cache stampede and a cache penetration attack locally, then measure how request coalescing (singleflight), TTL jitter, and negative caching stabilize database QPS and p99 latency.
**Level:** Intermediate
**Estimated effort:** 45–60 minutes

## Scenario and setup

Your product catalog endpoint `GET /products/{id}` serves 2,000 requests/second for a hot item (`id=42`) cached with a 5-second TTL. The backing database enforces a strict **max pool size of 10 connections**, and each query takes **120 ms**. When the key expires, every concurrent cache miss hits the database simultaneously.

### Prerequisites & safety
- Python 3.10+ (`asyncio` standard library; optional local Redis via Docker, or built-in in-memory TTL store so no external dependencies are required).
- Zero cloud cost.

Create a self-contained simulator script `stampede_lab.py` with:
- A simulated `Database` guarded by `asyncio.Semaphore(10)` (or failing fast with `PoolExhaustedError` after a 50 ms wait) and `await asyncio.sleep(0.12)` per query, counting `db_queries` and `errors`.
- An in-memory `TTLCache` storing `(value, expires_at)` with optional `jitter_s`.
- A workload generator firing **150 concurrent requests** for `product:42` immediately after expiry, and a second workload firing **200 requests** for random non-existent IDs (`product:999001`..`product:999200`).

## Starting assumptions

| Input | Value | How to validate |
|---|---:|---|
| Concurrent burst on expiry | 150 requests | `asyncio.gather(*[fetch(42) for _ in range(150)])` |
| DB query latency | 120 ms | `await asyncio.sleep(0.12)` |
| DB max connections | 10 connections | `asyncio.Semaphore(10)` + 50 ms acquire timeout |
| Base TTL | 5.0 seconds | Cache entry expiry timestamp |
| Penetration probe batch | 200 missing keys | `id` outside `1..1000` |

## Tasks

- [ ] **Task 1 — Reproduce the Thundering Herd (No Coalescing):** Prime `product:42`, wait for expiry, then fire 150 concurrent requests without coalescing. Measure `db_queries`, failed `503 PoolExhausted` responses, and `p95`/`p99` latency (ms).

- [ ] **Task 2 — Implement Singleflight (Request Coalescing):** Add an in-flight dictionary `inflight: dict[str, asyncio.Future]` keyed by `product:{id}`. When multiple coroutines miss on the same key concurrently, only the first coroutine creates the `Future` and queries the DB (cleaning up `inflight` in a `finally:` block so errors do not wedge future callers). Re-run the 150-request burst and verify `db_queries == 1` and `errors == 0`.

- [ ] **Task 3 — Add TTL Jitter for Mass Expiry (Avalanche Test):** Seed 500 keys (`product:1..500`) at `t=0` with identical `TTL=3.0s`. Compare DB QPS spike at `t=3.0s` under `jitter=0.0s` vs `jitter=uniform(-0.5, +0.5)` seconds.

- [ ] **Task 4 — Defend Against Cache Penetration:** Fire 200 requests for random non-existent IDs (`999001..999200`). Observe all 200 hitting the DB. Add:
  1. **Negative caching** (store a sentinel `NULL_MARKER` for `TTL=30s`), and
  2. A tiny **Bloom filter** (or bitset with 3 hash functions over `1..1000`) checked *before* querying the DB on miss. Measure DB queries before and after.

## Expected evidence

- Results table across all 4 tasks showing: Scenario, Concurrent Requests, `DB Queries Executed`, `Pool Errors`, `p50 (ms)`, and `p99 (ms)`.
- Code snippet of your `singleflight` helper demonstrating safe cleanup on exception (`try ... finally: inflight.pop(key, None)`).
- Short note on Bloom filter sizing (`m` bits, `k` hashes) for 1,000,000 valid product IDs at a 1% false-positive rate.

## Reflection

1. What did you expect to happen to `p99` latency for the 149 follower requests waiting on the 1 leader DB call in Task 2?
2. What actually happened when `PoolExhaustedError` occurred in Task 1 vs Task 2, and what happens if the singleflight leader itself times out?
3. Which assumption breaks if `singleflight` is only implemented *in-process* across 50 stateless API pods rather than globally? (Hint: how many DB queries execute at most?)
4. What would you change at 10× scale (a celebrity product receiving 50,000 QPS that saturates a single Redis shard's network interface)?

## Cleanup

Delete `stampede_lab.py` when finished, or save it in your personal learning log repo.

## References

- [Go `x/sync/singleflight` package design](https://pkg.go.dev/golang.org/x/sync/singleflight)
- [Vattani et al. · Optimal Probabilistic Cache Stampede Prevention (XFetch)](https://cseweb.ucsd.edu/~avattani/papers/cache_stampede.pdf)
- [Cloudflare Blog · Pingora & Request Coalescing](https://blog.cloudflare.com/)
