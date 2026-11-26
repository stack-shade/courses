# Presentation Downloads & Slide Bundles

All 40 course slide decks are authored in Markdown under [`../slides/`](../slides/) and compiled into **standalone single-file `.html` presentations** using:

```bash
node scripts/build-slides.mjs
```

Open [**Offline Teaching & Visuals Hub (`index.html`)**](index.html) in any browser to browse all 40 HTML decks and interact with all 40 live SVG/JS simulations.

See [Downloadable Animated HTML Slides Spec](../../../shared/guides/downloadable-html-slides.md) for keyboard controls (`←`/`→`/`Space`, `G` grid, `N` notes, `T` light/dark, `C` local webcam bubble, `F` fullscreen).

---

## Standalone Animated HTML Decks (`downloads/*.html`)

| Ep | Deck | HTML File | Markdown Source |
|---|---|---|---|
| **EP01** | Course Kickoff & Systems Thinking | [`01-course-kickoff.html`](01-course-kickoff.html) | [01-course-kickoff.md](../slides/01-course-kickoff.md) |
| **EP02** | Requirements & Capacity | [`02-requirements-and-estimation.html`](02-requirements-and-estimation.html) | [02-requirements-and-estimation.md](../slides/02-requirements-and-estimation.md) |
| **EP03** | Back-of-the-Envelope Capacity | [`03-capacity-estimation.html`](03-capacity-estimation.html) | [03-capacity-estimation.md](../slides/03-capacity-estimation.md) |
| **EP04** | Latency, Throughput & Bottlenecks | [`04-latency-and-bottlenecks.html`](04-latency-and-bottlenecks.html) | [04-latency-and-bottlenecks.md](../slides/04-latency-and-bottlenecks.md) |
| **EP05** | DNS & The Web Request Lifecycle | [`05-web-request-dns.html`](05-web-request-dns.html) | [05-web-request-dns.md](../slides/05-web-request-dns.md) |
| **EP06** | TCP, UDP, TLS 1.3 & HTTP/1.1–3 | [`06-transport-tls-http.html`](06-transport-tls-http.html) | [06-transport-tls-http.md](../slides/06-transport-tls-http.md) |
| **EP07** | Reverse Proxies, CDNs & Gateways | [`07-proxies-cdn-gateway.html`](07-proxies-cdn-gateway.html) | [07-proxies-cdn-gateway.md](../slides/07-proxies-cdn-gateway.md) |
| **EP08** | Load Balancing & Traffic Routing | [`08-load-balancing.html`](08-load-balancing.html) | [08-load-balancing.md](../slides/08-load-balancing.md) |
| **EP09** | API Design & Idempotency | [`09-api-contracts.html`](09-api-contracts.html) | [09-api-contracts.md](../slides/09-api-contracts.md) |
| **EP10** | Data Models & Database Selection | [`10-data-models.html`](10-data-models.html) | [10-data-models.md](../slides/10-data-models.md) |
| **EP11** | Storage Engines: B+Tree vs LSM | [`11-storage-engines.html`](11-storage-engines.html) | [11-storage-engines.md](../slides/11-storage-engines.md) |
| **EP12** | Indexing & Query Plans | [`12-indexing-query-plans.html`](12-indexing-query-plans.html) | [12-indexing-query-plans.md](../slides/12-indexing-query-plans.md) |
| **EP13** | Transactions, ACID & Isolation | [`13-transactions-isolation.html`](13-transactions-isolation.html) | [13-transactions-isolation.md](../slides/13-transactions-isolation.md) |
| **EP14** | Object, Media & Blob Storage | [`14-object-storage.html`](14-object-storage.html) | [14-object-storage.md](../slides/14-object-storage.md) |
| **EP15** | Caching Topologies & Write Policies | [`15-caching-patterns.html`](15-caching-patterns.html) | [15-caching-patterns.md](../slides/15-caching-patterns.md) |
| **EP16** | Eviction & Cache Invalidation | [`16-eviction-invalidation.html`](16-eviction-invalidation.html) | [16-eviction-invalidation.md](../slides/16-eviction-invalidation.md) |
| **EP17** | Cache Stampedes & Hot Keys | [`17-cache-failure-modes.html`](17-cache-failure-modes.html) | [17-cache-failure-modes.md](../slides/17-cache-failure-modes.md) |
| **EP18** | Stateless Services & Concurrency | [`18-stateless-concurrency.html`](18-stateless-concurrency.html) | [18-stateless-concurrency.md](../slides/18-stateless-concurrency.md) |
| **EP19** | Data Replication & Lag | [`19-replication.html`](19-replication.html) | [19-replication.md](../slides/19-replication.md) |
| **EP20** | Sharding & Consistent Hashing | [`20-sharding-hashing.html`](20-sharding-hashing.html) | [20-sharding-hashing.md](../slides/20-sharding-hashing.md) |
| **EP21** | Hot Partitions & Zero-Downtime Migrations | [`21-hot-shards-migrations.html`](21-hot-shards-migrations.html) | [21-hot-shards-migrations.md](../slides/21-hot-shards-migrations.md) |
| **EP22** | Distributed ID Generation | [`22-distributed-ids.html`](22-distributed-ids.html) | [22-distributed-ids.md](../slides/22-distributed-ids.md) |
| **EP23** | Message Queues vs Event Streams | [`23-queues-vs-streams.html`](23-queues-vs-streams.html) | [23-queues-vs-streams.md](../slides/23-queues-vs-streams.md) |
| **EP24** | Delivery Semantics & Idempotency | [`24-delivery-semantics.html`](24-delivery-semantics.html) | [24-delivery-semantics.md](../slides/24-delivery-semantics.md) |
| **EP25** | Outbox, CDC, Sagas & CQRS | [`25-outbox-saga-cqrs.html`](25-outbox-saga-cqrs.html) | [25-outbox-saga-cqrs.md](../slides/25-outbox-saga-cqrs.md) |
| **EP26** | Full-Text Search & Autocomplete | [`26-search-pipelines.html`](26-search-pipelines.html) | [26-search-pipelines.md](../slides/26-search-pipelines.md) |
| **EP27** | Batch, Streaming & Real-Time OLAP | [`27-stream-olap.html`](27-stream-olap.html) | [27-stream-olap.md](../slides/27-stream-olap.md) |
| **EP28** | Partial Failure, Retries & Circuit Breakers | [`28-partial-failure.html`](28-partial-failure.html) | [28-partial-failure.md](../slides/28-partial-failure.md) |
| **EP29** | Clocks, Ordering & Fencing Tokens | [`29-clocks-and-fencing.html`](29-clocks-and-fencing.html) | [29-clocks-and-fencing.md](../slides/29-clocks-and-fencing.md) |
| **EP30** | Consistency Models & Quorums | [`30-consistency-quorums.html`](30-consistency-quorums.html) | [30-consistency-quorums.md](../slides/30-consistency-quorums.md) |
| **EP31** | CAP, PACELC & Consensus (Raft) | [`31-cap-consensus-raft.html`](31-cap-consensus-raft.html) | [31-cap-consensus-raft.md](../slides/31-cap-consensus-raft.md) |
| **EP32** | Distributed Coordination & Leases | [`32-distributed-coordination.html`](32-distributed-coordination.html) | [32-distributed-coordination.md](../slides/32-distributed-coordination.md) |
| **EP33** | Reliability, SLOs & Load Shedding | [`33-reliability-overload.html`](33-reliability-overload.html) | [33-reliability-overload.md](../slides/33-reliability-overload.md) |
| **EP34** | Observability & Chaos Testing | [`34-observability-chaos.html`](34-observability-chaos.html) | [34-observability-chaos.md](../slides/34-observability-chaos.md) |
| **EP35** | Security, OAuth 2.1 & Rate Limiting | [`35-security-identity.html`](35-security-identity.html) | [35-security-identity.md](../slides/35-security-identity.md) |
| **EP36** | Cloud Infrastructure & Canary Rollouts | [`36-cloud-deployments.html`](36-cloud-deployments.html) | [36-cloud-deployments.md](../slides/36-cloud-deployments.md) |
| **EP37** | Multi-Region, DR & FinOps | [`37-multi-region-finops.html`](37-multi-region-finops.html) | [37-multi-region-finops.md](../slides/37-multi-region-finops.md) |
| **EP38** | Problem Decomposition & ADRs | [`38-problem-decomposition.html`](38-problem-decomposition.html) | [38-problem-decomposition.md](../slides/38-problem-decomposition.md) |
| **EP39** | Modern AI & High-Throughput Systems | [`39-ai-systems-architecture.html`](39-ai-systems-architecture.html) | [39-ai-systems-architecture.md](../slides/39-ai-systems-architecture.md) |
| **EP40** | System Evolution & Postmortems | [`40-system-evolution.html`](40-system-evolution.html) | [40-system-evolution.md](../slides/40-system-evolution.md) |

> Optional `.pdf` and `.pptx` static snapshots are generated in CI/build output rather than checked into Git as binary files.
