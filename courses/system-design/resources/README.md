# Curated Resource Library

A selected starting point for reliable learning material. Use the original course lessons as the guided path; use these resources to deepen or verify a topic.

**How to choose a source:** prefer standards, official documentation, course syllabi, research papers and engineering write-ups from the teams operating the systems. A blog post is a useful explanation, not automatically a universal rule. Some resources are books and may not be free; links are not permission to redistribute them.

## Foundational system design

| Resource | Best for | Notes |
|---|---|---|
| [System Design Primer](https://github.com/donnemartin/system-design-primer) | Broad topic map, trade-offs and practice prompts | Community-maintained reference; use as a map, not the only textbook |
| [System Design 101](https://github.com/ByteByteGoHq/system-design-101) | Short visual explainers | Quick visual revision; validate details against primary sources |
| [Azure Architecture Center](https://learn.microsoft.com/en-us/azure/architecture/) | Patterns and reference architectures | Vendor guidance; underlying patterns are broadly useful |
| [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/) | Reliability, security, operations, performance, cost and sustainability | Review framework and workload-specific lenses |

## Distributed systems and data

| Resource | Best for | Notes |
|---|---|---|
| [MIT 6.5840 Distributed Systems](https://pdos.csail.mit.edu/6.5840/) | Replication, fault tolerance, consistency and labs | Advanced course; prerequisites matter |
| [Designing Data-Intensive Applications](https://dataintensive.net/) | Data systems, replication, partitioning and stream processing | Martin Kleppmann; book, not a free full-text source |
| [Martin Kleppmann's publications](https://martin.kleppmann.com/) | Papers and technical writing | Read the actual paper for research claims |
| [Jepsen analyses](https://jepsen.io/analyses) | Real-world consistency and fault-testing results | Read the test model and limitations, not just the headline |
| [The Raft consensus paper](https://raft.github.io/raft.pdf) | Understandable consensus algorithm | Research paper and visualization links |

## Reliability and operations

| Resource | Best for |
|---|---|
| [Google SRE Book](https://sre.google/sre-book/table-of-contents/) | Reliability principles, SLOs, overload and incident response |
| [Google SRE Workbook](https://sre.google/workbook/table-of-contents/) | Practical reliability exercises and case studies |
| [Google SRE resources](https://sre.google/resources/) | Talks, workshops and non-abstract system design material |
| [AWS Reliability Pillar](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/) | Resilience, recovery and workload reliability |
| [OpenTelemetry documentation](https://opentelemetry.io/docs/) | Vendor-neutral traces, metrics and logs |

## Web and networking foundations

| Resource | Best for |
|---|---|
| [MDN HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP) | HTTP concepts and browser-facing behavior |
| [RFC 9110 · HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110) | HTTP standards |
| [RFC 8446 · TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446) | TLS standard |
| [RFC 9114 · HTTP/3](https://www.rfc-editor.org/rfc/rfc9114) | HTTP/3 standard |
| [Cloudflare Learning Center](https://www.cloudflare.com/learning/) | DNS, CDN, caching, TLS and network explainers |
| [Cloudflare Developer Docs](https://developers.cloudflare.com/) | Product docs and architecture details |

## Databases, caches and messaging

| Resource | Best for |
|---|---|
| [PostgreSQL documentation](https://www.postgresql.org/docs/current/) | Relational modeling, indexes, transactions and query plans |
| [Redis documentation](https://redis.io/docs/latest/) | Data structures, caching, persistence and clustering |
| [Apache Kafka documentation](https://kafka.apache.org/documentation/) | Event streaming, partitions, delivery and operations |
| [MongoDB documentation](https://www.mongodb.com/docs/manual/) | Document database concepts and operational model |
| [etcd documentation](https://etcd.io/docs/) | Distributed key-value store and coordination use cases |

## Security

| Resource | Best for |
|---|---|
| [OWASP Top 10](https://owasp.org/www-project-top-ten/) | Common application security risks |
| [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/) | Practical secure implementation guidance |
| [OAuth 2.0 Security BCP, RFC 9700](https://www.rfc-editor.org/rfc/rfc9700) | Current OAuth security guidance |

## Cloud, containers and architecture patterns

| Resource | Best for |
|---|---|
| [Kubernetes concepts](https://kubernetes.io/docs/concepts/) | Orchestration concepts and primitives |
| [Google Cloud Architecture Framework](https://cloud.google.com/architecture/framework) | Cloud architecture quality attributes |
| [Microsoft Cloud Design Patterns](https://learn.microsoft.com/en-us/azure/architecture/patterns/) | Pattern catalog with context and consequences |
| [C4 model](https://c4model.com/) | Communicating architecture at multiple levels |
| [Structurizr DSL](https://structurizr.com/dsl) | Version-controlled C4 diagrams |

## How to use this library

1. Start with the relevant course lesson.
2. Read one primary or official source.
3. Write the concept in your own words and draw a diagram.
4. Compare at least one alternative.
5. Add the exact source and the claim it supports to your notes.
6. Record when you checked version-sensitive documentation.
