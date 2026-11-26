# Project 04 · Course Capstone: Production Architecture, Vertical Slice & Defense

**Level:** Advanced / Staff (Module 08 Capstone)
**Status:** Draft

---

## Problem and motivation

Reading diagrams and watching lectures builds vocabulary; **owning an ambiguous problem from blank page to load-tested vertical slice, injected outage, cost model, and recorded architecture review** builds staff-level engineering judgment.

This Capstone synthesizes **all 9 Modules (`L01–L40`)**—following the 4-phase decomposition framework from [Lesson 38](../../lessons/38-problem-decomposition.md), modern workload considerations from [Lesson 39](../../lessons/39-ai-systems-architecture.md), and evolutionary safety + blameless postmortems from [Lesson 40](../../lessons/40-system-evolution.md).

---

## Learning outcomes

By completing this capstone, you should be able to:
- Author a production-grade System Design Document ([templates/system-design.md](../../templates/system-design.md)) from an open-ended prompt.
- Defend irreversible architectural bets with high-signal ADRs ([templates/adr.md](../../templates/adr.md)).
- Build and instrument a working **vertical slice** demonstrating your system's hardest bottleneck or correctness invariant.
- Execute a quantitative **load benchmark** (`k6` / `vegeta`) and a **controlled failure drill** resulting in an honest, blameless postmortem.
- Deliver a crisp **15-minute recorded architecture review** grounded in measured evidence rather than hand-waving.

---

## Scope

Choose **one** of the 16 Case Studies (ideally one of `07–16`, such as [Case Study 10 · Ride-Hailing](../../case-studies/10-ride-hailing.md), [Case Study 12 · Payment Ledger](../../case-studies/12-payment-ledger.md), [Case Study 13 · Ticket Booking](../../case-studies/13-ticket-booking.md), [Case Study 14 · Metrics Pipeline](../../case-studies/14-metrics-pipeline.md), or [Case Study 15 · Job Scheduler](../../case-studies/15-job-scheduler.md)), OR propose an **AI/RAG Gateway system** applying Lesson 39.

### Included
1. **Complete System Design Document** (`docs/design.md` using [system-design.md](../../templates/system-design.md))
2. **2+ Architecture Decision Records** (`docs/adr-001.md`, `docs/adr-002.md` using [adr.md](../../templates/adr.md))
3. **Working Vertical Slice** (`src/` + `docker-compose.yml`) proving the system's **critical path & hardest invariant** (e.g., double-entry serializable ledger transfer, seat-hold TTL lock under flash contention, or fencing-token job lease)
4. **Load Benchmark (`k6`)** proving `p50`/`p95`/`p99`, throughput, and saturation knee
5. **Failure Injection Drill + Blameless Postmortem** (`docs/postmortem.md`)
6. **FinOps Cost Model** (compute, storage, egress, and managed services per `1M` user actions)
7. **15-Minute Architecture Review Recording / Slide Deck**

### Excluded
- Building 100% of secondary CRUD UI screens, marketing pages, or billing admin dashboards
- Multi-cloud production Terraform deployments (local Docker Compose / single test cluster with realistic latency/resource limits is expected)

---

## Requirements and constraints

- **Measurable SLOs:** Every critical user journey has explicit `p95`, `p99`, availability, durability, and consistency targets.
- **Explicit units:** All capacity math specifies `QPS`, `MB/s` vs `Mbps`, decimal `GB/TB` vs binary `GiB/TiB`, and replication/index multipliers.
- **Reproducible verification:** Anyone cloning your capstone repo can run `docker compose up` and reproduce your `k6` load test and failure drill with documented commands.
- **Honest evidence:** Report real observed bottlenecks, failed assumptions, and actual limits from your benchmark—never invent numbers.

---

## Milestones

| Milestone | Deliverable | Definition of done |
|---|---|---|
| **1. Decomposition & Design Doc** | `docs/design.md` + `docs/adr-001.md` + `docs/adr-002.md` + Cost Model | Peer/self-reviewed against [Lesson 38](../../lessons/38-problem-decomposition.md) 4-phase checklist; explicit v1 exclusions & NFRs |
| **2. Vertical Slice & Invariant Tests** | Runnable core service + data store + automated correctness tests | Hardest invariant (e.g., zero double-bookings under 200 concurrent threads) passes deterministically |
| **3. Load Benchmark & Failure Drill** | `k6` scripts + metrics report + injected fault + `docs/postmortem.md` | Saturation knee found; chaos fault injected (`kill -9`, packet loss, or DB lock); postmortem has concrete action items |
| **4. 15-Min Architecture Review** | `10–12` slide deck + recorded walkthrough (or live peer review) | Covers problem, math, core architecture, live demo/benchmark numbers, failure drill, and `10×` evolution plan |

---

## Architecture and design

Your `docs/design.md` must include at minimum:
1. **Context diagram** showing external actors, edge/gateway, compute, durable stores, async queues, and trust boundaries.
2. **Detailed sequence diagram** of the highest-risk write path (including retries, idempotency keys, and failure branches).
3. **Schema / data model** with exact primary keys, partitioning keys, secondary indexes, and isolation/consistency assumptions.
4. **Evolution path** (`v1 → 10× → 100×`) applying modular boundaries or Strangler Fig extraction from [Lesson 40](../../lessons/40-system-evolution.md).

---

## Implementation

Keep the vertical slice focused—**depth on the critical path beats breadth across 10 trivial endpoints**:
- **Example A (Ticket Booking):** Seat inventory table + atomic conditional `UPDATE` / Redis Lua hold + background TTL expiry + `k6` script hammering 1 hot concert event (`1,000` VUs competing for `50` seats).
- **Example B (Payment Ledger):** Idempotent `POST /transfers` + double-entry `ledger_entries` with serializable/row-locked accounts + outbox event + crash-during-commit chaos test.
- **Example C (AI RAG Gateway):** Token-bucket TPM limiter + hybrid BM25/vector search with pre-filter ACLs + SSE mock/local-LLM streaming + `TTFT`/`ITL` load harness.

---

## Testing and evaluation

| Check | What to prove |
|---|---|
| **Correctness invariant** | Automated concurrency/race test verifying zero corrupted state under contention |
| **Load & tail latency** | `k6` ramp test showing `p50/p95/p99` and identifying which resource (`CPU`, `DB IOPS`, `Pool`, `VRAM`) saturates first |
| **Graceful overload** | Enabling rate limits / load shedding preserves `p99` for admitted requests when offered load hits `150%` capacity |
| **Failure drill** | Kill cache, inject `300 ms` DB latency, or drop worker mid-flight; record `RTO`, `RPO`, and recovery behavior |

---

## Demo and documentation

- [ ] `README.md` with quickstart, architecture overview, and reproduction commands.
- [ ] `docs/design.md` ([templates/system-design.md](../../templates/system-design.md)).
- [ ] `docs/adr-001.md` and `docs/adr-002.md` ([templates/adr.md](../../templates/adr.md)).
- [ ] `docs/cost-model.md` (unit economics per `1M` requests / active tenant).
- [ ] `docs/postmortem.md` from your injected failure drill.
- [ ] `benchmarks/` with raw `k6` summary & latency charts/tables.
- [ ] `15-minute` presentation slides + recording link (or structured defense notes).

---

## Reflection

1. Which original assumption in your Milestone 1 capacity math proved wrong once you ran the `k6` load test?
2. What was the **single biggest simplification** in your vertical slice, and how would you close that gap before serving real production users?
3. If a `10×` traffic wave arrived next month, which of your two ADRs would you revisit first, and how would you migrate without downtime?
