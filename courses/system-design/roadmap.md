# The Roadmap

A staged path from zero system-design vocabulary to production-grade design reasoning. Treat durations as a guide, not a deadline. The important output is evidence that you can apply each idea.

## Stage 0 · Learn how to learn
- [ ] Set up notes, a diagram tool and a local playground.
- [ ] Learn the design loop: requirements → estimates → architecture → deep dives → risks → evolution.
- [ ] Explain the architecture of a familiar app in one page.

## Stage 1 · Foundations (beginner)
1. [ ] System-design thinking and constraints — [lesson](lessons/01-thinking-in-systems.md)
2. [ ] Functional requirements, NFRs and quality attributes — [lesson](lessons/02-requirements-and-capacity.md)
3. [ ] Back-of-the-envelope estimation — [lab](labs/01-capacity-estimation.md)
4. [ ] Internet fundamentals: DNS, TCP, TLS, HTTP, proxies and CDNs — [lesson](lessons/03-the-web-request.md)
5. [ ] API design: REST, RPC, pagination, idempotency and versioning.
6. [ ] Database basics: relational vs document vs key-value; schemas and transactions.
7. [ ] Indexes and storage: B-trees, LSM trees, WAL, query plans and object storage.

**Stage project:** design a URL shortener at a modest, explicitly stated traffic level.

## Stage 2 · Building blocks and scaling (intermediate)
8. [ ] Caching: cache-aside, write-through, TTL, eviction and invalidation.
9. [ ] Traffic distribution: reverse proxies, load balancing, health checks and autoscaling.
10. [ ] Stateless services, sessions, connection pools and concurrency.
11. [ ] Asynchronous systems: queues, streams, workers, retries and dead-letter queues.
12. [ ] Data scaling: replication, partitioning, sharding and rebalancing.
13. [ ] Search, object storage, media delivery and CDN design.
14. [ ] Security: identity, authentication, authorization, secrets, encryption and abuse controls.

**Stage project:** design a notification service and a social-feed read path; explain the read/write trade-off.

## Stage 3 · Distributed systems and reliability (advanced)
15. [ ] Failure models, timeouts, retries, backoff, jitter and circuit breakers.
16. [ ] Consistency models, quorum reads/writes, replication lag and conflict resolution.
17. [ ] Consensus, leader election, leases, clocks and coordination.
18. [ ] Event-driven design, transactional outbox, sagas, CQRS and event sourcing.
19. [ ] Observability: logs, metrics, traces, SLIs, SLOs, error budgets and incident response.
20. [ ] Resilience: bulkheads, load shedding, backpressure, chaos testing, backup and disaster recovery.
21. [ ] Multi-region architecture, data residency, latency and cost trade-offs.

**Stage project:** design a multi-region chat or collaboration product. Demonstrate what happens during a region or dependency outage.

## Stage 4 · Architecture mastery (capstone)
22. [ ] Decompose ambiguous product prompts into requirements and measurable constraints.
23. [ ] Compare at least two architectures and explain why one is selected.
24. [ ] Deep-dive into the most consequential component and its bottleneck.
25. [ ] Design rollout, migration, observability, security and operations.
26. [ ] Present an architecture review and defend trade-offs.

**Capstone:** choose a real product, write a design doc, create diagrams and ADRs, implement a small vertical slice, load-test it, inject a failure, and publish a postmortem.

## A repeatable weekly cycle

| Session | Activity | Evidence |
|---|---|---|
| 1 | Read and take structured notes | One-page concept summary |
| 2 | Active recall without notes | Questions you could not answer |
| 3 | Draw the system | Diagram + written explanation |
| 4 | Build a small experiment | Code, config or benchmark |
| 5 | Break and measure it | Results and failure observations |
| 6 | Teach it back | Short write-up or slide deck |

## Readiness rubric

Score each topic from 0–3:
- **0 — Unfamiliar:** cannot explain the term.
- **1 — Explain:** can define it and draw a basic model.
- **2 — Apply:** can select it for a scenario and discuss trade-offs.
- **3 — Defend:** can estimate, test, identify failure modes and explain alternatives.

Move forward when core concepts reach 2. Revisit level-3 topics during case studies.
