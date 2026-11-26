# System Design · Learning Roadmap

A structured, beginner-to-advanced path spanning **9 Modules (00–08)**, **40 Lessons**, **14 Labs**, **16 Case Studies**, **5 Checkpoints**, and **4 Major Projects**. Treat durations as pacing guides, not rigid deadlines—advance only when you can draw and defend each concept.

---

## Stage 0 · Orientation & Study Setup

- [ ] Read [How to Learn System Design](learning-system.md) and copy the [learning log template](templates/learning-log.md).
- [ ] Practice the core design loop: **Clarify → Estimate → Simple Architecture → Deep Dive → Failure Modes → Evolution**.
- [ ] Bookmark the [Curated Resource Library](resources/README.md) and [System Design Glossary](glossary.md).

---

## Stage 1 · Foundations, Networking & Data Storage (Beginner → Intermediate)

### Module 00 · Foundations & Design Reasoning
1. [ ] **L01 · Thinking in Systems** — [Lesson draft](lessons/01-thinking-in-systems.md) · [Slides](slides/01-course-kickoff.md)
2. [ ] **L02 · Requirements & Quality Attributes** — [Lesson draft](lessons/02-requirements-and-capacity.md) · [Slides](slides/02-requirements-and-estimation.md)
3. [ ] **L03 · Back-of-the-Envelope Capacity Estimation** — [Lab 01 ready](labs/01-capacity-estimation.md) · *(Lesson planned)*
4. [ ] **L04 · Latency, Throughput & Bottleneck Analysis** — *(Planned)*

### Module 01 · Internet, Networking & API Contracts
5. [ ] **L05 · DNS & The Web Request Lifecycle** — [Base draft](lessons/03-the-web-request.md) · [Diagram](diagrams/request-sequence.mmd)
6. [ ] **L06 · TCP, UDP, TLS 1.3 & HTTP/1.1–3** — + Lab 02 *(Planned)*
7. [ ] **L07 · Reverse Proxies, CDNs & Edge Caching** — *(Planned)*
8. [ ] **L08 · Load Balancing & Traffic Routing** — *(Planned)*
9. [ ] **L09 · API Design: REST, gRPC, GraphQL, WebSockets, SSE & Idempotency** — + Lab 03 *(Planned)*

### Module 02 · Data Modeling & Storage Internals
10. [ ] **L10 · Data Models & Database Selection** — *(Planned)*
11. [ ] **L11 · Storage Engines: B+Trees, LSM-Trees, WAL & Compaction** — *(Planned)*
12. [ ] **L12 · Indexing, Query Plans & Schema Trade-Offs** — + Lab 04 *(Planned)*
13. [ ] **L13 · Transactions, ACID, MVCC & Isolation Levels** — *(Planned)*
14. [ ] **L14 · Object, Media & Blob Storage** — + Lab 05 *(Planned)*

- [ ] **Assessment:** Complete [Checkpoint 01 · Foundations](assessments/checkpoint-01.md) and Checkpoint 02 (Storage & APIs).

---

## Stage 2 · Building Blocks, Caching & Scaling (Intermediate → Advanced)

### Module 03 · Caching & Stateless Compute
15. [ ] **L15 · Caching Patterns & Topologies** — *(Planned)*
16. [ ] **L16 · Eviction Policies, Expiration & Invalidation** — *(Planned)*
17. [ ] **L17 · Cache Stampedes, Hot Keys & Penetration** — + Lab 06 *(Planned)*
18. [ ] **L18 · Stateless Services, Concurrency & Connection Pools** — *(Planned)*

- [ ] **Stage 1 Project:** Complete [Case Study 01 · URL Shortener](case-studies/01-url-shortener.md) + design brief for Pastebin and Rate Limiter.

### Module 04 · Scaling Data: Replication & Sharding
19. [ ] **L19 · Data Replication Strategies & Replication Lag** — *(Planned)*
20. [ ] **L20 · Partitioning, Sharding & Consistent Hashing** — + Lab 07 *(Planned)*
21. [ ] **L21 · Hot Partitions, Rebalancing & Zero-Downtime Migrations** — + Lab 08 *(Planned)*
22. [ ] **L22 · Distributed ID Generation (Snowflake, UUIDv7, ULID)** — *(Planned)*

- [ ] **Assessment:** Complete Checkpoint 03 (Caching, Replication & Sharding).

### Module 05 · Asynchronous Systems, Streaming & Search
23. [ ] **L23 · Message Queues vs Event Streams** — *(Planned)*
24. [ ] **L24 · Delivery Semantics, Ordering & Idempotent Consumers** — + Lab 09 *(Planned)*
25. [ ] **L25 · Distributed Data Patterns: Outbox, CDC, Sagas, CQRS & Event Sourcing** — *(Planned)*
26. [ ] **L26 · Full-Text Search, Inverted Indexes & Autocomplete** — + Lab 10 *(Planned)*
27. [ ] **L27 · Batch, Stream Processing & Real-Time OLAP** — *(Planned)*

- [ ] **Stage 2 Project:** Architect a Notification Platform and a Hybrid Social News Feed; document fan-out write vs. read trade-offs.

---

## Stage 3 · Distributed Systems, Reliability & Operations (Advanced)

### Module 06 · Distributed Systems Theory & Coordination
28. [ ] **L28 · Partial Failure, Timeouts, Exponential Backoff, Jitter & Circuit Breakers** — + Lab 11 *(Planned)*
29. [ ] **L29 · Time, Clocks, Ordering & Fencing Tokens** — *(Planned)*
30. [ ] **L30 · Consistency Models, Quorum Reads/Writes (`R + W > N`) & CRDTs** — *(Planned)*
31. [ ] **L31 · CAP, PACELC & Consensus (Raft / Paxos)** — *(Planned)*
32. [ ] **L32 · Distributed Coordination, Leases & Locking (etcd / ZooKeeper)** — *(Planned)*

- [ ] **Assessment:** Complete Checkpoint 04 (Distributed Failure & Consistency).

### Module 07 · Reliability, Security, Observability & Cloud
33. [ ] **L33 · Reliability Engineering: SLIs, SLOs, Backpressure & Load Shedding** — + Lab 12 *(Planned)*
34. [ ] **L34 · Observability: Structured Logs, RED/USE Metrics, OTel Tracing & Chaos Testing** — *(Planned)*
35. [ ] **L35 · System Security: OAuth 2.1/OIDC, RBAC/ReBAC, mTLS, Secrets & Abuse Control** — + Lab 13 *(Planned)*
36. [ ] **L36 · Containers, Orchestration & Zero-Downtime Rollouts** — *(Planned)*
37. [ ] **L37 · Multi-Region Architecture, Disaster Recovery (RPO/RTO) & FinOps** — + Lab 14 *(Planned)*

- [ ] **Assessment:** Complete Checkpoint 05 (Reliability, Security & Operations).
- [ ] **Stage 3 Project:** Design a Multi-Region Chat & Presence System with a simulated region outage and postmortem.

---

## Stage 4 · Architecture Mastery & Case Studies (Advanced / Staff)

### Module 08 · Mastery & Modern Workloads
38. [ ] **L38 · Ambiguous Prompt Decomposition & Writing High-Signal ADRs** — *(Planned)*
39. [ ] **L39 · Modern AI & High-Throughput Workloads (LLM Inference, RAG, Vector Search, SSE)** — *(Planned)*
40. [ ] **L40 · Architecture Evolution, Monolith Extraction & Postmortems** — *(Planned)*
- [ ] **Case Study Mastery:** Work through all 16 systems in [curriculum.md](curriculum.md#essential-case-study-library-16-end-to-end-systems) using the [System Design Template](templates/system-design.md).
- [ ] **Capstone:** Produce one end-to-end production design doc, diagrams, 2 ADRs, working vertical slice, k6 load benchmark, injected failure report, cost breakdown, and a 15-minute recorded architecture defense.

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
