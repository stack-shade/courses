# Lab 07 · Consistent Hashing Ring & Virtual Node Skew

**Goal:** Build and benchmark a consistent hashing ring in Python or Go to measure key distribution skew and key-remapping churn across `vnodes = 1`, `10`, and `150` when adding or removing a shard.
**Level:** Intermediate → Advanced
**Estimated effort:** 60–90 minutes

## Scenario and setup

You operate a distributed session cache storing **1,000,000 keys** across **8 cache shards**. With naive `hash(key) % N`, adding a 9th shard invalidates roughly `88.9%` (`8/9`) of cached keys at once, triggering a database stampede. You will replace modulo hashing with a 32-bit consistent hash ring (`0` to `2^32 - 1`) and verify how virtual nodes (`vnodes`) bound both storage skew and key movement.

Prerequisites:
- Python 3.10+ (standard library only: `hashlib`, `bisect`, `statistics`) or Go 1.21+.
- Local terminal; zero cloud cost or external services required.

## Starting assumptions

| Input | Value | How to validate |
|---|---:|---|
| Total logical keys | 1,000,000 | Generate deterministic keys `session:0` .. `session:999999` |
| Initial physical shards | 8 | `shard-0` .. `shard-7` |
| Hash space | 32-bit unsigned (`0..4,294,967,295`) | `int.from_bytes(hashlib.md5(k).digest()[:4], "big")` or CRC32/FNV-1a |
| Virtual node counts tested | `1`, `10`, `150` | Parameterize `vnodes_per_node` |
| Replication factor (optional) | 1 (primary) / 3 (walk ring) | Count distinct physical nodes encountered clockwise |

## Tasks

- [ ] **Task 1 — Baseline modulo hashing:** Implement `hash(key) % 8` for `1,000,000` keys. Record the percentage of keys that move when scaling from `8` to `9` shards. Confirm it is near `88.9%`.
- [ ] **Task 2 — Consistent hash ring:** Implement `HashRing(nodes, vnodes)` using a sorted list of `(token, node_id)` tuples and binary search (`bisect_right`) with wrap-around to index `0`.
- [ ] **Task 3 — Measure vnode skew:** Populate `1,000,000` keys with `vnodes = 1`, `10`, and `150`. For each setting, compute `min_keys`, `max_keys`, `mean_keys` (`125,000`), and coefficient of variation (`stddev / mean`) across the 8 shards.
- [ ] **Task 4 — Measure scale-out churn:** Add `shard-8` (9th shard) and compute the exact fraction of the `1,000,000` keys whose assigned primary shard changed. Compare against the theoretical `1 / 9 = 11.11%`.
- [ ] **Task 5 — Simulate node failure + weighted shards:** Remove `shard-3` and verify that only keys previously owned by `shard-3` move (roughly `1/8 = 12.5%`). Then give `shard-0` double RAM (`2× vnodes`) and confirm it receives `~2×` the keys of an ordinary shard.
- [ ] **Task 6 — Non-uniform hash traps:** Repeat Task 3 using raw `zlib.crc32` on sequential keys without MD5/Murmur/xxHash mixing, or with sequential `node_id` strings (`"s0"`, `"s1"`), and record how poor hash dispersion affects skew.

## Expected evidence

- Runnable script (`consistent_hash_bench.py` or `.go`) under 150 lines.
- Output table comparing `modulo`, `vnodes=1`, `vnodes=10`, and `vnodes=150`:
  - `min` / `max` keys per shard (`keys` and `%` of total)
  - Standard deviation and max-to-mean ratio (`max / 125,000`)
  - Exact `% keys remapped` when scaling `8 -> 9` shards
  - Lookup latency (`µs/lookup` across 1M lookups)
- Brief explanation of why `vnodes = 150` smooths skew but increases ring metadata size (`8 × 150 = 1,200` entries) and replication placement care (walking clockwise must skip duplicate physical nodes).

## Reflection

1. What did you expect the max-to-min shard ratio to be at `vnodes = 1` vs `vnodes = 150`?
2. What actually happened to both skew and lookup memory/time as `vnodes` increased?
3. Which assumption about hash uniformity or node weights failed or surprised you?
4. What would you change at 10× scale (e.g., 800 shards and 1,000 vnodes each = 800,000 ring tokens per router)?

## Cleanup

Delete any temporary benchmark scripts or output files if desired. No background services or cloud resources were provisioned.

## References

- [Amazon Dynamo Paper (DeCandia et al., SOSP 2007)](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf) — original virtual-node consistent hashing design.
- [Consistent Hashing and Random Trees (Karger et al., STOC 1997)](https://dl.acm.org/doi/10.1145/258533.258660) — foundational bounds on key movement.
- [Ketama Consistent Hashing (Memcached)](https://github.com/RJ/ketama) — classic production ring layout.
