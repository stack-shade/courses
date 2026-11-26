# System Design Glossary

A concise reference across all 9 modules. Terms are grouped alphabetically with their module/lesson context so you can jump straight from a term to the deeper lesson.

| Term | Working Definition | Module |
|---|---|---|
| **ACID** | Database transaction guarantees: Atomicity, Consistency (invariants), Isolation, and Durability. | M02 · L13 |
| **Anycast** | Network addressing where multiple edge PoPs announce the same IP and BGP routes users to the nearest PoP. | M01 · L05 |
| **Availability** | Fraction of time (or valid requests) a service meets its defined usable condition. | M00 · L02 |
| **B+Tree** | Balanced disk-oriented tree index storing sorted keys in pages with fast range scans and in-place updates. | M02 · L11 |
| **Backpressure** | Signal or mechanism slowing upstream producers when downstream consumers or queues saturate. | M07 · L33 |
| **Bloom Filter** | Space-efficient probabilistic bit-array answering "definitely not in set" or "possibly in set". | M02 · L11 |
| **Bulkhead** | Isolating pools (threads, connections, queues) per dependency so one failure does not exhaust shared resources. | M07 · L33 |
| **Cache-Aside** | Pattern where the application checks the cache first, loads from DB on miss, and populates the cache. | M03 · L15 |
| **Cache Stampede** | Sudden burst of concurrent DB reads when a hot cached key expires or is evicted simultaneously. | M03 · L17 |
| **CAP Theorem** | During a network partition (`P`), a distributed data store must choose between linearizable consistency (`C`) and availability (`A`). | M06 · L31 |
| **CDC (Change Data Capture)** | Streaming row-level commits directly from a database write-ahead/binlog into downstream systems. | M05 · L25 |
| **CDN** | Geographically distributed edge network serving cached static/dynamic content closer to end users. | M01 · L07 |
| **Circuit Breaker** | State machine (`Closed → Open → Half-Open`) failing fast when a downstream dependency crosses an error threshold. | M06 · L28 |
| **Consistent Hashing** | Hash ring mapping keys and nodes (via virtual nodes) so node additions/removals remap only `~1/N` of keys. | M04 · L20 |
| **CRDT** | Conflict-Free Replicated Data Type allowing concurrent replicas to merge independently without coordination. | M06 · L30 |
| **CQRS** | Separating write command models from read-optimized query projections. | M05 · L25 |
| **Dead-Letter Queue (DLQ)** | Quarantine queue holding messages that repeatedly failed processing after max retries. | M05 · L24 |
| **Durability** | Guarantee that acknowledged writes survive process crashes, power loss, or disk failures. | M00 · L02 |
| **Error Budget** | Allowable unreliability (`1 - SLO`) used to balance feature velocity against reliability work. | M07 · L33 |
| **Eventual Consistency** | Guarantee that replicas converge to the same state if writes stop, without bounding stale reads during propagation. | M06 · L30 |
| **Fencing Token** | Monotonically increasing token issued with a distributed lock/lease and checked by storage to block stale holders. | M06 · L29 |
| **Idempotency** | Property where repeating an identical request or message produces the same side effect as executing it once. | M01 · L09 / M05 · L24 |
| **Inverted Index** | Mapping from normalized tokens/words to sorted lists of document IDs containing them. | M05 · L26 |
| **Jitter** | Controlled randomness added to retry backoff delays or TTLs to prevent synchronized herd spikes. | M03 · L17 / M06 · L28 |
| **Latency (`p50/p95/p99`)** | Time taken by a single operation; percentiles measure tail behavior hidden by averages. | M00 · L02 |
| **Linearizability** | Strongest single-object consistency model: once a write finishes, every subsequent read sees it or a newer value. | M06 · L30 |
| **Little's Law** | Queuing identity `L = λ × W` relating average concurrency (`L`), arrival rate (`λ`), and latency (`W`). | M00 · L03 |
| **Load Shedding** | Deliberately dropping lower-priority requests early under overload to protect core latency and stability. | M07 · L33 |
| **LSM-Tree** | Log-Structured Merge-Tree appending writes sequentially to MemTable + WAL and merging immutable SSTables in background compaction. | M02 · L11 |
| **MVCC** | Multi-Version Concurrency Control retaining multiple row versions so readers do not block writers. | M02 · L13 |
| **Outbox Pattern** | Writing business state and an outbox event row in one local ACID transaction before relaying to a message broker. | M05 · L25 |
| **PACELC** | Extension of CAP: on Partition (`P`), choose `A` or `C`; Else (`E`), choose Latency (`L`) or Consistency (`C`). | M06 · L31 |
| **Quorum (`R + W > N`)** | Setting read (`R`) and write (`W`) replica counts so at least one replica overlaps between latest write and read. | M06 · L30 |
| **Raft** | Understandable consensus algorithm using elected term leaders and majority log replication. | M06 · L31 |
| **Replication Lag** | Delay between committing a write on a primary node and applying it on read replicas. | M04 · L19 |
| **RPO / RTO** | Recovery Point Objective (max acceptable data loss window) and Recovery Time Objective (max outage recovery duration). | M07 · L37 |
| **Saga** | Sequence of local transactions coordinated across services with compensating undo actions on failure. | M05 · L25 |
| **Sharding** | Horizontally splitting a dataset across independent database instances by a partition key. | M04 · L20 |
| **Singleflight** | Coalescing identical concurrent in-flight requests into one upstream call and sharing the result. | M03 · L17 |
| **SLI / SLO / SLA** | Measured Service Level Indicator, internal Target Objective, and contractual Agreement with penalties. | M07 · L33 |
| **Snowflake ID** | Time-ordered 64-bit distributed identifier combining millisecond timestamp, worker ID, and per-ms sequence. | M04 · L22 |
| **Strangler Fig** | Incrementally routing endpoints from a legacy monolith to extracted services until the monolith retires safely. | M08 · L40 |
| **Throughput** | Volume of requests, bytes, or operations completed per unit time (e.g., QPS, MB/s). | M00 · L04 |
| **Write-Ahead Log (WAL)** | Append-only sequential log persisted before modifying index/table pages to guarantee crash recovery. | M02 · L11 |
