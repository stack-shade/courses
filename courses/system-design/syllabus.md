# Detailed Lesson Syllabus · L01–L40 & 16 Case Studies

Every lesson below maps 1:1 to a written article, Mermaid diagram(s), interactive/animated visualization, slide deck, YouTube episode slot, and primary sources. Follow the [Content Authoring Playbook](../../shared/guides/content-authoring-playbook.md) when drafting each lesson.

---

## Module 00 · Foundations & Design Reasoning (`Beginner · ~4h`)

### L01 · Thinking in Systems *(Status: Draft)*
- **Source:** [lessons/01-thinking-in-systems.md](lessons/01-thinking-in-systems.md) · **Deck:** `01-course-kickoff` (`EP01`)
- **Objectives:** Decompose products into actors, interfaces, compute, durable vs derived state, queues, and ops; distinguish requirements from vendor choices.
- **Mermaid Diagram:** `system-overview` (5-layer architecture map).
- **Animation / Visual:** `anim-request-layers` (interactive toggle showing synchronous vs async paths on a 5-layer diagram).
- **Primary Links:** [System Design Primer](https://github.com/donnemartin/system-design-primer) · [C4 Model](https://c4model.com/).

### L02 · Functional Requirements & Quality Attributes *(Status: Draft)*
- **Source:** [lessons/02-requirements-and-capacity.md](lessons/02-requirements-and-capacity.md) · **Deck:** `02-requirements-and-estimation` (`EP02`)
- **Objectives:** Separate functional behavior, NFRs (`p50/p95/p99` latency, availability, durability, consistency), and explicit scope exclusions.
- **Mermaid Diagram:** `nfr-tradeoff-tree` (Requirement → Measurable SLI/SLO → Architectural lever).
- **Animation / Visual:** `anim-tail-latency` (percentile distribution viewer comparing healthy average vs skewed `p99`).
- **Primary Links:** [Google SRE Book · SLOs](https://sre.google/sre-book/service-level-objectives/).

### L03 · Back-of-the-Envelope Capacity Estimation *(Status: Lab ready / Lesson planned)*
- **Lab:** [labs/01-capacity-estimation.md](labs/01-capacity-estimation.md) · **Deck:** `03-capacity-estimation` (`EP03`)
- **Objectives:** Convert DAU/MAU into average & peak QPS, apply Little's Law (`L = λW`), estimate multi-year storage (decimal vs binary) and bandwidth egress.
- **Mermaid Diagram:** `capacity-budget-flow` (Users → Peak QPS → Compute / Cache / DB / Egress sizing).
- **Animation / Visual:** `sim-capacity-calculator` (interactive sliders for DAU, requests/day, peak multiplier, object size, retention).
- **Primary Links:** [Google SRE Workbook](https://sre.google/workbook/table-of-contents/).

### L04 · Latency, Throughput & Bottleneck Analysis *(Status: Planned)*
- **Deck:** `04-latency-and-bottlenecks` (`EP04`) · **Assessment:** [checkpoint-01.md](assessments/checkpoint-01.md)
- **Objectives:** Diagnose CPU, memory, disk IOPS, network bandwidth, lock contention, and fan-out tail amplification (`1 - (1 - p)^n`).
- **Mermaid Diagram:** `fanout-tail-latency` (serial vs parallel sub-call latency breakdown).
- **Animation / Visual:** `sim-tail-amplification` (adjust backend fan-out count `N` and observe `p99` explosion).
- **Primary Links:** [The Tail at Scale (Dean & Barroso)](https://research.google/pubs/the-tail-at-scale/).

---

## Module 01 · Internet, Networking & API Contracts (`Beginner → Intermediate · ~6h`)

### L05 · DNS & The Web Request Lifecycle *(Status: Base draft)*
- **Source:** [lessons/03-the-web-request.md](lessons/03-the-web-request.md) · **Deck:** `05-web-request-dns` (`EP05`)
- **Objectives:** Trace recursive DNS lookup, A/AAAA/CNAME records, TTL caching limits, Anycast routing, and multi-hop request flow.
- **Mermaid Diagram:** `request-sequence` + `dns-recursive-lookup`.
- **Animation / Visual:** `anim-dns-resolution` (step-by-step packet trace across Stub → Recursive → Root → TLD → Authoritative).
- **Primary Links:** [Cloudflare Learning · DNS](https://www.cloudflare.com/learning/dns/what-is-dns/).

### L06 · TCP, UDP, TLS 1.3 & HTTP/1.1–HTTP/3 *(Status: Planned)*
- **Lab:** `labs/02-http-tls-timing.md` · **Deck:** `06-transport-tls-http` (`EP06`)
- **Objectives:** Compare TCP handshake + congestion vs UDP, TLS 1.3 1-RTT/0-RTT handshake, HTTP/1.1 head-of-line blocking vs HTTP/2 multiplexing vs HTTP/3 QUIC.
- **Mermaid Diagram:** `tls-http-handshakes` (sequence diagram comparing HTTP/1.1, HTTP/2, HTTP/3 RTTs).
- **Animation / Visual:** `anim-http-multiplexing` (animated packet lanes showing head-of-line blocking in HTTP/1.1 vs HTTP/2 vs QUIC).
- **Primary Links:** [RFC 9110 (HTTP)](https://www.rfc-editor.org/rfc/rfc9110) · [RFC 8446 (TLS 1.3)](https://www.rfc-editor.org/rfc/rfc8446) · [RFC 9114 (HTTP/3)](https://www.rfc-editor.org/rfc/rfc9114).

### L07 · Edge Infrastructure: Reverse Proxies, CDNs & Gateways *(Status: Planned)*
- **Deck:** `07-proxies-cdn-gateway` (`EP07`)
- **Objectives:** Distinguish forward vs reverse proxies, pull vs push CDNs, cache-control headers, TLS termination, WAFs, and API Gateway responsibilities.
- **Mermaid Diagram:** `edge-gateway-boundary` (Client → DNS/Anycast → CDN PoP → WAF/Gateway → Private Subnet).
- **Animation / Visual:** `anim-cdn-cache-flow` (edge PoP hit vs origin shield fetch with `Cache-Control` TTL inspector).
- **Primary Links:** [MDN HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching) · [Cloudflare CDN Learning](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/).

### L08 · Load Balancing & Traffic Routing *(Status: Planned)*
- **Deck:** `08-load-balancing` (`EP08`)
- **Objectives:** Compare L4 transport vs L7 application load balancers, routing policies (round-robin, least-connections, weighted, EWMA), active/passive health checks, and graceful draining.
- **Mermaid Diagram:** `l4-vs-l7-routing` (L4 packet forwarding vs L7 TLS-terminated path inspection).
- **Animation / Visual:** `sim-load-balancer` (interactive toggle between Round-Robin, Least-Connections, and Weighted with slow-node simulation).
- **Primary Links:** [NGINX / Envoy Architecture Docs](https://www.envoyproxy.io/docs/envoy/latest/intro/what_is_envoy).

### L09 · API Design & Communication Styles *(Status: Planned)*
- **Lab:** `labs/03-api-idempotency.md` · **Deck:** `09-api-contracts` (`EP09`)
- **Objectives:** Choose between REST, gRPC/Protobuf, GraphQL, WebSockets, SSE, and webhooks; design cursor pagination, versioning, and idempotency keys.
- **Mermaid Diagram:** `sync-vs-realtime-apis` (Request/Response vs Long-Polling vs SSE vs WebSocket).
- **Animation / Visual:** `anim-idempotency-retry` (shows network timeout retry corrupting payment without idempotency key vs safe replay with key).
- **Primary Links:** [Stripe · Idempotent Requests](https://stripe.com/docs/api/idempotent_requests) · [gRPC Concepts](https://grpc.io/docs/what-is-grpc/core-concepts/).

---

## Module 02 · Data Modeling & Storage Internals (`Beginner → Intermediate · ~7h`)

### L10 · Data Models & Database Selection *(Status: Planned)*
- **Deck:** `10-data-models` (`EP10`)
- **Objectives:** Match access patterns to Relational, Document, Key-Value, Wide-Column, Graph, Time-Series, and Vector databases without hype.
- **Mermaid Diagram:** `data-model-decision-flow` (Access pattern → Consistency/Scale needs → Model fit).
- **Animation / Visual:** `anim-schema-access-patterns` (visualizes normalized relational joins vs denormalized document read vs wide-column partition read).
- **Primary Links:** [Designing Data-Intensive Applications Ch. 2](https://dataintensive.net/).

### L11 · Storage Engine Internals: B+Trees vs LSM-Trees *(Status: Planned)*
- **Deck:** `11-storage-engines` (`EP11`)
- **Objectives:** Explain disk pages, WAL durability, B+Tree in-place updates vs LSM-Tree MemTable + SSTable + Bloom Filter + compaction, and RUM amplification trade-offs.
- **Mermaid Diagram:** `lsm-write-read-path` (Write → WAL + MemTable → Flush SSTable → Compaction).
- **Animation / Visual:** `sim-btree-vs-lsm` (animated insert & point-lookup comparison showing page split vs MemTable flush & compaction).
- **Primary Links:** [RocksDB Architecture](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview) · [PostgreSQL Storage](https://www.postgresql.org/docs/current/storage.html).

### L12 · Indexing, Query Plans & Schema Design *(Status: Planned)*
- **Lab:** `labs/04-index-and-explain.md` · **Deck:** `12-indexing-query-plans` (`EP12`)
- **Objectives:** Design clustered, secondary, composite (leftmost-prefix), and covering indexes; read `EXPLAIN ANALYZE` plans and balance normalization vs denormalization.
- **Mermaid Diagram:** `index-scan-vs-seq-scan` (B-Tree traversal to heap fetch vs covering index-only scan).
- **Animation / Visual:** `anim-composite-index` (interactive query predicate filter highlighting when `(a, b)` index hits vs misses).
- **Primary Links:** [PostgreSQL Docs · Indexes](https://www.postgresql.org/docs/current/indexes.html) · [Use The Index, Luke](https://use-the-index-luke.com/).

### L13 · Transactions, ACID, MVCC & Isolation Levels *(Status: Planned)*
- **Deck:** `13-transactions-isolation` (`EP13`)
- **Objectives:** Explain Atomicity/WAL rollback, MVCC snapshot visibility, locks, and phenomena across Read Committed, Repeatable Read, Snapshot Isolation, and Serializable (`SSI`).
- **Mermaid Diagram:** `mvcc-concurrency-timeline` (two concurrent transactions showing write skew under Snapshot Isolation).
- **Animation / Visual:** `anim-isolation-anomalies` (stepper toggling Read Committed vs Repeatable Read vs Serializable on a double-booking scenario).
- **Primary Links:** [PostgreSQL · Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html) · [Jepsen Consistency Models](https://jepsen.io/consistency).

### L14 · Object, Media & Blob Storage *(Status: Planned)*
- **Lab:** `labs/05-presigned-multipart-upload.md` · **Deck:** `14-object-storage` (`EP14`) · **Assessment:** `checkpoint-02`
- **Objectives:** Separate control metadata (DB) from binary payload (Object Store), implement direct client multipart uploads via presigned URLs, and design cold/archive lifecycle tiers.
- **Mermaid Diagram:** `presigned-multipart-upload` (Client ↔ API presign → Direct S3 chunked PUT → Async completion webhook).
- **Animation / Visual:** `anim-presigned-upload` (contrasts app-server proxy bottleneck vs direct-to-object-store chunk flow).
- **Primary Links:** [AWS S3 Multipart Upload Overview](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html).

---

## Module 03 · Caching & Stateless Compute (`Intermediate · ~6h`)

### L15 · Caching Topologies & Write Policies *(Status: Planned)*
- **Deck:** `15-caching-patterns` (`EP15`)
- **Objectives:** Compare cache-aside, read-through, write-through, write-behind (write-back), and refresh-ahead across multi-tier caches.
- **Mermaid Diagram:** `cache-write-policies` (4-panel comparison of Cache-Aside, Write-Through, Write-Behind).
- **Animation / Visual:** `anim-cache-aside-vs-through` (animated hit/miss/write paths showing latency vs staleness/data-loss risk).
- **Primary Links:** [Redis Caching Patterns](https://redis.io/docs/latest/) · [AWS Caching Best Practices](https://docs.aws.amazon.com/whitepapers/latest/database-caching-strategies-using-redis/).

### L16 · Eviction, Expiration & Cache Invalidation *(Status: Planned)*
- **Deck:** `16-eviction-invalidation` (`EP16`)
- **Objectives:** Compare LRU, LFU, and Window-TinyLFU; apply TTL jitter, pub/sub invalidation, versioned keys, and CDC-driven cache eviction.
- **Mermaid Diagram:** `cdc-cache-invalidation` (DB Commit → WAL/CDC → Invalidation Worker → Cache Delete).
- **Animation / Visual:** `sim-eviction-policies` (step through an access stream comparing Cache Hit % under LRU vs LFU vs TinyLFU).
- **Primary Links:** [Meta Memcache Scaling Paper (Nishtala et al.)](https://research.facebook.com/publications/scaling-memcache-at-facebook/).

### L17 · Cache Stampedes, Hot Keys & Penetration *(Status: Planned)*
- **Lab:** `labs/06-cache-stampede.md` · **Deck:** `17-cache-failure-modes` (`EP17`)
- **Objectives:** Defend against thundering herds (singleflight / request coalescing, probabilistic early expiration), cache penetration (Bloom filter / negative caching), cache avalanche, and hot keys.
- **Mermaid Diagram:** `singleflight-coalescing` (100 concurrent misses → 1 leader DB query → 100 shared responses).
- **Animation / Visual:** `sim-cache-stampede` (toggle Singleflight + TTL Jitter ON/OFF and watch DB QPS spike vs stay flat).
- **Primary Links:** [Cloudflare · Cache Stampede & Pingora](https://blog.cloudflare.com/).

### L18 · Stateless Services, Concurrency & Connection Pools *(Status: Planned)*
- **Deck:** `18-stateless-concurrency` (`EP18`) · **Stage 1 Project:** [URL Shortener](case-studies/01-url-shortener.md)
- **Objectives:** Design stateless horizontal scaling, externalize session state, contrast thread-per-request vs async event loops, and size DB connection pools (`PgBouncer` / HikariCP math).
- **Mermaid Diagram:** `connection-pool-exhaustion` (100 app pods × 50 connections overwhelming 500-max DB vs connection pooler).
- **Animation / Visual:** `anim-thread-vs-eventloop` (shows blocking I/O stalling thread pools vs non-blocking event loop + worker queue).
- **Primary Links:** [HikariCP · About Pool Sizing](https://github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing).

---

## Module 04 · Scaling Data: Replication & Sharding (`Intermediate → Advanced · ~6h`)

### L19 · Data Replication Strategies & Replication Lag *(Status: Planned)*
- **Deck:** `19-replication` (`EP19`)
- **Objectives:** Contrast single-leader, multi-leader, and leaderless replication; handle synchronous vs asynchronous lag (`read-your-own-writes`, monotonic reads, conflict resolution).
- **Mermaid Diagram:** `replication-lag-anomaly` (User writes to Leader → reads stale Replica → fix via read-own-writes routing).
- **Animation / Visual:** `anim-replication-lag` (animated timeline showing write timestamp propagation and stale-read window).
- **Primary Links:** [DDIA Ch. 5 · Replication](https://dataintensive.net/) · [PostgreSQL High Availability](https://www.postgresql.org/docs/current/high-availability.html).

### L20 · Partitioning, Sharding & Consistent Hashing *(Status: Planned)*
- **Lab:** `labs/07-consistent-hashing.md` · **Deck:** `20-sharding-hashing` (`EP20`)
- **Objectives:** Compare range vs hash vs directory partitioning; construct a consistent hashing ring with virtual nodes; evaluate scatter-gather cross-shard queries.
- **Mermaid Diagram:** `consistent-hash-ring` (Nodes + virtual nodes placed around `0..2^32-1` ring).
- **Animation / Visual:** `sim-consistent-hashing` (add/remove nodes and change `vnodes` count to observe minimal key movement).
- **Primary Links:** [Dynamo Paper (DeCandia et al.)](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf).

### L21 · Hot Partitions, Rebalancing & Zero-Downtime Migrations *(Status: Planned)*
- **Lab:** `labs/08-zero-downtime-migration.md` · **Deck:** `21-hot-shards-migrations` (`EP21`)
- **Objectives:** Mitigate celebrity hot keys via key salting/write splitting, plan online shard splits, and execute expand-contract + dual-write shadow migrations safely.
- **Mermaid Diagram:** `expand-contract-migration` (4 phases: Dual Write → Backfill → Shadow Read Compare → Cutover).
- **Animation / Visual:** `anim-key-salting` (skewed partition load bar chart flattening when suffix salt `0..K` is enabled).
- **Primary Links:** [Stripe · Online Migrations at Scale](https://stripe.com/blog/engineering) · [GitHub Engineering · gh-ost](https://github.blog/engineering/).

### L22 · Distributed ID Generation & Sequencing *(Status: Planned)*
- **Deck:** `22-distributed-ids` (`EP22`) · **Assessment:** `checkpoint-03`
- **Objectives:** Compare DB sequences, Hi/Lo ranges, UUIDv4 (random B-Tree fragmentation) vs UUIDv7, ULID, and 64-bit Snowflake IDs (timestamp + machine + sequence) + NTP clock-skew handling.
- **Mermaid Diagram:** `snowflake-bit-layout` (1 sign + 41ms timestamp + 10 worker ID + 12 sequence bits).
- **Animation / Visual:** `anim-uuid4-vs-uuid7-btree` (visualizes random page splits in UUIDv4 vs sequential append in UUIDv7/Snowflake).
- **Primary Links:** [RFC 9562 · UUID Versions (incl. UUIDv7)](https://www.rfc-editor.org/rfc/rfc9562).

---

## Module 05 · Asynchronous Systems, Streaming & Search (`Intermediate → Advanced · ~7h`)

### L23 · Message Queues vs Event Streams *(Status: Planned)*
- **Deck:** `23-queues-vs-streams` (`EP23`)
- **Objectives:** Contrast competing-consumer queues (RabbitMQ/SQS model) vs partitioned append-only logs with offsets & consumer groups (Kafka model).
- **Mermaid Diagram:** `queue-vs-partitioned-log` (Message deletion on ACK vs retained offsets with independent consumer groups).
- **Animation / Visual:** `sim-consumer-group` (rebalance partitions across consumers and watch lag build/drain).
- **Primary Links:** [Apache Kafka Documentation · Intro](https://kafka.apache.org/documentation/).

### L24 · Delivery Semantics, Ordering & Idempotent Consumers *(Status: Planned)*
- **Lab:** `labs/09-idempotent-dlq-worker.md` · **Deck:** `24-delivery-semantics` (`EP24`)
- **Objectives:** Analyze at-most-once, at-least-once, and effectively-once processing; guarantee per-key ordering; implement dead-letter queues (DLQs) and poison-pill quarantine.
- **Mermaid Diagram:** `dlq-retry-pipeline` (Topic → Consumer → Retry w/ Backoff → DLQ + Replay Path).
- **Animation / Visual:** `anim-delivery-semantics` (step through crash-before-ACK vs crash-after-ACK causing duplicate vs lost message).
- **Primary Links:** [Confluent / Kafka Delivery Semantics](https://kafka.apache.org/documentation/#semantics).

### L25 · Distributed Data Patterns: Outbox, CDC, Sagas & CQRS *(Status: Planned)*
- **Deck:** `25-outbox-saga-cqrs` (`EP25`)
- **Objectives:** Eliminate dual-write inconsistency with Transactional Outbox + Debezium CDC; coordinate cross-service workflows using Orchestration vs Choreography Sagas; know when CQRS/Event Sourcing pays off.
- **Mermaid Diagram:** `transactional-outbox-cdc` (App → Atomic DB Commit [Business + Outbox Table] → CDC Relay → Broker).
- **Animation / Visual:** `anim-saga-compensation` (happy-path forward steps vs step-3 failure triggering reverse compensating actions).
- **Primary Links:** [Microservices.io · Outbox & Saga Patterns](https://microservices.io/patterns/data/transactional-outbox.html).

### L26 · Full-Text Search, Inverted Indexes & Autocomplete *(Status: Planned)*
- **Lab:** `labs/10-search-autocomplete.md` · **Deck:** `26-search-pipelines` (`EP26`)
- **Objectives:** Understand tokenization, inverted index posting lists, BM25 relevance ranking, prefix tries/FSTs for typeahead, async index synchronization, and keyword + vector hybrid search.
- **Mermaid Diagram:** `search-indexing-pipeline` (Primary DB → CDC/Stream → Tokenizer/Embedder → Inverted + HNSW Index).
- **Animation / Visual:** `anim-inverted-index-lookup` (interactive query typing matching posting-list intersection & trie prefix lookup).
- **Primary Links:** [Lucene / OpenSearch / Elasticsearch Inverted Index Docs](https://www.elastic.co/guide/en/elasticsearch/reference/current/getting-started.html).

### L27 · Batch, Stream Processing & Real-Time OLAP *(Status: Planned)*
- **Deck:** `27-stream-olap` (`EP27`) · **Stage 2 Project:** Notification + Social Feed
- **Objectives:** Contrast OLTP row stores vs OLAP columnar formats (Parquet); explain event time vs processing time, tumbling/sliding windows, watermarks, and Lambda vs Kappa architectures.
- **Mermaid Diagram:** `stream-window-watermarks` (Out-of-order events arriving before/after watermark cutoff).
- **Animation / Visual:** `anim-watermark-late-events` (watch out-of-order stream events fall into late-data side outputs vs window aggregates).
- **Primary Links:** [The World Beyond Batch (Akidau)](https://www.oreilly.com/radar/the-world-beyond-batch-streaming-101/).

---

## Module 06 · Distributed Systems Theory & Coordination (`Advanced · ~8h`)

### L28 · Partial Failure, Timeouts, Backoff, Jitter & Circuit Breakers *(Status: Planned)*
- **Lab:** `labs/11-retry-storm-circuit-breaker.md` · **Deck:** `28-partial-failure` (`EP28`)
- **Objectives:** Design layered timeouts, exponential backoff with full jitter, per-client retry budgets, and `Closed → Open → Half-Open` circuit breakers to halt retry storms.
- **Mermaid Diagram:** `circuit-breaker-state` (`stateDiagram-v2` showing failure threshold, cooldown timer, and half-open probe).
- **Animation / Visual:** `sim-retry-jitter-circuit` (simulate 1,000 clients retrying with no jitter vs Full Jitter + Circuit Breaker).
- **Primary Links:** [AWS Builders' Library · Timeouts, Retries & Backoff with Jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/).

### L29 · Time, Clocks, Ordering & Fencing Tokens *(Status: Planned)*
- **Deck:** `29-clocks-and-fencing` (`EP29`)
- **Objectives:** Explain why wall-clock NTP jumps break distributed ordering; contrast monotonic clocks, Lamport clocks, vector clocks, TrueTime uncertainty intervals, and monotonic fencing tokens.
- **Mermaid Diagram:** `stale-lock-fencing-token` (GC-paused Client 1 rejected by Storage because Fencing Token `33 < 34`).
- **Animation / Visual:** `anim-fencing-tokens` (step through GC pause race condition with and without storage-enforced fencing tokens).
- **Primary Links:** [Martin Kleppmann · How to do distributed locking](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html).

### L30 · Consistency Models, Quorums (`R + W > N`) & CRDTs *(Status: Planned)*
- **Deck:** `30-consistency-quorums` (`EP30`)
- **Objectives:** Distinguish linearizability, sequential, causal, and eventual consistency; tune Dynamo-style `N, R, W` quorums, sloppy quorums, read repair, Merkle trees, and state/op-based CRDTs.
- **Mermaid Diagram:** `quorum-overlap-diagram` (N=5 replicas showing `W=3, R=3` overlapping replica vs `W=2, R=2` stale read).
- **Animation / Visual:** `sim-quorum-rw` (interactive sliders for `N`, `R`, `W` + node failure toggles showing strict vs stale overlap).
- **Primary Links:** [Jepsen · Consistency Models](https://jepsen.io/consistency) · [MIT 6.5840](https://pdos.csail.mit.edu/6.5840/).

### L31 · CAP, PACELC & Consensus Algorithms (Raft / Paxos) *(Status: Planned)*
- **Deck:** `31-cap-consensus-raft` (`EP31`)
- **Objectives:** State CAP accurately (linearizability vs availability *only during partitions*) and PACELC (`else Latency vs Consistency`); trace Raft leader election, terms, commit index, and split-brain defense.
- **Mermaid Diagram:** `raft-leader-election` (Follower timeout → Candidate RequestVote → Majority quorum → Leader Heartbeat).
- **Animation / Visual:** `sim-raft-election` (5-node cluster stepper: kill leader, partition 2 vs 3 nodes, watch term & commit progress).
- **Primary Links:** [In Search of an Understandable Consensus Algorithm (Raft)](https://raft.github.io/raft.pdf) · [The Secret Lives of Data · Raft](https://thesecretlivesofdata.com/raft/).

### L32 · Distributed Coordination, Leases & Locking *(Status: Planned)*
- **Deck:** `32-distributed-coordination` (`EP32`) · **Assessment:** `checkpoint-04`
- **Objectives:** Understand how etcd/ZooKeeper provide linearizable metadata, ephemeral sessions, watch streams, TTL leases, leader election, and when *not* to put business traffic on a lock service.
- **Mermaid Diagram:** `etcd-leader-lease` (Leader maintains heartbeat lease against consensus quorum; workers watch key prefix).
- **Animation / Visual:** `anim-lease-expiry` (shows lease TTL countdown, network disconnect, safe step-down & handoff).
- **Primary Links:** [etcd Documentation](https://etcd.io/docs/) · [Google Chubby Paper](https://research.google/pubs/the-chubby-lock-service-for-loosely-coupled-distributed-systems/).

---

## Module 07 · Reliability, Security, Observability & Cloud (`Advanced · ~8h`)

### L33 · Reliability Engineering, SLIs/SLOs & Overload Control *(Status: Planned)*
- **Lab:** `labs/12-load-shedding-rate-limiter.md` · **Deck:** `33-reliability-overload` (`EP33`)
- **Objectives:** Define user-centric SLIs/SLOs and error budgets; protect services from cascading brownouts via bulkheads, bounded queues, backpressure, LIFO/priority load shedding, and adaptive concurrency.
- **Mermaid Diagram:** `overload-control-layers` (Edge Rate Limit → Priority Load Shedder → Bulkhead Thread Pools).
- **Animation / Visual:** `sim-load-shedding` (FIFO queue latency explosion under 120% load vs Priority Load Shedding keeping p99 healthy).
- **Primary Links:** [Google SRE · Handling Overload](https://sre.google/sre-book/handling-overload/) · [AWS Builders' Library · Using Load Shedding](https://aws.amazon.com/builders-library/using-load-shedding-to-avoid-overload/).

### L34 · Observability: Logs, Metrics, Traces & Chaos Testing *(Status: Planned)*
- **Deck:** `34-observability-chaos` (`EP34`)
- **Objectives:** Design structured logs, RED & USE metrics (avoiding high-cardinality metric explosions), OpenTelemetry distributed tracing (`traceparent`), multi-window burn-rate alerts, and GameDay chaos experiments.
- **Mermaid Diagram:** `otel-trace-propagation` (Gateway creates `trace_id` → propagates across HTTP & Kafka headers → Collector → Trace UI).
- **Animation / Visual:** `anim-distributed-trace` (interactive waterfall span breakdown highlighting hidden N+1 DB calls & async queue delay).
- **Primary Links:** [OpenTelemetry Docs](https://opentelemetry.io/docs/) · [Google SRE Workbook · Alerting on SLOs](https://sre.google/workbook/alerting-on-slos/).

### L35 · System Security, Identity & Abuse Prevention *(Status: Planned)*
- **Lab:** `labs/13-threat-model-oauth.md` · **Deck:** `35-security-identity` (`EP35`)
- **Objectives:** Implement OAuth 2.1 + PKCE & OIDC, compare stateless JWT vs opaque revocable tokens, design RBAC/ABAC/ReBAC (Zanzibar), enforce mTLS zero-trust, KMS envelope encryption, and token-bucket rate limiting.
- **Mermaid Diagram:** `oauth-pkce-and-trust-boundaries` (User Agent ↔ Auth Server ↔ Resource API with trust boundaries marked).
- **Animation / Visual:** `sim-rate-limiter-algorithms` (compare Token Bucket vs Leaky Bucket vs Sliding Window Log vs Sliding Window Counter on bursts).
- **Primary Links:** [OAuth 2.0 Security BCP (RFC 9700)](https://www.rfc-editor.org/rfc/rfc9700) · [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/).

### L36 · Cloud Infrastructure, Containers & Deployment Strategies *(Status: Planned)*
- **Deck:** `36-cloud-deployments` (`EP36`)
- **Objectives:** Architect across Regions/AZs and VPC subnets; understand container scheduling & readiness/liveness probes; execute blue/green, progressive canary, feature flags, and automated rollback gates.
- **Mermaid Diagram:** `canary-rollout-pipeline` (Router splitting 1% → 10% → 50% → 100% gated by automated SLO checks).
- **Animation / Visual:** `anim-canary-rollback` (simulated error-rate spike during 10% canary triggering instant traffic shift back to baseline).
- **Primary Links:** [Kubernetes Concepts](https://kubernetes.io/docs/concepts/) · [AWS Well-Architected Reliability](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/).

### L37 · Multi-Region Architecture, Disaster Recovery & FinOps *(Status: Planned)*
- **Lab:** `labs/14-multi-region-failover.md` · **Deck:** `37-multi-region-finops` (`EP37`) · **Assessment:** `checkpoint-05` · **Stage 3 Project:** Multi-Region Chat
- **Objectives:** Compare Active-Passive vs Active-Active geo-routing, DNS/Anycast failover, cross-region replication latency vs consistency, `RPO`/`RTO` backup drills, GDPR/data residency, and FinOps cost per million requests.
- **Mermaid Diagram:** `multi-region-active-active` (US-East + EU-West clusters with Geo-DNS, local reads, and async/global state).
- **Animation / Visual:** `anim-region-failover` (simulate primary region blackout, watch DNS/health-check drain, RPO data loss window & RTO recovery).
- **Primary Links:** [AWS Multi-Region Fundamentals](https://docs.aws.amazon.com/whitepapers/latest/aws-multi-region-fundamentals/aws-multi-region-fundamentals.html).

---

## Module 08 · Architecture Mastery & Real-World Case Studies (`Advanced / Staff · ~8h`)

### L38 · Ambiguous Problem Decomposition & High-Signal ADRs *(Status: Planned)*
- **Deck:** `38-problem-decomposition` (`EP38`)
- **Objectives:** Run a disciplined 4-step design framework (Clarify & Scope → Estimate & Shape → Core Architecture → Deep Dives & Failure Modes) and capture consequential choices using [templates/adr.md](templates/adr.md).
- **Mermaid Diagram:** `design-interview-loop` (Time-boxed workflow from open prompt to defended trade-offs).
- **Animation / Visual:** `anim-adr-tradeoff-radar` (interactive comparison checklist scoring Cost vs Latency vs Operational Complexity).
- **Primary Links:** [Google SRE · Non-Abstract System Design](https://sre.google/resources/).

### L39 · Modern AI & High-Throughput Workloads *(Status: Planned)*
- **Deck:** `39-ai-systems-architecture` (`EP39`)
- **Objectives:** Architect LLM inference gateways (continuous batching, KV-cache memory constraints, SSE token streaming), semantic caching, async document ingestion → chunking → vector index (HNSW/IVF) RAG pipelines, and per-tenant token rate limiting.
- **Mermaid Diagram:** `rag-and-llm-gateway` (Client → Token Rate Limiter → Semantic Cache → Retriever [BM25 + Vector] → Inference Queue).
- **Animation / Visual:** `anim-llm-token-streaming` (shows Time-To-First-Token vs Inter-Token Latency under GPU batch queueing).
- **Primary Links:** [vLLM / PagedAttention Paper](https://arxiv.org/abs/2309.06180) · [AWS Generative AI Architecture Patterns](https://docs.aws.amazon.com/prescriptive-guidance/).

### L40 · System Evolution, Monolith Extraction & Blameless Postmortems *(Status: Planned)*
- **Deck:** `40-system-evolution` (`EP40`) · **Capstone:** Production Design Doc + Vertical Slice + Load Test + Failure Drill
- **Objectives:** Evolve systems responsibly without big-bang rewrites (modular monolith → strangler fig → CDC data decoupling), run blameless incident postmortems, and present an architecture review backed by load evidence.
- **Mermaid Diagram:** `strangler-fig-extraction` (Edge proxy progressively shifting routes from Monolith to extracted Service + synced DB).
- **Animation / Visual:** `anim-strangler-cutover` (incremental traffic slider `0% → 100%` across shadow verification & rollback guard).
- **Primary Links:** [Martin Fowler · Strangler Fig Application](https://martinfowler.com/bliki/StranglerFigApplication.html) · [Google SRE · Postmortem Culture](https://sre.google/sre-book/postmortem-culture/).

---

## Case-Study Syllabus (16 Systems · `case-studies/01–16`)

| # | Case Study | Target Scale & Key Bottleneck | Slide Deck / Episode | Status |
|---:|---|---|---|---|
| **01** | [URL Shortener](case-studies/01-url-shortener.md) | 100:1 read-heavy redirects, collision-safe short codes, abuse takedowns | `cs-01-url-shortener` (`CS01`) | Exercise brief ready |
| **02** | Pastebin / Text Sharing | Large payload offload to object store, TTL cleanup, abusive content | `cs-02-pastebin` (`CS02`) | Planned |
| **03** | Distributed Rate Limiter | Sub-ms check overhead, Redis atomic Lua, cluster race conditions | `cs-03-rate-limiter` (`CS03`) | Planned |
| **04** | Multi-Channel Notification Platform | Retry isolation per vendor, user opt-out checks, priority queues | `cs-04-notifications` (`CS04`) | Planned |
| **05** | Social News Feed / Timeline | Hybrid push/pull fan-out, celebrity hot accounts, cursor pagination | `cs-05-news-feed` (`CS05`) | Planned |
| **06** | Real-Time Chat & Presence | Persistent WebSocket state, fan-out to groups, online heartbeat storm | `cs-06-chat-presence` (`CS06`) | Planned |
| **07** | Cloud File Storage & Sync | Chunk hashing, deduplication, delta upload, offline edit conflicts | `cs-07-file-sync` (`CS07`) | Planned |
| **08** | Video Upload & Streaming Platform | Multi-GB upload resilience, DAG encoding pipeline, ABR HLS/DASH CDN | `cs-08-video-streaming` (`CS08`) | Planned |
| **09** | Search Autocomplete / Typeahead | Sub-50ms keystroke budget, top-K prefix tries, noisy queries | `cs-09-autocomplete` (`CS09`) | Planned |
| **10** | Ride-Hailing & Geospatial Dispatch | 10s location updates/driver, H3/Quadtree proximity, double-match locks | `cs-10-ride-hailing` (`CS10`) | Planned |
| **11** | Food Delivery & Logistics Tracking | Multi-party state machine, courier routing ETA, live push updates | `cs-11-food-delivery` (`CS11`) | Planned |
| **12** | Payment Processing & Double-Entry Ledger | Strict correctness, idempotency, serializable ledger, PSP webhooks | `cs-12-payment-ledger` (`CS12`) | Planned |
| **13** | Ticket Booking & Inventory Reservation | Extreme flash-sale hot rows, TTL holds, virtual waiting rooms | `cs-13-ticket-booking` (`CS13`) | Planned |
| **14** | Metrics & Log Ingestion Pipeline | High-volume writes, ring buffers, time-series rollups, cold tiering | `cs-14-metrics-pipeline` (`CS14`) | Planned |
| **15** | Distributed Job Scheduler | Exactly-once trigger illusion vs fencing tokens, delayed queues | `cs-15-job-scheduler` (`CS15`) | Planned |
| **16** | Multi-Tenant SaaS Architecture | Tenant isolation (pool vs bridge vs silo), noisy-neighbor limits | `cs-16-multitenant-saas` (`CS16`) | Planned |
