# Lab 14 · Multi-Region Failover Drill, RPO/RTO & FinOps Audit

**Goal:** design and simulate a primary-region blackout failover, measure actual `RPO` (data loss window) and `RTO` (recovery time) under DNS TTL + health-check delays, and calculate the monthly FinOps cost of Active-Passive vs. Active-Active replication.
**Level:** Advanced
**Estimated effort:** 60–90 minutes

## Scenario and setup

Your **Global Chat & Presence Platform** serves `10M` DAU across `US-East` (`60%` of users) and `EU-West` (`40%` of users), averaging `5,000 write req/s` (`500 bytes/msg`) and `25,000 read req/s` (`2 KB/resp`). The product SLA requires **`RPO <= 5 s`** and **`RTO <= 120 s`**, plus GDPR data residency keeping EU user PII in `EU-West`. At `t = 60 s`, `US-East` suffers a complete regional control-plane and database outage.

**Prerequisites & tools:**
- Local simulator or spreadsheet/Python script to model DNS TTL caching, health-check failure thresholds, replication lag, and cloud egress/storage pricing.
- Optional: two local Docker/process instances simulating `Region-A` and `Region-B` behind a local health-checking proxy (e.g., Envoy/HAProxy/Nginx or Python proxy) on `127.0.0.1`.
- Safety note: Do not spin up paid multi-region cloud clusters unless explicitly budgeted; model and simulate locally first.

## Starting assumptions

| Input | Value | How to validate |
|---|---:|---|
| Global write rate | `5,000 writes/s` (`500 B` payload = `2.5 MB/s`) | Capacity spec |
| Cross-region RTT (`US-East ↔ EU-West`) | `80 ms` | Ping / cloud region matrix |
| Async replication lag (steady state) | `1.5 s` (`7,500` in-flight writes = `3.75 MB`) | Replica lag metric |
| DNS TTL + Health-check threshold | `TTL = 60 s`, `3 × 10 s` failed probes (`30 s`) | DNS & health-check config |
| Cross-region egress price (hypothetical cloud rate) | `$0.02 / GB` cross-region transfer, `$0.09 / GB` internet egress | Pricing assumption table |

## Tasks

- [ ] **Task 1 — Simulate a Region-A blackout and measure RTO:** Build a local two-endpoint failover simulation (or Python discrete-event trace) with `health_check_interval = 10 s`, `unhealthy_threshold = 3`, `DNS TTL = 60 s`, and `DB replica promotion = 25 s`. Plot the timeline from `t = 60 s` (outage start) until `99%` of clients reach `Region-B` and writes resume. Identify the dominant contributor to `RTO`.
- [ ] **Task 2 — Quantify RPO and split-brain risk:** Calculate the exact number of acknowledged writes lost if `Region-A` goes dark instantaneously with `1.5 s` async replication lag at `5,000 writes/s`. Then model what happens if `Region-A` returns after `10 minutes` without fencing old writes (split-brain conflict resolution).
- [ ] **Task 3 — Tune failover levers to hit `RTO <= 120 s`:** Compare (a) Geo-DNS (`TTL = 60 s` vs `TTL = 10 s` + sticky resolver caveats) vs (b) Anycast edge proxy (`Cloudflare` / `Global Accelerator` health-checked origin pools shifting in `10 s`).
- [ ] **Task 4 — Build a FinOps cost model (Active-Passive vs Active-Active):** Using the workload above (`30 days/month`), compute monthly cross-region replication egress (`GB/month` and `$`), compute baseline (`2×` headroom in Active-Active vs warm standby in Active-Passive), and cost per `1M` requests.

## Expected evidence

- Annotated failover timeline (`t = 60 s` to full recovery) showing Health Check detection, Promotion, DNS TTL decay, and Client reconnection surge.
- Explicit calculations with units for:
  - Steady-state `RPO` (seconds and lost messages)
  - Worst-case `RTO` (`s`) under DNS vs Anycast
  - Monthly cross-region replication GB and `$` (showing `2.5 MB/s × 86,400 s × 30 d` and replication multiplier).
- Architecture note explaining how GDPR EU-residency is preserved during a `US-East` vs `EU-West` failover.

## Reflection

1. What did you expect `RTO` to be when configuring a `60 s` DNS TTL?
2. What actually delayed client recovery beyond `TTL + health_check` (hint: client DNS cache behavior, connection pooling, cold cache thundering herd in the surviving region)?
3. Which assumption about "Active-Active gives zero RPO" is false when cross-region replication is asynchronous?
4. What would you change at 10× scale (`50,000 writes/s`, `25 MB/s` cross-region replication)?

## Cleanup

Stop any local proxy/container instances (`docker compose down` if used) and confirm zero cloud resources were provisioned.

## References

- [Lesson 37 · Multi-Region Architecture, Disaster Recovery & FinOps](../lessons/37-multi-region-finops.md)
- [AWS Whitepaper · Multi-Region Fundamentals](https://docs.aws.amazon.com/whitepapers/latest/aws-multi-region-fundamentals/aws-multi-region-fundamentals.html)
- [Google SRE Book · Data Integrity & Disaster Recovery](https://sre.google/sre-book/data-integrity/)
