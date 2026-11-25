# Full Curriculum

This is the topic inventory. The [roadmap](roadmap.md) gives the learning order. Each module will grow into a lesson, visualization, practical exercise, knowledge check and (where useful) a slide deck.

| # | Module | Topics and questions | Practical artifact |
|---:|---|---|---|
| 00 | Orientation | What is a system? Functional vs quality requirements, constraints, interfaces | One-page system map |
| 01 | Design reasoning | Abstraction, decomposition, boundaries, trade-offs, bottlenecks | Explain a familiar app |
| 02 | Requirements | User journeys, scope, scale assumptions, latency and availability targets | Requirements brief |
| 03 | Estimation | DAU/MAU, QPS, peak traffic, storage, bandwidth, growth | Sizing worksheet |
| 04 | Internet | DNS, IP, TCP/UDP, TLS, HTTP, cookies, proxies and CDN | Request sequence diagram |
| 05 | API design | REST/RPC, contracts, pagination, retries, idempotency, versioning | API specification |
| 06 | Databases | Relational and NoSQL models, transactions, constraints, isolation | Data model and query set |
| 07 | Storage internals | B-tree, LSM-tree, WAL, compaction, indexes, object storage | Compare read/write paths |
| 08 | Caching | Cache-aside, write-through, TTL, eviction, invalidation, hot keys | Cache experiment |
| 09 | Traffic management | Reverse proxy, L4/L7 load balancers, health checks, autoscaling | Deployment topology |
| 10 | Compute and concurrency | Stateless services, workers, threads, async I/O, pools, sessions | Concurrent API benchmark |
| 11 | Messaging | Queues vs streams, delivery semantics, ordering, retries, DLQ, backpressure | Async job pipeline |
| 12 | Data at scale | Replication, partitioning, sharding, hot partitions, rebalancing | Partitioning design |
| 13 | Search and media | Search index, object/blob storage, CDN, transcoding and metadata | File/media pipeline |
| 14 | Security | AuthN/AuthZ, OAuth/OIDC, TLS, encryption, secrets, rate limits, threat models | Threat model |
| 15 | Distributed systems | Partial failure, clocks, CAP, consistency, quorum, consensus | Consistency experiment |
| 16 | Reliability | Timeouts, retries, jitter, circuit breaker, bulkhead, load shedding | Failure-injection lab |
| 17 | Architecture patterns | Event-driven, outbox, saga, CQRS, event sourcing, service boundaries | Pattern comparison |
| 18 | Operations | Logs, metrics, traces, SLIs/SLOs, alerts, incident response, postmortems | Observability plan |
| 19 | Cloud and infrastructure | Containers, orchestration, regions/AZs, IaC, deployment strategies | Production deployment map |
| 20 | Advanced architecture | Multi-region, DR, migrations, cost, governance, sustainability | Architecture review |
| 21 | Case studies | URL shortener, chat, feed, notifications, file storage, video, payments, ride share | Complete design documents |
| 22 | Capstone | End-to-end product architecture and evolution | Design doc + implementation + presentation |

## Standard lesson format

Every finished module should answer:
1. What problem does this concept solve?
2. What happens under the hood?
3. Which assumptions does it require?
4. What are the alternatives?
5. What fails first, and how do we know?
6. How do we test it?
7. What changes at 10× or 100× traffic?
8. Which sources support the explanation?

The course is not tool-first. Learn the concept before selecting Redis, Kafka, PostgreSQL, Kubernetes or a cloud product.
