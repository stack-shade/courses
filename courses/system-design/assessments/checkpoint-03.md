# Assessment 03 · Caching, Replication & Sharding

**Modules covered:** Module 03 (Caching & Stateless Compute) & Module 04 (Scaling Data: Replication & Sharding)
**Level:** Intermediate → Advanced
**Time:** 45–60 minutes

## Questions

1. A social app allows users to edit their profile bio. Right after clicking **Save** (`HTTP 200`), the page reloads and shows the *old* bio for 3 seconds before updating. Identify the exact replication anomaly and propose two concrete routing or version-token fixes with their trade-offs.
2. You manage a Redis cluster using cache-aside in front of PostgreSQL. A viral post expires at `12:00:00`, and `8,000` concurrent requests hit a cache miss simultaneously, crashing the database. Contrast how **singleflight (request coalescing)**, **TTL jitter**, and **probabilistic early expiration** address this failure.
3. Explain why `hash(user_id) % N` fails during elastic cache scaling, and how **consistent hashing with virtual nodes (`vnodes`)** bounds both key movement and shard skew. What happens to read-after-write or multi-replica placement if two consecutive `vnodes` on the ring belong to the same physical machine?
4. A single-shard `events` table grows to `4 TB` and `25,000` writes/s. Compare **range partitioning** by `created_at` against **hash partitioning** by `tenant_id` across: (a) hot-shard risk on today's writes, (b) time-range analytics scans, and (c) multi-tenant isolation.
5. An `orders` table is partitioned by `celebrity_merchant_id`. During a 10-minute flash drop, `merchant_42` generates `40,000 writes/s` while all other 9,999 merchants generate `5 writes/s` combined. Explain **key salting** (`merchant_42#0..K`) and its impact on read fan-out and pagination.
6. Your team needs globally unique, time-sortable primary keys across 64 database shards at `50,000 IDs/s` peak. Compare **UUIDv4**, **UUIDv7 (RFC 9562)**, and **64-bit Snowflake IDs** on storage size, B+Tree page-split behavior, clock-skew failure modes, and information leakage.
7. An application scales from 10 pods to 120 pods, each configured with a local pool of 25 Postgres connections (`max_connections = 500` on the primary). Explain why the database crashes even when CPU utilization is only 20%, and how a transaction-mode connection pooler (`PgBouncer`) solves it.

## Practical task

Design an **Expand-Contract zero-downtime migration plan** to re-shard a live `500 GB` (`300 million rows`) `notifications` table from `shard_key = notification_id` to `shard_key = user_id` across 8 PostgreSQL shards, serving `4,000 writes/s` and `18,000 reads/s` (`p95 < 30 ms`).

Include:
- A numbered 4-phase sequence (Expand, Dual-Write + Throttled Backfill, Shadow-Read Parity, Cutover + Contract).
- Explicit backfill math: if you backfill in batches of `2,000` rows every `50 ms`, how many rows/sec is that, and how many minutes/hours does `300 million rows` take?
- How you prevent a stale backfill row from overwriting a newer live dual-write (`updated_at` / version guard).
- Your instant rollback trigger and procedure if error rate or `p95` exceeds SLO after read cutover.

## Scoring rubric

| Criterion | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Understanding | Missing | Partial | Correct | Precise |
| Application | No attempt | Weak fit | Sound fit | Defends alternatives |
| Reasoning | No rationale | Limited | Clear | Evidence and trade-offs |

## Answer guide

<details><summary>Reveal hints</summary>

1. **Anomaly:** Read-your-own-writes (RYOW) violation caused by asynchronous replication lag (`write -> Leader`, `read -> lagging Follower`). **Fixes:** (a) Route the author's own profile reads (or all reads within a `T`-second post-write window) to the leader; (b) Return a monotonic LSN/WAL position or logical timestamp on write and have replicas wait or forward to leader if `replica_lsn < client_lsn`. Trade-off: leader routing raises leader read load; LSN-wait adds tail latency when a replica lags.
2. **Cache stampede:** Singleflight collapses `8,000` concurrent in-process misses for the same key into `1` DB query (remaining `7,999` await the leader future). TTL jitter (`base_ttl + rand(0, jitter)`) spreads expiry across time so keys don't expire together (prevents *cache avalanche* across many keys, though a single hot key still needs singleflight or early refresh). Probabilistic early expiration (XFetch) refreshes a hot key before TTL expires based on compute time and remaining TTL.
3. With `hash(k) % N`, changing `N` from `8` to `9` remaps `~88.9%` of keys. Consistent hashing moves only `~1/N` (`~11.1%`) on average. Virtual nodes reduce variance in arc lengths from `O(log N)` skew to `< 5%` at `100–150` vnodes/node. When walking clockwise for `R=3` replicas, the coordinator must skip vnodes belonging to physical machines already chosen in the preference list so replicas land on distinct failure domains.
4. **Range (`created_at`):** Great for time-range scans and pruning old partitions, terrible for today's writes (all `25,000 writes/s` hit the single newest partition = hot shard). **Hash (`tenant_id`):** Distributes writes evenly across all shards and isolates single-tenant scans to 1 shard, but cross-tenant time-range queries scatter-gather across every shard.
5. **Key salting** appends a deterministic or random suffix `0..K-1` (e.g., `K = 16`), splitting `40,000 writes/s` into `2,500 writes/s` across 16 partitions. **Cost:** Reads for `merchant_42` must fan out to all `K = 16` buckets and merge-sort results (`K`-way pagination), and you should only salt known hot keys (directory/threshold flag) rather than all `9,999` cold merchants.
6. **UUIDv4 (128-bit):** Fully random, causing frequent B+Tree page splits, low buffer-pool cache hit rate, and high write amplification at `50k inserts/s`. **UUIDv7 (128-bit):** 48-bit Unix ms timestamp prefix + random bits -> sequential B+Tree appends, standard 16-byte UUID compatibility, no central coordinator. **Snowflake (64-bit):** Half the index size of UUIDs (`8` bytes vs `16` bytes), embeds `10-bit` worker ID + `12-bit` sequence; requires worker-ID coordination and explicit handling of backward NTP clock jumps (wait, reject, or logical sequence). Note: both UUIDv7 and Snowflake leak creation timestamp (and Snowflake leaks worker ID / rough volume).
7. `120 × 25 = 3,000` connections > `max_connections = 500`, exhausting backend connection slots and memory (`~5–10 MiB` per Postgres process) while causing context-switch thrashing. `PgBouncer` in **transaction pooling** mode multiplexes `3,000` app client connections onto a smaller server pool (e.g., `100–200` active Postgres connections), avoiding session-level features like prepared statements unless configured cleanly.
8. **Practical task math:** `2,000 rows / 0.05 s = 40,000 rows/s`. `300,000,000 ÷ 40,000 = 7,500 seconds = 125 minutes ≈ 2.08 hours` (plus throttling headroom if DB replication lag rises). Guard updates using `WHERE target.version < source.version` (or `updated_at` + monotonic version) so an older backfill batch never clobbers a live dual-write. Keep dual-writing from `new -> old` briefly during read cutover so rollback is a single feature-flag flip back to `old` without data loss.

</details>
