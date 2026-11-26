---
title: "27 · Batch, Stream Processing & Real-Time OLAP"
slug: "27-stream-olap"
lesson: "../lessons/27-stream-olap.md"
theme: "dark"
aspect: "16:9"
---

# Streaming & Real-Time OLAP
## Columnar scans, event-time watermarks & Lambda vs. Kappa

StackShade · System Design · Module 05

<!-- note: Final lesson of Module 05: turning unbounded event streams into fast, accurate analytical dashboards. -->

---

# The Problem: Subway Tunnels & OLTP Meltdowns

- `50,000 clicks/s`: summing 1 hour of `clicks` in Postgres reads `72 GB` of full rows!
<!-- step -->
- Mobile users enter a tunnel at `12:00:15` and flush buffered clicks at `12:04:20`
<!-- step -->
- **Processing-time** buckets corrupt `12:00` vs `12:04` totals—yet waiting forever stalls dashboards!

<!-- note: Two distinct problems: row-vs-column storage physics, and event-time-vs-processing-time semantics. -->

---

# Row Store (OLTP) vs. Columnar Store (OLAP)

| Dimension | OLTP (Postgres / MySQL) | Columnar OLAP (Parquet / ClickHouse) |
|---|---|---|
| **Disk Layout** | All columns of row `i` together | All values of column `c` together |
| **Best For** | Point `SELECT` / `UPDATE` (`1` user) | `SUM` / `GROUP BY` across `1B` rows |
| **Compression** | Modest (`~1.5–2×`) | Dense dictionary/RLE (`5–10×`) |

<!-- note: Columnar stores read ONLY the queried columns and run vectorized SIMD loops over compressed blocks. -->

---

# Event Time, Processing Time & Watermarks

```mermaid
flowchart LR
  S[/Out-of-Order Stream/] -->|Extract event_time + W(t)| OP[Window Operator]
  OP -->|On-time| W1[12:00-12:01 Window]
  W1 -->|W(t) passes cutoff| OLAP[(ClickHouse / Pinot)]
  OP -.->|Late arrival| LATE[/Side Output / Upsert/]
```

- **Watermark `W(t)`:** Heuristic clock asserting *"no more events expected before `t`."*
<!-- step -->
- Balances **dashboard freshness** (tight watermark) vs. **completeness** (wide watermark).

<!-- note: Explain Tumbling (fixed non-overlapping), Sliding (overlapping), and Session (inactivity gap) windows. -->

---

# Interactive Watermark & Late-Event Sim

<!-- anim: anim-watermark-late-events -->

Adjust **Watermark Delay (`5 s` vs `60 s`)** and watch tunnel-delayed mobile clicks land in the window vs. late side output.

<!-- note: Show learners the direct trade-off: tighter watermark = faster finalization, more late events diverted. -->

---

# Worked Math: 1-Day Scan (`4.32B` Rows)

Assume **50,000 events/s** (`4.32B/day`), **30 columns (`400 B/row`)**, query uses **2 columns (`16 B/row`)**:

<!-- step -->
- **OLTP Row Scan:** `4.32B × 400 B = 1.728 TB` read → **`~14.4 minutes`** at `2 GB/s`!
<!-- step -->
- **Columnar OLAP (`4×` compressed `2` cols = `4 B/row`):** `17.28 GB` read → **`~1.1 seconds`** (`100×` less I/O!)
<!-- step -->
- **Window State (`500k` campaigns × `3` open windows × `128 B`):** **`192 MB`** (fast S3 checkpoints!)

<!-- note: Contrast 14.4 minutes vs 1.1 seconds—that is purely data layout + column pruning + compression! -->

---

# Fault-Tolerant Stream State

How do stream engines survive crashes without losing 10-minute window counts?

<!-- step -->
- Store active window sums in local **RocksDB**
<!-- step -->
- Inject **checkpoint barriers** periodically → flush incremental state deltas to S3
<!-- step -->
- On crash: rewind Kafka offsets to last barrier + restore RocksDB (**effectively-once** sums!)

<!-- note: Reference Chandy-Lamport distributed snapshots conceptually without overloading terminology. -->

---

# Lambda vs. Kappa Architecture

| Architecture | Pipeline Design | Trade-Off |
|---|---|---|
| **Lambda** | Separate **Speed** (Flink) + **Batch** (Spark) layers | Exact batch truth, but **2 codebases** drift |
| **Kappa** | **Single Stream** job; replay log from `offset 0` to backfill | 1 codebase; needs durable log/Iceberg history |

<!-- note: Most modern teams lean toward Kappa or unified Beam/Flink + Lakehouse (Iceberg/Delta) to avoid maintaining two engines. -->

---

# At 10× and 100× Scale

- **10× (`500k events/s`):** Add **Rollup Materialized Views** (1-min / 1-hr cubes) in ClickHouse/Pinot to cut scan cost `100×` further.
<!-- step -->
- **100× (`5M events/s`, `170 TB/day`):** Use a **Lakehouse tiered model** (Iceberg/Parquet on S3 for cold SQL + `7-day` hot NVMe OLAP), and **HyperLogLog** for approximate `COUNT(DISTINCT)`.

<!-- note: Warn against exact COUNT(DISTINCT user_id) in streaming—O(N) RAM explodes; HLL takes fixed ~12 KB per bucket. -->

---

# Retrieval & Stage 2 Bridge

1. Why is a columnar store up to `100×` faster for `SUM(amount)` over 4B rows?
<!-- step -->
2. What does a **watermark** trade off in stream windowing?
<!-- step -->
3. How do **Lambda** and **Kappa** handle a bug in last month's aggregation logic?

**Next:** [28 · Partial Failure, Timeouts, Backoff, Jitter & Circuit Breakers](../lessons/28-partial-failure.md)

<!-- note: Congratulations on completing Modules 04 and 05! Next up is Module 06: Distributed Systems Theory & Coordination. -->
