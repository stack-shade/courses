---
id: "27"
module: "05"
title: "Batch, Stream Processing & Real-Time OLAP"
level: "Intermediate to Advanced"
status: "draft"
durationMinutes: 30
prerequisites:
  - "26-search-pipelines"
objectives:
  - "Contrast OLTP row stores against OLAP columnar formats (Parquet) and real-time OLAP engines"
  - "Distinguish event time from processing time and bound late arrivals using watermarks"
  - "Compare tumbling, hopping/sliding, and session stream windows with checkpointed state"
  - "Evaluate Lambda vs. Kappa architectures for combining historical and real-time analytics"
slides: "../slides/27-stream-olap.md"
downloadHtml: "../downloads/27-stream-olap.html"
diagrams: []
animations:
  - "anim-watermark-late-events"
youtube:
  videoId: null
  publishedAt: null
  chapters: []
  transcriptUrl: null
---

# 27 · Batch, Stream Processing & Real-Time OLAP

**Level:** Intermediate → Advanced · **Status:** Draft · **Module:** 05 · Asynchronous Systems, Streaming & Search

## Learning objectives
- Explain why running analytical `SUM`/`GROUP BY` scans over millions of rows crushes OLTP row stores, and how **columnar storage** solves it.
- Separate **event time** (when an action happened) from **processing time** (when the worker received it).
- Bound out-of-order and late-arriving mobile events using **watermarks** and **allowed lateness**.
- Compare **Lambda** vs. **Kappa** architectures for unifying streaming dashboards with historical backfills.

---

## 1. The Problem: Mobile users in a tunnel broke our 1-minute billing dashboard

Your ad-tech platform streams **50,000 click events/s** into a dashboard showing *"Revenue per Campaign per Minute"*. Two things go wrong immediately:
1. **OLTP meltdown:** Querying `SELECT campaign_id, SUM(price_cents) FROM clicks WHERE ts >= NOW() - '1 hour' GROUP BY 1` against the primary PostgreSQL replica reads `180 million` full rows (`400 bytes` each = `72 GB` of disk I/O) just to read two 8-byte columns, spiking OLTP latency for everyone.
2. **Tunnel time-travel:** A commuter's phone clicks an ad at `12:00:15`, loses cell service inside a subway tunnel for `4 minutes`, and flushes its buffered event at `12:04:20`. If your stream processor buckets events by **when the server received them (processing time)**, the `12:00` minute window undercounts and `12:04` gets fake traffic! Yet if you wait forever for subway commuters, the `12:00` window *never* closes.

Real-time analytics demands two pillars: **columnar OLAP storage** for fast scans, and **event-time windowing with watermarks** for accurate, bounded streaming aggregation.

---

## 2. Mental Model: Row binders vs. column ledgers, and closing the ballot box

- **Row Store (OLTP) vs. Columnar Store (OLAP):**
  - **OLTP (Postgres/MySQL row pages):** Stores `[user=1, country=IN, amount=50]`, `[user=2, country=US, amount=20]` contiguously. Great for fetching or updating **one entire user** in 1 disk seek; terrible when summing `amount` across 100M rows because you must read `user`, `email`, and `metadata` off disk too.
  - **OLAP (Parquet / ClickHouse / BigQuery):** Stores all `country` values together `[IN, US, ...]` and all `amount` values together `[50, 20, ...]`. Reading `SUM(amount)` touches **only the `amount` column**—and since identical countries or timestamps repeat consecutively, run-length/dictionary compression shrinks data **`5–10×`** and enables vectorized SIMD CPU scans!
- **Event Time vs. Processing Time & Watermarks:**
  - **Event Time:** The timestamp stamped on the click when the user tapped (`12:00:15`).
  - **Processing Time:** Wall-clock time when Flink/Kafka Streams receives the packet (`12:04:20`).
  - **Watermark `W(t)`:** A moving heuristic clock asserting *"We believe all events with `event_time < t` have arrived; close windows ending before `t`."* Anything arriving *after* the watermark passes is routed as **late data** (either dropped, sent to a side-output, or merged via allowed lateness).

---

## 3. How It Works Under the Hood

### Stream Windowing & Watermark Cutoff

Stream engines (Apache Flink, Spark Structured Streaming, Kafka Streams) group unbounded events into finite windows:
- **Tumbling Window:** Fixed, non-overlapping slices (`[12:00–12:01)`, `[12:01–12:02)`).
- **Sliding / Hopping Window:** Overlapping slices (`5-minute` window sliding every `1 minute`) for moving averages.
- **Session Window:** Dynamic gap-based slices (closes after `15 minutes` of user inactivity).

```mermaid
flowchart LR
  S[/Raw Click Stream: out-of-order/] -->|Extract event_time & emit W(t)| OP[Stateful Window Operator]
  OP -->|event_time >= W(t): On-time| W1[12:00-12:01 Window State]
  W1 -->|Watermark passes 12:01 + 30s| OLAP[(Real-Time OLAP: ClickHouse / Pinot)]
  OP -.->|event_time < W(t): Late arrival| LATE[/Late Data Side Output / Backfill/]
  OP <==> CP[(Incremental Checkpoint: S3 / RocksDB)]
```

**Fault-Tolerant State via Checkpoints:** Stateful aggregators (counting clicks across 10-minute windows) store partial sums in local RocksDB and periodically emit **checkpoint barriers** (Chandy-Lamport distributed snapshots) into the stream, flushing state deltas to S3. On worker crash, Flink rewinds Kafka offsets to the last completed barrier and restores RocksDB state—achieving **effectively-once** window sums.

### Lambda vs. Kappa Architecture

1. **Lambda Architecture (Two Paths):**
   - *Speed Layer* (Flink/Storm) produces fast approximate real-time views; *Batch Layer* (Spark over S3 Parquet) recomputes exact truth every night; *Serving Layer* merges both.
   - **Cost:** Maintaining **two separate codebases** (e.g., Java Flink + Python Spark) with subtle logic drift between batch and stream!
2. **Kappa Architecture (One Stream Path):**
   - Everything is an immutable log (Kafka / Iceberg). A single streaming job computes live aggregates into ClickHouse/Pinot; when business logic changes, spin up a second stream job reading from **offset 0 (or S3 tiered log)** to backfill a new table, then atomically swap dashboard pointers.

---

## 4. Worked Example & Interactive Visualization

Let's quantify **OLTP row scan vs. OLAP columnar scan** and **stream window state memory**:

**Workload assumptions:**
- Click stream: `50,000 events/s` (`4.32 billion events/day`)
- Full row schema: `30 columns`, total `400 bytes/row` uncompressed (`1.728 TB/day` raw)
- Query: `SELECT campaign_id, SUM(price_cents) FROM clicks WHERE day = '2026-11-26' GROUP BY 1` (only `2` columns needed: `campaign_id` 8B + `price_cents` 8B = `16 bytes/row`)
- Windowed state: `1-minute` tumbling windows over `500,000` active campaigns (`128 bytes` state per campaign per open window), watermark delay `= 30 seconds`, allowed lateness `= 2 minutes`.

**Calculations:**
1. **OLTP Row Scan vs. Columnar OLAP Scan (1 day = `4.32B` rows):**
   - **OLTP Row Store:** Reads all `400 B` per row = `4.32B × 400 B = 1.728 TB` read off disk! At `2 GB/s` NVMe scan speed = **`864 seconds (~14.4 minutes)`**.
   - **Columnar Parquet / ClickHouse:** Reads only `2` columns (`16 B/row`) compressed `4×` via dictionary/delta encoding (`4 B/row`) = `4.32B × 4 B ≈ 17.28 GB` read (**100× less I/O!**). At `4 GB/s` vectorized scan across 4 nodes = **`~1.1 seconds`**!
2. **Stream Window State Footprint:**
   - With `1-minute` windows + `2-minute` allowed lateness, up to **`3` concurrent windows** stay open in memory/RocksDB per campaign (`12:00`, `12:01`, `12:02`).
   - State size = `500,000 campaigns × 3 windows × 128 bytes ≈ 192 MB` (tiny enough to checkpoint to S3 every `10 s` in `< 200 ms`!).
   - *Trap:* If you keep `7-day` session windows open for `100M` users without TTL eviction, state explodes to `100M × 128 B = 12.8 GB`+ and checkpoints stall!

**Interactive Visualization (`anim-watermark-late-events`):**
In `anim-watermark-late-events`, watch out-of-order click events arrive with staggered delays (`+2 s`, `+15 s`, `+90 s`). Adjust the **Watermark Delay slider** to see how a tighter watermark (`5 s`) cuts dashboard latency while sending subway-delayed events to the late-data side output, whereas a wider watermark (`60 s`) captures more late clicks at the cost of waiting longer to finalize each minute's total.

---

## 5. Trade-Offs & Failure Modes

| Choice | Benefit | Cost / Risk | Fails When |
|---|---|---|---|
| **OLTP Row Store for Analytics** | Zero ETL lag; reads live transactional state | Full-row I/O crushes disk/buffer pool; queries steal OLTP CPU | Ad-hoc aggregations over `> 10M` rows or multi-day scans |
| **Columnar OLAP (ClickHouse / Pinot / BigQuery)** | `10–100×` faster column scans & compression; vectorized aggregations | Poor at single-row `UPDATE`/`DELETE` mutations; micro-batch/streaming ingest lag (`1–10 s`) | Point transactions (`UPDATE balance SET ... WHERE id = 1`) |
| **Tight Watermark (`5 s` delay)** | Fast dashboard updates (`5 s` finalization) | Drops or diverts mobile/offline events delayed `> 5 s` into side outputs | Mobile telemetry or batch-uploaded IoT sensors with multi-minute offline buffering |
| **Lambda Architecture** | Battle-tested batch exactness + low-latency speed layer | Double engineering effort; subtle metric discrepancies between batch and stream code | Small/medium teams who can run Kappa replay or unified Apache Beam/Flink SQL |

### What changes at 10× and 100× scale?
- **At 10× (`500,000 events/s`, `17 TB/day` raw):** Scanning raw event rows for every dashboard load becomes expensive even in columnar OLAP. Introduce **pre-aggregated Rollup Materialized Views** (1-minute and 1-hour cubes summing `price_cents` and `clicks` on ingest), cutting query scan volume another `100–1,000×`.
- **At 100× (`5M events/s`, `170 TB/day` raw):** Storing every raw event in hot NVMe OLAP for years is unaffordable. Adopt a **Lakehouse tiered architecture** (Apache Iceberg / Delta Lake on S3 Parquet for cold/historical batch SQL + `7-day` hot ClickHouse/Pinot tier for sub-second user-facing dashboards), and guard against **high-cardinality `GROUP BY` OOMs** (e.g., grouping by `user_id` or `UUID` instead of `campaign_id`) using HyperLogLog for approximate `COUNT(DISTINCT)`.

---

## 6. Practical Exercise & Stage 2 Project Bridge

1. **Watermark Design Drill:** A fitness wearable syncs workout heart-rate events over Bluetooth when the user returns home (`up to 4 hours` after the workout!). Should you use a `30-second` watermark and drop late data, or combine a `1-minute` watermark for live display with **allowed lateness + upserts (`ReplacingMergeTree` / OLAP merge)**? Trace how dashboard numbers evolve as late syncs arrive.
2. **Stage 2 Integration:** Combine Modules 04 & 05 in your notes to sketch a **Hybrid Social News Feed + Notification Platform**—showing how sharded user timelines, Redis hot-key caching, Transactional Outbox + CDC, and Kafka fan-out workers connect end-to-end.

---

## 7. Retrieval Practice & Primary Sources

1. Why does summing one column across 1 billion rows run up to `100×` faster in Parquet/ClickHouse than in PostgreSQL?
2. What is the exact difference between **event time** and **processing time**, and why does a watermark solve a problem that processing-time windows hide?
3. How do **Lambda** and **Kappa** architectures differ when you discover a bug in last month's revenue aggregation logic?
4. Why is `COUNT(DISTINCT user_id)` dangerous in real-time streaming over a 24-hour window, and what approximation algorithm fixes it?

<details><summary>Hints</summary>
1. Columnar stores read *only* the referenced column blocks from disk (skipping unused columns completely) and compress identical adjacent column values densely (`4–10×` less I/O), enabling vectorized SIMD CPU processing.
2. Event time is when the user clicked; processing time is when the server saw the packet. Processing-time windows silently misattribute delayed events to the wrong minute whenever queues lag or clients go offline; watermarks let operators aggregate by true event time while bounding how long to hold window state open.
3. In Lambda, you fix the bug in the Batch job (Spark) and backfill; in Kappa, you update the single streaming job (Flink), rewind/replay the retained event log (or Iceberg/S3 history) into a fresh output table, and swap pointers.
4. Exact `COUNT(DISTINCT)` requires storing every unique `user_id` in RAM/RocksDB per window (`O(N)` memory). **HyperLogLog (HLL)** estimates cardinality within `~0.8%` standard error using fixed `~1.5–12 KB` registers per bucket (`O(1)` memory).
</details>

### Primary Sources
- **Foundational Essay:** Tyler Akidau, *The World Beyond Batch: Streaming 101* ([O'Reilly](https://www.oreilly.com/radar/the-world-beyond-batch-streaming-101/)) & *Streaming 102* — canonical model of event time, watermarks, triggers, and accumulation.
- **Official Docs:** [Apache Flink · Event Time and Watermarks](https://nightlies.apache.org/flink/flink-docs-stable/docs/concepts/time/) — watermark generators, allowed lateness, and side outputs.
- **Official Docs:** [Apache Parquet Format Specification](https://parquet.apache.org/docs/file-format/) & [ClickHouse MergeTree Architecture](https://clickhouse.com/docs/en/engines/table-engines/mergetree-family/mergetree) — columnar encoding and real-time OLAP rollups.
- **Engineering Essay:** Jay Kreps, *Questioning the Lambda Architecture* ([O'Reilly](https://www.oreilly.com/radar/questioning-the-lambda-architecture/)) — origin of Kappa architecture.

---

## Next
Continue to Module 06: [28 · Partial Failure, Timeouts, Backoff, Jitter & Circuit Breakers](28-partial-failure.md).
