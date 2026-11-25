# System Design Document Template

> Copy this file for a case study. Replace every prompt; delete irrelevant sections with a reason.

## 1. Executive summary
What are we building? Who is it for? What is the proposed design in 3–5 sentences?

## 2. Requirements

### Functional
- 

### Non-functional (measurable)
| Attribute | Target | Scope / measurement |
|---|---|---|
| Latency | | |
| Availability | | |
| Durability | | |
| Consistency | | |
| Security / privacy | | |
| Cost | | |

### Out of scope
- 

## 3. Assumptions and estimates

| Input | Assumption | Confidence | How to validate |
|---|---:|---|---|
| DAU / MAU | | | |
| Read/write ratio | | | |
| Average / peak QPS | | | |
| Payload size | | | |
| Retention and growth | | | |
| Geographic distribution | | | |

Show calculations, units and whether values are decimal or binary.

## 4. API and data model
Document endpoint/event contracts, idempotency, pagination, validation and versioning. Show entities, keys, indexes, constraints and ownership.

## 5. High-level architecture
Insert a diagram and explain each component. Label synchronous and asynchronous paths, data stores, trust boundaries and failure domains.

## 6. Deep dives
Choose components that dominate latency, scale, correctness, availability, security or cost. Explain alternatives and why the selected design fits.

## 7. Consistency and failure semantics
What does the caller observe after a write? What if a request is retried? What if a dependency is slow, unavailable or returns an ambiguous result?

## 8. Security and privacy
Threat model, authentication, authorization, secrets, encryption, data retention, abuse prevention and auditability.

## 9. Reliability and operations
SLIs/SLOs, dashboards, alerts, capacity signals, deployment strategy, rollback, backups, disaster recovery and incident ownership.

## 10. Cost and evolution
Largest cost drivers, expected growth, scaling thresholds, migration path and what would trigger a redesign.

## 11. Alternatives considered
| Option | Benefits | Costs / risks | Why selected or rejected |
|---|---|---|---|
| | | | |

## 12. Open questions
- 

## 13. Sources
Link primary documentation, papers, books or engineering posts. Add the date checked if the source is likely to change.
