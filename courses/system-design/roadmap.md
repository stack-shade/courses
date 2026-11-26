# System Design · Learning Roadmap

A structured, beginner-to-advanced path spanning **9 Modules (00–08)**, **40 Lessons**, **14 Labs**, **16 Case Studies**, **5 Checkpoints**, and **4 Major Projects**. Treat durations as pacing guides, not rigid deadlines—advance only when you can draw and defend each concept.

---

## Stage 0 · Orientation & Study Setup

- [ ] Read [How to Learn System Design](learning-system.md) and copy the [learning log template](templates/learning-log.md).
- [ ] Practice the core design loop: **Clarify → Estimate → Simple Architecture → Deep Dive → Failure Modes → Evolution**.
- [ ] Bookmark the [Curated Resource Library](resources/README.md), [Glossary](glossary.md), and [`downloads/index.html`](downloads/index.html) for interactive slides & simulations.

---

## Stage 1 · Foundations, Networking & Data Storage (Beginner → Intermediate)

### Module 00 · Foundations & Design Reasoning
1. [ ] **L01 · Thinking in Systems** — [Lesson](lessons/01-thinking-in-systems.md) · [Slides](slides/01-course-kickoff.md)
2. [ ] **L02 · Requirements & Quality Attributes** — [Lesson](lessons/02-requirements-and-capacity.md) · [Slides](slides/02-requirements-and-estimation.md)
3. [ ] **L03 · Back-of-the-Envelope Capacity Estimation** — [Lesson](lessons/03-capacity-estimation.md) · [Lab 01](labs/01-capacity-estimation.md) · [Slides](slides/03-capacity-estimation.md)
4. [ ] **L04 · Latency, Throughput & Bottleneck Analysis** — [Lesson](lessons/04-latency-and-bottlenecks.md) · [Slides](slides/04-latency-and-bottlenecks.md)

### Module 01 · Internet, Networking & API Contracts
5. [ ] **L05 · DNS & The Web Request Lifecycle** — [Lesson](lessons/03-the-web-request.md) · [Diagram](diagrams/request-sequence.mmd) · [Slides](slides/05-web-request-dns.md)
6. [ ] **L06 · TCP, UDP, TLS 1.3 & HTTP/1.1–3** — [Lesson](lessons/06-transport-tls-http.md) · [Lab 02](labs/02-http-tls-timing.md) · [Slides](slides/06-transport-tls-http.md)
7. [ ] **L07 · Reverse Proxies, CDNs & Edge Caching** — [Lesson](lessons/07-proxies-cdn-gateway.md) · [Slides](slides/07-proxies-cdn-gateway.md)
8. [ ] **L08 · Load Balancing & Traffic Routing** — [Lesson](lessons/08-load-balancing.md) · [Slides](slides/08-load-balancing.md)
9. [ ] **L09 · API Design: REST, gRPC, GraphQL, WebSockets, SSE & Idempotency** — [Lesson](lessons/09-api-contracts.md) · [Lab 03](labs/03-api-idempotency.md) · [Slides](slides/09-api-contracts.md)

### Module 02 · Data Modeling & Storage Internals
10. [ ] **L10 · Data Models & Database Selection** — [Lesson](lessons/10-data-models.md) · [Slides](slides/10-data-models.md)
11. [ ] **L11 · Storage Engines: B+Trees, LSM-Trees, WAL & Compaction** — [Lesson](lessons/11-storage-engines.md) · [Slides](slides/11-storage-engines.md)
12. [ ] **L12 · Indexing, Query Plans & Schema Trade-Offs** — [Lesson](lessons/12-indexing-query-plans.md) · [Lab 04](labs/04-index-and-explain.md) · [Slides](slides/12-indexing-query-plans.md)
13. [ ] **L13 · Transactions, ACID, MVCC & Isolation Levels** — [Lesson](lessons/13-transactions-isolation.md) · [Slides](slides/13-transactions-isolation.md)
14. [ ] **L14 · Object, Media & Blob Storage** — [Lesson](lessons/14-object-storage.md) · [Lab 05](labs/05-presigned-multipart-upload.md) · [Slides](slides/14-object-storage.md)

- [ ] **Assessments:** Complete [Checkpoint 01 · Foundations](assessments/checkpoint-01.md) and [Checkpoint 02 · Storage & APIs](assessments/checkpoint-02.md).

---

## Stage 2 · Building Blocks, Caching & Scaling (Intermediate → Advanced)

### Module 03 · Caching & Stateless Compute
15. [ ] **L15 · Caching Patterns & Topologies** — [Lesson](lessons/15-caching-patterns.md) · [Slides](slides/15-caching-patterns.md)
16. [ ] **L16 · Eviction Policies, Expiration & Invalidation** — [Lesson](lessons/16-eviction-invalidation.md) · [Slides](slides/16-eviction-invalidation.md)
17. [ ] **L17 · Cache Stampedes, Hot Keys & Penetration** — [Lesson](lessons/17-cache-failure-modes.md) · [Lab 06](labs/06-cache-stampede.md) · [Slides](slides/17-cache-failure-modes.md)
18. [ ] **L18 · Stateless Services, Concurrency & Connection Pools** — [Lesson](lessons/18-stateless-concurrency.md) · [Slides](slides/18-stateless-concurrency.md)

- [ ] **Stage 1 Project:** Complete [Project 01 · URL Shortener Platform](projects/01-url-shortener-platform/README.md) ([Case 01](case-studies/01-url-shortener.md), [Case 02](case-studies/02-pastebin.md), [Case 03](case-studies/03-rate-limiter.md)).

### Module 04 · Scaling Data: Replication & Sharding
19. [ ] **L19 · Data Replication Strategies & Replication Lag** — [Lesson](lessons/19-replication.md) · [Slides](slides/19-replication.md)
20. [ ] **L20 · Partitioning, Sharding & Consistent Hashing** — [Lesson](lessons/20-sharding-hashing.md) · [Lab 07](labs/07-consistent-hashing.md) · [Slides](slides/20-sharding-hashing.md)
21. [ ] **L21 · Hot Partitions, Rebalancing & Zero-Downtime Migrations** — [Lesson](lessons/21-hot-shards-migrations.md) · [Lab 08](labs/08-zero-downtime-migration.md) · [Slides](slides/21-hot-shards-migrations.md)
22. [ ] **L22 · Distributed ID Generation (Snowflake, UUIDv7, ULID)** — [Lesson](lessons/22-distributed-ids.md) · [Slides](slides/22-distributed-ids.md)

- [ ] **Assessment:** Complete [Checkpoint 03 · Caching, Replication & Sharding](assessments/checkpoint-03.md).

### Module 05 · Asynchronous Systems, Streaming & Search
23. [ ] **L23 · Message Queues vs Event Streams** — [Lesson](lessons/23-queues-vs-streams.md) · [Slides](slides/23-queues-vs-streams.md)
24. [ ] **L24 · Delivery Semantics, Ordering & Idempotent Consumers** — [Lesson](lessons/24-delivery-semantics.md) · [Lab 09](labs/09-idempotent-dlq-worker.md) · [Slides](slides/24-delivery-semantics.md)
25. [ ] **L25 · Distributed Data Patterns: Outbox, CDC, Sagas, CQRS & Event Sourcing** — [Lesson](lessons/25-outbox-saga-cqrs.md) · [Slides](slides/25-outbox-saga-cqrs.md)
26. [ ] **L26 · Full-Text Search, Inverted Indexes & Autocomplete** — [Lesson](lessons/26-search-pipelines.md) · [Lab 10](labs/10-search-autocomplete.md) · [Slides](slides/26-search-pipelines.md)
27. [ ] **L27 · Batch, Stream Processing & Real-Time OLAP** — [Lesson](lessons/27-stream-olap.md) · [Slides](slides/27-stream-olap.md)

- [ ] **Stage 2 Project:** Complete [Project 02 · Notification & Activity Feed Platform](projects/02-notification-and-feed/README.md).

---

## Stage 3 · Distributed Systems, Reliability & Operations (Advanced)

### Module 06 · Distributed Systems Theory & Coordination
28. [ ] **L28 · Partial Failure, Timeouts, Exponential Backoff, Jitter & Circuit Breakers** — [Lesson](lessons/28-partial-failure.md) · [Lab 11](labs/11-retry-storm-circuit-breaker.md) · [Slides](slides/28-partial-failure.md)
29. [ ] **L29 · Time, Clocks, Ordering & Fencing Tokens** — [Lesson](lessons/29-clocks-and-fencing.md) · [Slides](slides/29-clocks-and-fencing.md)
30. [ ] **L30 · Consistency Models, Quorum Reads/Writes (`R + W > N`) & CRDTs** — [Lesson](lessons/30-consistency-quorums.md) · [Slides](slides/30-consistency-quorums.md)
31. [ ] **L31 · CAP, PACELC & Consensus (Raft / Paxos)** — [Lesson](lessons/31-cap-consensus-raft.md) · [Slides](slides/31-cap-consensus-raft.md)
32. [ ] **L32 · Distributed Coordination, Leases & Locking (etcd / ZooKeeper)** — [Lesson](lessons/32-distributed-coordination.md) · [Slides](slides/32-distributed-coordination.md)

- [ ] **Assessment:** Complete [Checkpoint 04 · Distributed Failure & Consistency](assessments/checkpoint-04.md).

### Module 07 · Reliability, Security, Observability & Cloud
33. [ ] **L33 · Reliability Engineering: SLIs, SLOs, Backpressure & Load Shedding** — [Lesson](lessons/33-reliability-overload.md) · [Lab 12](labs/12-load-shedding-rate-limiter.md) · [Slides](slides/33-reliability-overload.md)
34. [ ] **L34 · Observability: Structured Logs, RED/USE Metrics, OTel Tracing & Chaos Testing** — [Lesson](lessons/34-observability-chaos.md) · [Slides](slides/34-observability-chaos.md)
35. [ ] **L35 · System Security: OAuth 2.1/OIDC, RBAC/ReBAC, mTLS, Secrets & Abuse Control** — [Lesson](lessons/35-security-identity.md) · [Lab 13](labs/13-threat-model-oauth.md) · [Slides](slides/35-security-identity.md)
36. [ ] **L36 · Containers, Orchestration & Zero-Downtime Rollouts** — [Lesson](lessons/36-cloud-deployments.md) · [Slides](slides/36-cloud-deployments.md)
37. [ ] **L37 · Multi-Region Architecture, Disaster Recovery (RPO/RTO) & FinOps** — [Lesson](lessons/37-multi-region-finops.md) · [Lab 14](labs/14-multi-region-failover.md) · [Slides](slides/37-multi-region-finops.md)

- [ ] **Assessment:** Complete [Checkpoint 05 · Reliability, Security & Operations](assessments/checkpoint-05.md).
- [ ] **Stage 3 Project:** Complete [Project 03 · Multi-Region Chat & Presence Service](projects/03-multi-region-chat/README.md).

---

## Stage 4 · Architecture Mastery & Case Studies (Advanced / Staff)

### Module 08 · Mastery & Modern Workloads
38. [ ] **L38 · Ambiguous Prompt Decomposition & Writing High-Signal ADRs** — [Lesson](lessons/38-problem-decomposition.md) · [Slides](slides/38-problem-decomposition.md)
39. [ ] **L39 · Modern AI & High-Throughput Workloads (LLM Inference, RAG, Vector Search, SSE)** — [Lesson](lessons/39-ai-systems-architecture.md) · [Slides](slides/39-ai-systems-architecture.md)
40. [ ] **L40 · Architecture Evolution, Monolith Extraction & Postmortems** — [Lesson](lessons/40-system-evolution.md) · [Slides](slides/40-system-evolution.md)
- [ ] **Case Study Mastery:** Work through all 16 systems in [curriculum.md](curriculum.md#essential-case-study-library-16-end-to-end-systems) using the [System Design Template](templates/system-design.md).
- [ ] **Capstone:** Complete [Project 04 · Production System Design Capstone](projects/04-capstone/README.md).

---

## Repeatable Weekly Study Loop

| Session | Activity | Evidence Produced |
|---|---|---|
| **1** | Read lesson + 1 primary RFC/doc | 1-page concept notes in your own words |
| **2** | Active recall without notes | List of gaps & unanswered questions |
| **3** | Draw system flow & failure diagram | Annotated Mermaid or Excalidraw diagram |
| **4** | Run lab or interactive simulation | Measured numbers with units |
| **5** | Break a component (latency / outage / skew) | Failure observations & recovery behavior |
| **6** | Teach back using the HTML slide deck | 5-minute verbal explanation or short post |

---

## Readiness Rubric

Score every concept from `0` to `3` honestly:
- **0 — Unfamiliar:** Cannot explain the term cleanly.
- **1 — Explain:** Can define it and draw a basic mental model.
- **2 — Apply:** Can pick it for a concrete workload and list pros/cons.
- **3 — Defend:** Can calculate capacity/cost, spot failure modes, and justify alternatives under pressure.

Advance when core concepts reach **2**; sharpen topics to **3** during Stage Projects and Case Studies.
