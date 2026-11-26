# Curated Resource Library

A selected primary-source library supporting all **9 modules** of the System Design course. Use the course lessons for the guided narrative and these primary references to verify specifications, inspect internals, and read real production engineering stories.

For an exact **Module 00–08 & Lesson 01–40 link matrix**, see [Topic Resource Index](topic-index.md).

**Source Integrity Policy:** Standards, official docs, peer-reviewed papers, and first-party engineering blogs come first. Paid books are explicitly labeled as not free full-text sources.

---

## 1. Standards & Networking Foundations

| Resource | Type | Access | Best For |
|---|---|---|---|
| [RFC 9110 · HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110) | RFC Standard | Free | Authoritative HTTP methods, caching, status codes, idempotency |
| [RFC 8446 · TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446) | RFC Standard | Free | Modern 1-RTT/0-RTT TLS handshakes and cipher security |
| [RFC 9114 · HTTP/3](https://www.rfc-editor.org/rfc/rfc9114) | RFC Standard | Free | QUIC multiplexed transport eliminating TCP head-of-line blocking |
| [RFC 9562 · UUID Versions](https://www.rfc-editor.org/rfc/rfc9562) | RFC Standard | Free | UUIDv4 vs time-ordered UUIDv7 for database-friendly primary keys |
| [RFC 9700 · OAuth 2.0 Security BCP](https://www.rfc-editor.org/rfc/rfc9700) | RFC Standard | Free | Current OAuth 2.x/PKCE security requirements |
| [MDN Web Docs · HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP) | Official Docs | Free | Browser-facing headers, caching, CORS, and cookies |
| [Cloudflare Learning Center](https://www.cloudflare.com/learning/) | Technical Primer | Free | Clear visual explainers for DNS, BGP, Anycast, CDNs, and TLS |

---

## 2. Databases, Storage & Distributed Systems

| Resource | Type | Access | Best For |
|---|---|---|---|
| [Designing Data-Intensive Applications (DDIA)](https://dataintensive.net/) | Book (Kleppmann) | Paid book | Deep mental models for storage, replication, sharding, streams, consistency |
| [PostgreSQL Current Documentation](https://www.postgresql.org/docs/current/) | Official Docs | Free | MVCC isolation levels, B-Tree/GIN indexes, `EXPLAIN`, logical replication |
| [RocksDB Architecture Wiki](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview) | Official Docs | Free | LSM-Tree MemTables, SSTables, Bloom filters, and compaction |
| [Redis Documentation](https://redis.io/docs/latest/) | Official Docs | Free | Data structures, eviction policies, persistence (RDB/AOF), clustering |
| [Apache Kafka Documentation](https://kafka.apache.org/documentation/) | Official Docs | Free | Partitioned logs, consumer groups, delivery semantics, compaction |
| [etcd Documentation](https://etcd.io/docs/) | Official Docs | Free | Raft-backed coordination, leases, watches, and linearizable reads |
| [MIT 6.5840 Distributed Systems](https://pdos.csail.mit.edu/6.5840/) | University Course | Free | Consensus, Raft/MapReduce labs, replication, fault tolerance |
| [The Raft Consensus Paper](https://raft.github.io/raft.pdf) | Research Paper | Free PDF | Leader election, log replication, safety proof |
| [Amazon Dynamo Paper (2007)](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf) | Research Paper | Free PDF | Consistent hashing, sloppy quorums, hinted handoff, vector clocks |
| [Jepsen Consistency & Analyses](https://jepsen.io/analyses) | Fault Testing Reports | Free | Empirical consistency models and real distributed DB failure bugs |

---

## 3. Reliability, Security, Architecture & Operations

| Resource | Type | Access | Best For |
|---|---|---|---|
| [Google SRE Book](https://sre.google/sre-book/table-of-contents/) | Official Book | Free online | SLIs/SLOs, error budgets, overload handling, postmortem culture |
| [Google SRE Workbook](https://sre.google/workbook/table-of-contents/) | Official Workbook | Free online | Practical alerting, SLO math, and non-abstract system design |
| [Amazon Builders' Library](https://aws.amazon.com/builders-library/) | First-Party Eng | Free | Timeouts, backoff + jitter, load shedding, shuffle sharding |
| [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/) | Official Docs | Free | Reliability, security, performance, operations, and FinOps pillars |
| [OpenTelemetry Documentation](https://opentelemetry.io/docs/) | Official Docs | Free | Vendor-neutral traces, RED/USE metrics, and context propagation |
| [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/) | Security Guide | Free | AuthN, session security, rate limiting, cryptography checklists |
| [Kubernetes Concepts](https://kubernetes.io/docs/concepts/) | Official Docs | Free | Container scheduling, probes, services, and rollout primitives |
| [C4 Model](https://c4model.com/) & [Structurizr DSL](https://structurizr.com/dsl) | Architecture Notation | Free | Multi-level software architecture communication |

---

## 4. Broad Maps & First-Party Engineering Blogs

- [System Design Primer](https://github.com/donnemartin/system-design-primer) — Open syllabus map and sizing baselines.
- [System Design 101](https://github.com/ByteByteGoHq/system-design-101) — Visual summaries *(always cross-check nuance against RFCs/papers)*.
- [Engineering Blogs & Production Stories](engineering-blogs.md) — Curated links + 6-question reading worksheet for Netflix, Cloudflare, Uber, Discord, Meta, Stripe, GitHub, and AWS.
