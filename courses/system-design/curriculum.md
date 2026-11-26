# Full Curriculum · System Design (Beginner → Advanced)

This is the master structural inventory across **9 Modules (00–08)**, **40 Lessons**, **14 Hands-On Labs**, **16 Case Studies**, **4 Stage Projects + 1 Capstone**, and **5 Checkpoints**.

For exact per-lesson learning objectives, Mermaid diagram specs, interactive animations, slide decks, and primary links, see the [Detailed Syllabus](syllabus.md). For sequential checklists, see the [Roadmap](roadmap.md).

---

## Module Overview Table

| Module | Title | Level | Lessons | Labs & Checkpoints | Practical Outcome | Status |
|---:|---|---|---:|---|---|---|
| **00** | Foundations & Design Reasoning | Beginner | 01–04 (4) | Lab 01 · Checkpoint 01 | One-page system map + capacity sheet | In progress (`01–02` draft) |
| **01** | Internet, Networking & API Contracts | Beginner → Int. | 05–09 (5) | Labs 02–03 | Request trace + idempotent API spec | In progress (`05` base draft) |
| **02** | Data Modeling & Storage Internals | Beginner → Int. | 10–14 (5) | Labs 04–05 · Checkpoint 02 | Multi-model schema + storage ADR | Planned |
| **03** | Caching & Stateless Compute | Intermediate | 15–18 (4) | Lab 06 · **Stage 1 Project** | Cache stampede defense + URL Shortener | Planned (`Case 01` brief ready) |
| **04** | Scaling Data: Replication & Sharding | Int. → Advanced | 19–22 (4) | Labs 07–08 · Checkpoint 03 | Consistent hashing ring + migration plan | Planned |
| **05** | Async Systems, Streaming & Search | Int. → Advanced | 23–27 (5) | Labs 09–10 · **Stage 2 Project** | Notification + Social Feed architecture | Planned |
| **06** | Distributed Systems & Coordination | Advanced | 28–32 (5) | Lab 11 · Checkpoint 04 | Quorum / Raft / Retry failure model | Planned |
| **07** | Reliability, Security, Ops & Cloud | Advanced | 33–37 (5) | Labs 12–14 · Checkpoint 05 · **Stage 3 Project** | Multi-Region Chat + Threat Model + Chaos Drill | Planned |
| **08** | Architecture Mastery & Case Studies | Advanced / Staff | 38–40 (3) | **16 Case Studies · Capstone** | Production Design Doc + Vertical Slice + Presentation | In progress (`Case 01` ready) |

---

## Complete Lesson Matrix (L01–L40)

### Module 00 · Foundations & Design Reasoning (Beginner)
| # | Lesson | Core Topics | Practical Output / Artifact | Status |
|---:|---|---|---|---|
| **01** | [Thinking in Systems](lessons/01-thinking-in-systems.md) | Boundaries, actors, compute, durable vs derived state, trade-offs | 5-layer decomposition of a daily app | Draft |
| **02** | [Requirements & Quality Attributes](lessons/02-requirements-and-capacity.md) | Functional requirements, NFRs (`p95/p99`, availability, durability, cost) | Measurable requirements & NFR table | Draft |
| **03** | Back-of-the-Envelope Capacity Estimation | DAU/MAU, QPS, peak bursts, storage, bandwidth, Little's Law | [Lab 01](labs/01-capacity-estimation.md) sizing sheet | Lab ready / Lesson planned |
| **04** | Latency, Throughput & Bottlenecks | CPU, RAM, disk IOPS, network, lock contention, tail amplification | Bottleneck diagnostic matrix | Planned |

### Module 01 · Internet, Networking & API Contracts (Beginner → Intermediate)
| # | Lesson | Core Topics | Practical Output / Artifact | Status |
|---:|---|---|---|---|
| **05** | [DNS & The Web Request Lifecycle](lessons/03-the-web-request.md) | Recursive DNS, A/AAAA/CNAME, TTL propagation, Anycast, BGP basics | End-to-end request sequence | Base draft |
| **06** | Transport & Security Protocols | TCP 3-way handshake, congestion control, UDP, TLS 1.3, HTTP/1.1 vs 2 vs 3 | Browser/TLS timing breakdown (Lab 02) | Planned |
| **07** | Edge Infrastructure: Proxies & CDNs | Reverse vs forward proxies, CDN PoPs, cache keys, TLS termination, WAF | Edge vs origin offload calculation | Planned |
| **08** | Load Balancing & Traffic Routing | L4 vs L7, round-robin, least-connections, consistent hashing, draining | Routing & health-check topology | Planned |
| **09** | API Design & Communication Patterns | REST, gRPC/Protobuf, GraphQL, WebSockets, SSE, pagination, idempotency | Versioned, idempotent API contract (Lab 03) | Planned |

### Module 02 · Data Modeling & Storage Internals (Beginner → Intermediate)
| # | Lesson | Core Topics | Practical Output / Artifact | Status |
|---:|---|---|---|---|
| **10** | Data Models & Database Selection | Relational, document, key-value, wide-column, graph, time-series, vector | Workload-to-engine decision matrix | Planned |
| **11** | Storage Engine Internals | Pages, B+Trees vs LSM-Trees, WAL, MemTables, SSTables, Bloom filters, compaction | Read/write/space amplification comparison | Planned |
| **12** | Indexing & Query Execution Plans | Clustered vs secondary indexes, composite index order, covering indexes, `EXPLAIN` | Slow-query index tuning (Lab 04) | Planned |
| **13** | Transactions, ACID & Isolation Levels | Atomicity, MVCC, locks, Read Committed, Repeatable Read, Serializable, write skew | Anomaly reproduction table | Planned |
| **14** | Object, Media & Blob Storage | Object store layout, metadata vs payload split, presigned URLs, multipart upload | Upload architecture (Lab 05) | Planned |

### Module 03 · Caching & Stateless Compute (Intermediate)
| # | Lesson | Core Topics | Practical Output / Artifact | Status |
|---:|---|---|---|---|
| **15** | Caching Topologies & Write Policies | Client, edge, app, DB caches; cache-aside, read/write-through, write-behind | Write policy failure matrix | Planned |
| **16** | Eviction, Expiration & Invalidation | LRU, LFU, Window-TinyLFU, TTL jitter, pub/sub invalidation, versioned keys | Cache memory & hit-ratio sizing | Planned |
| **17** | Cache Stampedes, Hot Keys & Penetration | Thundering herd, singleflight/request coalescing, null caching, Bloom guards | Stampede mitigation lab (Lab 06) | Planned |
| **18** | Stateless Services & Concurrency | Threads vs async event loops, worker pools, DB connection pooling, externalized sessions | Concurrency bottleneck worksheet | Planned |

### Module 04 · Scaling Data: Replication & Sharding (Intermediate → Advanced)
| # | Lesson | Core Topics | Practical Output / Artifact | Status |
|---:|---|---|---|---|
| **19** | Data Replication Strategies | Single-leader, multi-leader, leaderless, sync vs async, lag, read-your-writes | Replication lag anomaly map | Planned |
| **20** | Partitioning & Consistent Hashing | Range vs hash vs directory partitioning, consistent hashing + vnodes, cross-shard queries | Virtual-node distribution lab (Lab 07) | Planned |
| **21** | Hot Partitions, Rebalancing & Migrations | Key salting, split/merge shards, dual-write, expand-contract online migrations | Zero-downtime migration runbook (Lab 08) | Planned |
| **22** | Distributed ID Generation | Auto-increment limits, UUIDv4 vs UUIDv7, Snowflake IDs, ULID, clock drift | 64-bit ID layout & collision analysis | Planned |

### Module 05 · Asynchronous Systems, Streaming & Search (Intermediate → Advanced)
| # | Lesson | Core Topics | Practical Output / Artifact | Status |
|---:|---|---|---|---|
| **23** | Queues vs Event Streams | Point-to-point queues, pub/sub, partitioned append-only logs, consumer groups | Queue vs log selection guide | Planned |
| **24** | Delivery Semantics & Idempotency | At-most-once, at-least-once, effectively-once, partition keys, DLQs, poison pills | Idempotent worker + DLQ lab (Lab 09) | Planned |
| **25** | Distributed Data Patterns | Transactional outbox, CDC, Saga orchestration vs choreography, CQRS, Event Sourcing | Saga failure-compensation flow | Planned |
| **26** | Full-Text Search & Autocomplete | Inverted index, analyzers, BM25 scoring, tries/FSTs, async search sync, hybrid search | Autocomplete + inverted index lab (Lab 10) | Planned |
| **27** | Batch, Stream Processing & OLAP | MapReduce/Spark model, Flink windowing & watermarks, Lambda/Kappa, columnar OLAP | Streaming aggregation pipeline | Planned |

### Module 06 · Distributed Systems Theory & Coordination (Advanced)
| # | Lesson | Core Topics | Practical Output / Artifact | Status |
|---:|---|---|---|---|
| **28** | Partial Failure, Timeouts & Circuit Breakers | Grey failures, retry storms, exponential backoff + full jitter, retry budgets, circuit breakers | Retry storm & circuit breaker lab (Lab 11) | Planned |
| **29** | Time, Clocks & Ordering | Physical NTP drift, monotonic clocks, Lamport & vector clocks, TrueTime, fencing tokens | Stale-lock corruption trace | Planned |
| **30** | Consistency Models & Quorums | Linearizability, sequential, causal, eventual consistency, `R + W > N`, sloppy quorums, CRDTs | Quorum overlap & stale-read matrix | Planned |
| **31** | CAP, PACELC & Consensus | CAP partition nuance, PACELC latency trade-off, Raft leader election, log replication, split-brain | Raft election & network partition flow | Planned |
| **32** | Distributed Locks, Leases & Coordination | etcd/ZooKeeper primitives, TTL leases, lock safety vs efficiency, fencing | Safe leader-election contract | Planned |

### Module 07 · Reliability, Security, Observability & Cloud (Advanced)
| # | Lesson | Core Topics | Practical Output / Artifact | Status |
|---:|---|---|---|---|
| **33** | Reliability, SLIs/SLOs & Overload Control | Error budgets, bulkheads, backpressure, load shedding, adaptive concurrency | Load-shedding & token-bucket lab (Lab 12) | Planned |
| **34** | Observability & Chaos Engineering | Structured logs, RED/USE metrics, distributed tracing (OTel), burn-rate alerts, GameDays | Service observability spec | Planned |
| **35** | System Security, Identity & Abuse Control | AuthN/AuthZ, OAuth 2.1/OIDC, JWT vs opaque tokens, RBAC/ReBAC, mTLS, KMS, rate limits | STRIDE threat model & OAuth lab (Lab 13) | Planned |
| **36** | Containers, Orchestration & Deployments | Regions/AZs, VPCs, scheduling model, blue/green, canary, feature flags, rollbacks | Safe progressive rollout plan | Planned |
| **37** | Multi-Region, Disaster Recovery & FinOps | Active-active vs active-passive, RPO/RTO, DNS failover, data residency, cost modeling | Multi-region failover drill (Lab 14) | Planned |

### Module 08 · Architecture Mastery & Modern Workloads (Advanced / Staff)
| # | Lesson | Core Topics | Practical Output / Artifact | Status |
|---:|---|---|---|---|
| **38** | Ambiguous Problem Decomposition & ADRs | 4-phase design loop, scoping constraints, writing Architecture Decision Records | Scored design doc & ADR | Planned |
| **39** | Modern AI & High-Throughput Workloads | LLM inference batching, KV-cache pressure, semantic caching, RAG pipelines, vector indexes, SSE | AI gateway + RAG architecture | Planned |
| **40** | System Evolution, Reviews & Postmortems | Strangler fig migrations, monolith→service extraction, blameless postmortems, architecture defense | Evolution roadmap + postmortem | Planned |

---

## Essential Case-Study Library (16 End-to-End Systems)

Every case study follows the [System Design Document Template](templates/system-design.md) and includes requirements, capacity math, APIs, data model, Mermaid architecture, deep dives, failure modes, observability, security, and cost:

| # | Case Study | Primary Concepts Applied | Status |
|---:|---|---|---|
| **01** | [URL Shortener](case-studies/01-url-shortener.md) | Base62/random code generation, cache-aside, async analytics, abuse takedown | Exercise brief ready |
| **02** | Pastebin / Document Sharing | Object vs DB storage split, TTL expiration cleanup, read-heavy CDN | Planned |
| **03** | Distributed Rate Limiter | Token bucket, sliding window log/counter, Redis Lua atomicity, fail-open vs fail-closed | Planned |
| **04** | Multi-Channel Notification Service | Priority queues, rate-limited vendor workers, outbox, user preferences, retries/DLQ | Planned |
| **05** | Social News Feed / Timeline | Fan-out-on-write vs fan-out-on-read hybrid, celebrity hot keys, cursor pagination | Planned |
| **06** | Real-Time Chat & Presence | WebSocket gateways, heartbeat presence, message ordering, offline sync, encryption | Planned |
| **07** | Cloud File Storage & Sync | Chunking, deduplication, delta sync, conflict copies, presigned URLs | Planned |
| **08** | Video Upload, Transcoding & Streaming | Multipart upload, DAG transcoding workers, HLS/DASH adaptive bitrate, CDN edge | Planned |
| **09** | Search Autocomplete & Typeahead | Trie/FST data structures, frequency decay, prefix caching, incremental index updates | Planned |
| **10** | Ride-Hailing & Geospatial Dispatch | Quadtrees / Geohash / H3 cells, high-frequency location streams, matching locks | Planned |
| **11** | Food Delivery & Logistics Tracking | Order state machine (Saga), courier ETA routing, live WebSocket/SSE push | Planned |
| **12** | Payment Processing & Ledger | Double-entry accounting, idempotency keys, serializable balances, PSP reconciliation | Planned |
| **13** | Ticket Booking & Inventory Reservation | High-contention seat locks, TTL holds, waiting rooms/virtual queues, anti-bot throttling | Planned |
| **14** | Metrics & Log Ingestion Pipeline | High-write ingestion, buffering, time-series compaction, downsampling, retention tiers | Planned |
| **15** | Distributed Job Scheduler | Partitioned cron polling, worker leases, fencing tokens, retry/backoff policies | Planned |
| **16** | Multi-Tenant SaaS Platform | Tenant isolation models (shared vs schema vs DB), noisy-neighbor limits, billing meters | Planned |

---

## Stage Projects & Capstone

1. **Stage 1 Project (after Module 03):** Production-spec **URL Shortener + Rate Limiter** (design doc, capacity worksheet, API spec, cache hit/miss experiment).
2. **Stage 2 Project (after Module 05):** **Notification & Activity Feed System** (hybrid fan-out, outbox worker, DLQ handling, search integration).
3. **Stage 3 Project (after Module 07):** **Multi-Region Chat & Presence Architecture** (active-active topology, failure injection + blameless postmortem).
4. **Course Capstone (Module 08):** Full System Design Document + 2 ADRs + working vertical slice + k6 load benchmark + injected failure drill + cost model + recorded 15-minute architecture review.

---

## Core Course Rule

**Never teach a product before the problem.** Explain *why* an ephemeral derived store is needed before introducing Redis, *why* a partitioned append-only log is needed before introducing Kafka, and *why* quorum consensus is needed before introducing Raft or etcd.
