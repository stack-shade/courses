# Lab 08 · Zero-Downtime Expand-Contract Schema & Shard Migration

**Goal:** Execute a simulated zero-downtime migration (changing a primary schema / partitioning key under continuous read+write traffic) using the 4-stage Expand-Contract pattern without dropping writes or serving corrupted reads.
**Level:** Intermediate → Advanced
**Estimated effort:** 75–100 minutes

## Scenario and setup

Your `orders` table currently partitions by `order_id`, causing merchant dashboard queries (`WHERE merchant_id = ? ORDER BY created_at DESC`) to scatter-gather across all shards. You need to migrate to a new `orders_v2` table partitioned by `(merchant_id, created_at, order_id)` while the application processes **200 writes/s** and **800 reads/s** with zero planned downtime and strict rollback safety.

Prerequisites:
- Local PostgreSQL 15+ (via Docker `postgres:16` or local install) or SQLite 3.40+ with a Python 3.10+ load driver script.
- Terminal access; zero cloud resources required.

## Starting assumptions

| Input | Value | How to validate |
|---|---:|---|
| Existing historical rows | 100,000 rows | Seed `orders_v1` before starting traffic |
| Continuous write rate | 200 writes/s (inserts + updates) | Async/threaded Python driver against DB |
| Continuous read rate | 800 reads/s | Concurrent reader loop checking invariants |
| Backfill batch size | 1,000 rows/batch with `20 ms` sleep | Throttle so replication lag and lock wait stay `< 50 ms` |
| Parity tolerance | `0` mismatched rows before cutover | Automated diff verifier (`v1` vs `v2`) |

## Tasks

- [ ] **Task 1 — Seed and start continuous traffic:** Create `orders_v1(order_id PK, merchant_id, amount_cents, status, updated_at)` with `100,000` rows. Start a background Python traffic generator performing `200 writes/s` (mix of `INSERT` and `UPDATE status`) and `800 reads/s` while recording p95 latency and error count.
- [ ] **Task 2 — Expand phase:** Create `orders_v2` with the new composite key/index `(merchant_id, updated_at, order_id)` and deploy dual-write logic in the application writer (writing `orders_v1` first, then upserting `orders_v2` in the same transaction or via outbox/trigger). Verify write p95 latency impact.
- [ ] **Task 3 — Throttled backfill:** Write an idempotent backfill script scanning `orders_v1` in keyset-paginated chunks of `1,000` rows (`WHERE order_id > last_id ORDER BY order_id LIMIT 1000`). Use `INSERT INTO orders_v2 ... ON CONFLICT (order_id) DO UPDATE ... WHERE orders_v2.updated_at < EXCLUDED.updated_at` (or timestamp guard) so stale backfill rows never overwrite newer dual-writes!
- [ ] **Task 4 — Shadow read & parity verification:** Enable `10%` shadow reads that query both `orders_v1` and `orders_v2`, log any row count or field discrepancy, and measure `orders_v2` p95 latency. Prove `0` mismatches after backfill catches up.
- [ ] **Task 5 — Cutover & fault injection:** Switch primary reads and writes to `orders_v2` (while still dual-writing `orders_v1` briefly for instant rollback). Intentionally kill the backfill script mid-run during an earlier dry run and verify restartability without duplicate errors or lost updates.
- [ ] **Task 6 — Contract phase:** After a simulated soak period, stop dual-writes to `orders_v1` and drop/archive the legacy table.

## Expected evidence

- Schema DDL, dual-write writer code, and idempotent backfill script.
- Measured metrics before, during backfill, during shadow reads, and after cutover:
  - Write throughput (`writes/s`) and `p95` latency (`ms`)
  - Backfill duration (`seconds`) and rows/sec rate
  - Shadow-read diff count (`0` mismatches at parity)
  - Query plan (`EXPLAIN ANALYZE`) showing scatter/seq scan eliminated on `orders_v2`
- Short explanation of the race condition prevented by the `updated_at` guard in Task 3.

## Reflection

1. What did you expect would happen if you ran an unguarded `INSERT ... ON CONFLICT DO UPDATE` during backfill?
2. What actually happened to write `p95` latency and DB CPU during dual-write + backfill?
3. Which assumption about batch size or lock duration needed adjustment?
4. What would you change at 10× scale (1 billion rows, cross-shard physical database split where single-DB transactions don't span `v1` and `v2`)?

## Cleanup

Stop the Python traffic generator and remove the local Docker container (`docker rm -f pg-lab08`) or temporary SQLite database file.

## References

- [Stripe Engineering · Online Migrations at Scale](https://stripe.com/blog/online-migrations) — four-step dual-write and shadow-read validation pattern.
- [GitHub Engineering · gh-ost](https://github.com/github/gh-ost) — triggerless online schema migration architecture.
- [PostgreSQL Docs · INSERT ON CONFLICT](https://www.postgresql.org/docs/current/sql-insert.html) — atomic conditional upserts.
