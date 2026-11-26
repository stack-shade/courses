# Full Curriculum · System Design (Beginner → Advanced)

This is the master structural inventory across **9 Modules (00–08)**, **40 Lessons**, **14 Hands-On Labs**, **16 Case Studies**, **4 Stage Projects**, **5 Checkpoints**, and **40 Standalone Animated HTML Slide Decks**.

For per-lesson objectives, Mermaid specs, animations, and primary links, see [Detailed Syllabus](syllabus.md). For sequential checklists, see [Roadmap](roadmap.md). For live slides and simulations, open [`downloads/index.html`](downloads/index.html).

---

## Module Overview Table

| Module | Title | Level | Lessons | Labs & Checkpoints | Practical Outcome | Status |
|---:|---|---|---:|---|---|---|
| **00** | Foundations & Design Reasoning | Beginner | [01–04](lessons/01-thinking-in-systems.md) | [Lab 01](labs/01-capacity-estimation.md) · [CP 01](assessments/checkpoint-01.md) | One-page system map + capacity sheet | Draft complete |
| **01** | Internet, Networking & API Contracts | Beginner → Int. | [05–09](lessons/03-the-web-request.md) | [Lab 02](labs/02-http-tls-timing.md) · [Lab 03](labs/03-api-idempotency.md) | Request trace + idempotent API spec | Draft complete |
| **02** | Data Modeling & Storage Internals | Beginner → Int. | [10–14](lessons/10-data-models.md) | [Lab 04](labs/04-index-and-explain.md) · [Lab 05](labs/05-presigned-multipart-upload.md) · [CP 02](assessments/checkpoint-02.md) | Multi-model schema + storage ADR | Draft complete |
| **03** | Caching & Stateless Compute | Intermediate | [15–18](lessons/15-caching-patterns.md) | [Lab 06](labs/06-cache-stampede.md) · [Project 01](projects/01-url-shortener-platform/README.md) | Cache stampede defense + URL Shortener | Draft complete |
| **04** | Scaling Data: Replication & Sharding | Int. → Advanced | [19–22](lessons/19-replication.md) | [Lab 07](labs/07-consistent-hashing.md) · [Lab 08](labs/08-zero-downtime-migration.md) · [CP 03](assessments/checkpoint-03.md) | Consistent hashing ring + migration plan | Draft complete |
| **05** | Async Systems, Streaming & Search | Int. → Advanced | [23–27](lessons/23-queues-vs-streams.md) | [Lab 09](labs/09-idempotent-dlq-worker.md) · [Lab 10](labs/10-search-autocomplete.md) · [Project 02](projects/02-notification-and-feed/README.md) | Notification + Social Feed architecture | Draft complete |
| **06** | Distributed Systems & Coordination | Advanced | [28–32](lessons/28-partial-failure.md) | [Lab 11](labs/11-retry-storm-circuit-breaker.md) · [CP 04](assessments/checkpoint-04.md) | Quorum / Raft / Retry failure model | Draft complete |
| **07** | Reliability, Security, Ops & Cloud | Advanced | [33–37](lessons/33-reliability-overload.md) | [Labs 12–14](labs/12-load-shedding-rate-limiter.md) · [CP 05](assessments/checkpoint-05.md) · [Project 03](projects/03-multi-region-chat/README.md) | Multi-Region Chat + Threat Model + Chaos Drill | Draft complete |
| **08** | Architecture Mastery & Case Studies | Advanced / Staff | [38–40](lessons/38-problem-decomposition.md) | 16 Case Studies · [Capstone](projects/04-capstone/README.md) | Production Design Doc + Vertical Slice + Presentation | Draft complete |

---

## Complete Lesson Matrix (L01–L40)

### Module 00 · Foundations & Design Reasoning (Beginner)
| # | Lesson | Core Topics | Practical Output / Artifact | Status |
|---:|---|---|---|---|
| **01** | [Thinking in Systems](lessons/01-thinking-in-systems.md) | Boundaries, actors, compute, durable vs derived state, trade-offs | 5-layer decomposition of a daily app | Draft |
| **02** | [Requirements & Quality Attributes](lessons/02-requirements-and-capacity.md) | Functional requirements, NFRs (`p95/p99`, availability, durability, cost) | Measurable requirements & NFR table | Draft |
| **03** | [Back-of-the-Envelope Capacity Estimation](lessons/03-capacity-estimation.md) | DAU/MAU, QPS, peak bursts, storage, bandwidth, Little's Law | [Lab 01](labs/01-capacity-estimation.md) sizing sheet | Draft |
| **04** | [Latency, Throughput & Bottlenecks](lessons/04-latency-and-bottlenecks.md) | CPU, RAM, disk IOPS, network, lock contention, tail amplification | Bottleneck matrix · [CP 01](assessments/checkpoint-01.md) | Draft |

### Module 01 · Internet, Networking & API Contracts (Beginner → Intermediate)
| # | Lesson | Core Topics | Practical Output / Artifact | Status |
|---:|---|---|---|---|
| **05** | [DNS & The Web Request Lifecycle](lessons/03-the-web-request.md) | Recursive DNS, A/AAAA/CNAME, TTL propagation, Anycast, BGP basics | End-to-end request sequence | Draft |
| **06** | [Transport & Security Protocols](lessons/06-transport-tls-http.md) | TCP handshake, congestion control, UDP, TLS 1.3, HTTP/1.1 vs 2 vs 3 | [Lab 02](labs/02-http-tls-timing.md) timing analysis | Draft |
| **07** | [Edge Infrastructure: Proxies & CDNs](lessons/07-proxies-cdn-gateway.md) | Reverse vs forward proxies, CDN PoPs, cache keys, TLS termination, WAF | Edge vs origin offload calculation | Draft |
| **08** | [Load Balancing & Traffic Routing](lessons/08-load-balancing.md) | L4 vs L7, round-robin, least-connections, consistent hashing, draining | Routing & health-check topology | Draft |
| **09** | [API Design & Communication Patterns](lessons/09-api-contracts.md) | REST, gRPC/Protobuf, GraphQL, WebSockets, SSE, pagination, idempotency | [Lab 03](labs/03-api-idempotency.md) idempotent API contract | Draft |

### Module 02 · Data Modeling & Storage Internals (Beginner → Intermediate)
| # | Lesson | Core Topics | Practical Output / Artifact | Status |
|---:|---|---|---|---|
| **10** | [Data Models & Database Selection](lessons/10-data-models.md) | Relational, document, key-value, wide-column, graph, time-series, vector | Workload-to-engine decision matrix | Draft |
| **11** | [Storage Engine Internals](lessons/11-storage-engines.md) | Pages, B+Trees vs LSM-Trees, WAL, MemTables, SSTables, Bloom filters, compaction | Read/write/space amplification comparison | Draft |
| **12** | [Indexing & Query Execution Plans](lessons/12-indexing-query-plans.md) | Clustered vs secondary indexes, composite index order, covering indexes, `EXPLAIN` | [Lab 04](labs/04-index-and-explain.md) index tuning | Draft |
| **13** | [Transactions, ACID & Isolation Levels](lessons/13-transactions-isolation.md) | Atomicity, MVCC, locks, Read Committed, Repeatable Read, Serializable, write skew | Anomaly reproduction table | Draft |
| **14** | [Object, Media & Blob Storage](lessons/14-object-storage.md) | Object store layout, metadata vs payload split, presigned URLs, multipart upload | [Lab 05](labs/05-presigned-multipart-upload.md) · [CP 02](assessments/checkpoint-02.md) | Draft |

### Module 03 · Caching & Stateless Compute (Intermediate)
| # | Lesson | Core Topics | Practical Output / Artifact | Status |
|---:|---|---|---|---|
| **15** | [Caching Topologies & Write Policies](lessons/15-caching-patterns.md) | Client, edge, app, DB caches; cache-aside, read/write-through, write-behind | Write policy failure matrix | Draft |
| **16** | [Eviction, Expiration & Cache Invalidation](lessons/16-eviction-invalidation.md) | LRU, LFU, Window-TinyLFU, TTL jitter, pub/sub invalidation, versioned keys | Cache memory & hit-ratio sizing | Draft |
| **17** | [Cache Stampedes, Hot Keys & Penetration](lessons/17-cache-failure-modes.md) | Thundering herd, singleflight/request coalescing, null caching, Bloom guards | [Lab 06](labs/06-cache-stampede.md) stampede mitigation | Draft |
| **18** | [Stateless Services & Concurrency](lessons/18-stateless-concurrency.md) | Threads vs async event loops, worker pools, DB connection pooling, externalized sessions | Concurrency worksheet · [Project 01](projects/01-url-shortener-platform/README.md) | Draft |

### Module 04 · Scaling Data: Replication & Sharding (Intermediate → Advanced)
| # | Lesson | Core Topics | Practical Output / Artifact | Status |
|---:|---|---|---|---|
| **19** | [Data Replication Strategies](lessons/19-replication.md) | Single-leader, multi-leader, leaderless, sync vs async, lag, read-your-writes | Replication lag anomaly map | Draft |
| **20** | [Partitioning & Consistent Hashing](lessons/20-sharding-hashing.md) | Range vs hash vs directory partitioning, consistent hashing + vnodes, cross-shard queries | [Lab 07](labs/07-consistent-hashing.md) virtual-node ring | Draft |
| **21** | [Hot Partitions, Rebalancing & Migrations](lessons/21-hot-shards-migrations.md) | Key salting, split/merge shards, dual-write, expand-contract online migrations | [Lab 08](labs/08-zero-downtime-migration.md) runbook | Draft |
| **22** | [Distributed ID Generation](lessons/22-distributed-ids.md) | Auto-increment limits, UUIDv4 vs UUIDv7, Snowflake IDs, ULID, clock drift | 64-bit ID layout · [CP 03](assessments/checkpoint-03.md) | Draft |

### Module 05 · Asynchronous Systems, Streaming & Search (Intermediate → Advanced)
| # | Lesson | Core Topics | Practical Output / Artifact | Status |
|---:|---|---|---|---|
| **23** | [Queues vs Event Streams](lessons/23-queues-vs-streams.md) | Point-to-point queues, pub/sub, partitioned append-only logs, consumer groups | Queue vs log selection guide | Draft |
| **24** | [Delivery Semantics & Idempotency](lessons/24-delivery-semantics.md) | At-most-once, at-least-once, effectively-once, partition keys, DLQs, poison pills | [Lab 09](labs/09-idempotent-dlq-worker.md) DLQ worker | Draft |
| **25** | [Distributed Data Patterns](lessons/25-outbox-saga-cqrs.md) | Transactional outbox, CDC, Saga orchestration vs choreography, CQRS, Event Sourcing | Saga failure-compensation flow | Draft |
| **26** | [Full-Text Search & Autocomplete](lessons/26-search-pipelines.md) | Inverted index, analyzers, BM25 scoring, tries/FSTs, async search sync, hybrid search | [Lab 10](labs/10-search-autocomplete.md) autocomplete lab | Draft |
| **27** | [Batch, Stream Processing & OLAP](lessons/27-stream-olap.md) | MapReduce/Spark model, Flink windowing & watermarks, Lambda/Kappa, columnar OLAP | Streaming pipeline · [Project 02](projects/02-notification-and-feed/README.md) | Draft |

### Module 06 · Distributed Systems Theory & Coordination (Advanced)
| # | Lesson | Core Topics | Practical Output / Artifact | Status |
|---:|---|---|---|---|
| **28** | [Partial Failure, Timeouts & Circuit Breakers](lessons/28-partial-failure.md) | Grey failures, retry storms, exponential backoff + full jitter, retry budgets, circuit breakers | [Lab 11](labs/11-retry-storm-circuit-breaker.md) retry storm | Draft |
| **29** | [Time, Clocks & Ordering](lessons/29-clocks-and-fencing.md) | Physical NTP drift, monotonic clocks, Lamport & vector clocks, TrueTime, fencing tokens | Stale-lock corruption trace | Draft |
| **30** | [Consistency Models & Quorums](lessons/30-consistency-quorums.md) | Linearizability, sequential, causal, eventual consistency, `R + W > N`, sloppy quorums, CRDTs | Quorum overlap & stale-read matrix | Draft |
| **31** | [CAP, PACELC & Consensus](lessons/31-cap-consensus-raft.md) | CAP partition nuance, PACELC latency trade-off, Raft leader election, log replication, split-brain | Raft election & network partition flow | Draft |
| **32** | [Distributed Locks, Leases & Coordination](lessons/32-distributed-coordination.md) | etcd/ZooKeeper primitives, TTL leases, lock safety vs efficiency, fencing | Safe leader contract · [CP 04](assessments/checkpoint-04.md) | Draft |

### Module 07 · Reliability, Security, Observability & Cloud (Advanced)
| # | Lesson | Core Topics | Practical Output / Artifact | Status |
|---:|---|---|---|---|
| **33** | [Reliability, SLIs/SLOs & Overload Control](lessons/33-reliability-overload.md) | Error budgets, bulkheads, backpressure, load shedding, adaptive concurrency | [Lab 12](labs/12-load-shedding-rate-limiter.md) load shedding | Draft |
| **34** | [Observability & Chaos Engineering](lessons/34-observability-chaos.md) | Structured logs, RED/USE metrics, distributed tracing (OTel), burn-rate alerts, GameDays | Service observability spec | Draft |
| **35** | [System Security, Identity & Abuse Control](lessons/35-security-identity.md) | AuthN/AuthZ, OAuth 2.1/OIDC, JWT vs opaque tokens, RBAC/ReBAC, mTLS, KMS, rate limits | [Lab 13](labs/13-threat-model-oauth.md) STRIDE + OAuth | Draft |
| **36** | [Containers, Orchestration & Deployments](lessons/36-cloud-deployments.md) | Regions/AZs, VPCs, scheduling model, blue/green, canary, feature flags, rollbacks | Safe progressive rollout plan | Draft |
| **37** | [Multi-Region, Disaster Recovery & FinOps](lessons/37-multi-region-finops.md) | Active-active vs active-passive, RPO/RTO, DNS failover, data residency, cost modeling | [Lab 14](labs/14-multi-region-failover.md) · [CP 05](assessments/checkpoint-05.md) · [Project 03](projects/03-multi-region-chat/README.md) | Draft |

### Module 08 · Architecture Mastery & Modern Workloads (Advanced / Staff)
| # | Lesson | Core Topics | Practical Output / Artifact | Status |
|---:|---|---|---|---|
| **38** | [Ambiguous Problem Decomposition & ADRs](lessons/38-problem-decomposition.md) | 4-phase design loop, scoping constraints, writing Architecture Decision Records | Scored design doc & ADR | Draft |
| **39** | [Modern AI & High-Throughput Workloads](lessons/39-ai-systems-architecture.md) | LLM inference batching, KV-cache pressure, semantic caching, RAG pipelines, vector indexes, SSE | AI gateway + RAG architecture | Draft |
| **40** | [System Evolution, Reviews & Postmortems](lessons/40-system-evolution.md) | Strangler fig migrations, monolith→service extraction, blameless postmortems, architecture defense | Evolution plan · [Capstone](projects/04-capstone/README.md) | Draft |

---

## Essential Case-Study Library (16 End-to-End Systems)

Every case study follows the [System Design Document Template](templates/system-design.md) and includes requirements, capacity math, APIs, data model, Mermaid architecture, deep dives, failure modes, observability, security, and cost:

| # | Case Study | Primary Concepts Applied | Status |
|---:|---|---|---|
| **01** | [URL Shortener](case-studies/01-url-shortener.md) | Base62/random code generation, cache-aside, async analytics, abuse takedown | Ready |
| **02** | [Pastebin / Document Sharing](case-studies/02-pastebin.md) | Object vs DB storage split, TTL expiration cleanup, read-heavy CDN | Ready |
| **03** | [Distributed Rate Limiter](case-studies/03-rate-limiter.md) | Token bucket, sliding window log/counter, Redis Lua atomicity, fail-open vs fail-closed | Ready |
| **04** | [Multi-Channel Notification Service](case-studies/04-notification-service.md) | Priority queues, rate-limited vendor workers, outbox, user preferences, retries/DLQ | Ready |
| **05** | [Social News Feed / Timeline](case-studies/05-news-feed.md) | Fan-out-on-write vs fan-out-on-read hybrid, celebrity hot keys, cursor pagination | Ready |
| **06** | [Real-Time Chat & Presence](case-studies/06-chat-and-presence.md) | WebSocket gateways, heartbeat presence, message ordering, offline sync, encryption | Ready |
| **07** | [Cloud File Storage & Sync](case-studies/07-file-storage-sync.md) | Chunking, deduplication, delta sync, conflict copies, presigned URLs | Ready |
| **08** | [Video Upload, Transcoding & Streaming](case-studies/08-video-streaming.md) | Multipart upload, DAG transcoding workers, HLS/DASH adaptive bitrate, CDN edge | Ready |
| **09** | [Search Autocomplete & Typeahead](case-studies/09-search-autocomplete.md) | Trie/FST data structures, frequency decay, prefix caching, incremental index updates | Ready |
| **10** | [Ride-Hailing & Geospatial Dispatch](case-studies/10-ride-hailing.md) | Quadtrees / Geohash / H3 cells, high-frequency location streams, matching locks | Ready |
| **11** | [Food Delivery & Logistics Tracking](case-studies/11-food-delivery.md) | Order state machine (Saga), courier ETA routing, live WebSocket/SSE push | Ready |
| **12** | [Payment Processing & Ledger](case-studies/12-payment-ledger.md) | Double-entry accounting, idempotency keys, serializable balances, PSP reconciliation | Ready |
| **13** | [Ticket Booking & Inventory Reservation](case-studies/13-ticket-booking.md) | High-contention seat locks, TTL holds, waiting rooms/virtual queues, anti-bot throttling | Ready |
| **14** | [Metrics & Log Ingestion Pipeline](case-studies/14-metrics-pipeline.md) | High-write ingestion, buffering, time-series compaction, downsampling, retention tiers | Ready |
| **15** | [Distributed Job Scheduler](case-studies/15-job-scheduler.md) | Partitioned cron polling, worker leases, fencing tokens, retry/backoff policies | Ready |
| **16** | [Multi-Tenant SaaS Platform](case-studies/16-multitenant-saas.md) | Tenant isolation models (shared vs schema vs DB), noisy-neighbor limits, billing meters | Ready |

---

## Stage Projects & Capstone

1. [Project 01 · URL Shortener & Rate Limiter Platform](projects/01-url-shortener-platform/README.md) (after Module 03)
2. [Project 02 · Notification & Activity Feed Platform](projects/02-notification-and-feed/README.md) (after Module 05)
3. [Project 03 · Multi-Region Chat & Presence Service](projects/03-multi-region-chat/README.md) (after Module 07)
4. [Project 04 · Production System Design Capstone](projects/04-capstone/README.md) (Module 08)

---

## Core Course Rule

**Never teach a product before the problem.** Explain *why* an ephemeral derived store is needed before introducing Redis, *why* a partitioned append-only log is needed before introducing Kafka, and *why* quorum consensus is needed before introducing Raft or etcd.
