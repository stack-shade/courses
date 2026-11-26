# Topic-to-Resource Link Matrix (Modules 00–08)

Use this matrix to jump directly from any module or lesson to verified primary documentation, RFCs, papers, and first-party production stories.

---

## Module 00–01 · Foundations, Internet & APIs (L01–L09)
- **System Decomposition & C4:** [C4 Model](https://c4model.com/) · [Google SRE Non-Abstract System Design](https://sre.google/resources/)
- **SLOs & Tail Latency:** [Google SRE Book · SLOs](https://sre.google/sre-book/service-level-objectives/) · [The Tail at Scale (Dean & Barroso)](https://research.google/pubs/the-tail-at-scale/)
- **DNS, Anycast & CDNs:** [Cloudflare Learning · DNS](https://www.cloudflare.com/learning/dns/what-is-dns/) · [Cloudflare Learning · CDN](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/)
- **HTTP, TLS & QUIC:** [RFC 9110 (HTTP Semantics)](https://www.rfc-editor.org/rfc/rfc9110) · [RFC 8446 (TLS 1.3)](https://www.rfc-editor.org/rfc/rfc8446) · [RFC 9114 (HTTP/3)](https://www.rfc-editor.org/rfc/rfc9114) · [MDN HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- **Load Balancing & APIs:** [Envoy Proxy Architecture](https://www.envoyproxy.io/docs/envoy/latest/intro/what_is_envoy) · [gRPC Core Concepts](https://grpc.io/docs/what-is-grpc/core-concepts/) · [Stripe API Idempotency](https://stripe.com/docs/api/idempotent_requests)

## Module 02–03 · Storage Internals, Caching & Compute (L10–L18)
- **Relational & Storage Engines:** [PostgreSQL Docs · Storage](https://www.postgresql.org/docs/current/storage.html) · [PostgreSQL · Indexes](https://www.postgresql.org/docs/current/indexes.html) · [RocksDB Wiki (LSM-Trees)](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview) · [Use The Index, Luke](https://use-the-index-luke.com/)
- **Transactions & MVCC:** [PostgreSQL · Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html) · [Designing Data-Intensive Applications (Paid Book)](https://dataintensive.net/)
- **Object Storage:** [AWS S3 Multipart Upload](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html)
- **Caching & Concurrency:** [Redis Docs](https://redis.io/docs/latest/) · [Scaling Memcache at Facebook](https://research.facebook.com/publications/scaling-memcache-at-facebook/) · [HikariCP Pool Sizing](https://github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing)

## Module 04–05 · Scaling Data, Messaging & Search (L19–L27)
- **Replication, Sharding & IDs:** [PostgreSQL High Availability](https://www.postgresql.org/docs/current/high-availability.html) · [Amazon Dynamo Paper (Consistent Hashing & Quorums)](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf) · [RFC 9562 · UUIDv7](https://www.rfc-editor.org/rfc/rfc9562)
- **Queues, Streams & Patterns:** [Apache Kafka Documentation](https://kafka.apache.org/documentation/) · [Microservices.io · Outbox Pattern](https://microservices.io/patterns/data/transactional-outbox.html) · [Streaming 101 (Akidau)](https://www.oreilly.com/radar/the-world-beyond-batch-streaming-101/)
- **Search & Real-World Scale:** [Elasticsearch / Inverted Index Docs](https://www.elastic.co/guide/en/elasticsearch/reference/current/getting-started.html) · [Discord · How Discord Stores Trillions of Messages](https://discord.com/blog/how-discord-stores-trillions-of-messages)

## Module 06–08 · Distributed Theory, Reliability, Security & AI (L28–L40)
- **Partial Failure & Clocks:** [AWS Builders' Library · Timeouts, Retries & Jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/) · [Martin Kleppmann · How to do Distributed Locking](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html)
- **Consistency & Consensus:** [Jepsen Consistency Models](https://jepsen.io/consistency) · [Raft Paper](https://raft.github.io/raft.pdf) · [The Secret Lives of Data · Raft Visualizer](https://thesecretlivesofdata.com/raft/) · [etcd Docs](https://etcd.io/docs/) · [MIT 6.5840](https://pdos.csail.mit.edu/6.5840/)
- **Overload, Observability & Security:** [Google SRE · Handling Overload](https://sre.google/sre-book/handling-overload/) · [AWS Builders' Library · Load Shedding](https://aws.amazon.com/builders-library/using-load-shedding-to-avoid-overload/) · [OpenTelemetry Docs](https://opentelemetry.io/docs/) · [RFC 9700 · OAuth Security BCP](https://www.rfc-editor.org/rfc/rfc9700) · [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- **Cloud, Multi-Region & Evolution:** [Kubernetes Concepts](https://kubernetes.io/docs/concepts/) · [AWS Multi-Region Fundamentals](https://docs.aws.amazon.com/whitepapers/latest/aws-multi-region-fundamentals/aws-multi-region-fundamentals.html) · [Martin Fowler · Strangler Fig](https://martinfowler.com/bliki/StranglerFigApplication.html) · [Google SRE · Postmortem Culture](https://sre.google/sre-book/postmortem-culture/)
- **Modern AI Workloads:** [PagedAttention / vLLM Paper](https://arxiv.org/abs/2309.06180)
