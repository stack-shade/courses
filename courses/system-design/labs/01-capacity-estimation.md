# Lab 01 · Back-of-the-Envelope Capacity Estimation

**Goal:** turn a vague product prompt into rough, defensible capacity estimates. These numbers are teaching assumptions, not production requirements.

## Scenario

Design the first version of a link-shortening service. Assume:
- 5 million monthly active users.
- 20% are active on a typical day.
- Each daily active user creates 2 short links/day.
- Each daily active user follows 10 short links/day.
- Average original URL length is 500 bytes.
- Short code + metadata overhead is 300 bytes per record.
- Keep links for 3 years.
- Peak traffic is 5× average traffic.

## 1. Daily active users

`DAU = 5,000,000 × 0.20 = 1,000,000`

## 2. Writes per day

`1,000,000 × 2 = 2,000,000 creates/day`

Average create QPS: `2,000,000 ÷ 86,400 ≈ 23.1 writes/second`

Peak create QPS at 5×: `23.1 × 5 ≈ 116 writes/second`

## 3. Redirect reads

`1,000,000 × 10 = 10,000,000 redirects/day`

Average redirect QPS: `10,000,000 ÷ 86,400 ≈ 116 reads/second`

Peak redirect QPS at 5×: `116 × 5 ≈ 580 reads/second`

This is the simple average. A real launch, campaign or viral link can create a much higher hot-key burst.

## 4. Storage

Total records over 3 years: `2,000,000 × 365 × 3 = 2.19 billion records`

Raw estimate per record: `500 bytes + 300 bytes = 800 bytes`

Raw logical storage: `2.19B × 800 bytes ≈ 1.752 TB` (decimal, before indexes, replicas, backups and operational overhead).

This estimate is crude. Database page overhead, indexes, compression, replication, tombstones, backups and retention strategy change the real number. Separate logical bytes from provisioned capacity.

## 5. Bandwidth and cache impact

Assume the redirect response is 1 KB. At 580 peak reads/second, response egress is roughly 580 KB/s before protocol overhead. If 80% of redirects are served from an edge cache, origin lookups may drop substantially — but cacheability depends on destination mutability, TTL and invalidation requirements.

## 6. Architecture implications

- Redirects are read-heavy; cache hot links near users.
- Link creation needs collision-safe code generation and durable uniqueness.
- Abuse prevention is first-class: phishing checks, rate limits and takedown paths.
- Analytics can be asynchronous so redirect latency does not wait for event processing.
- Expiration and deletion need explicit semantics.

## Your tasks
- [ ] Change peak multiplier from 5× to 20×. Recalculate.
- [ ] Change retention from 3 years to 1 year. Recalculate storage.
- [ ] Assume 10% of links receive 90% of redirect traffic. Explain hot-key behavior.
- [ ] Add indexes and two replicas as separate capacity assumptions.
- [ ] Propose what should be cached and what must remain authoritative.
- [ ] List the three assumptions you would validate first with product analytics.

## Reflection

What would you measure before deciding to shard the database? What is the simplest architecture that meets the stated workload? What fails if the analytics queue is unavailable?

## Further reading
- [System Design Primer · Back-of-the-envelope calculations](https://github.com/donnemartin/system-design-primer).
- [Google SRE · Handling Overload](https://sre.google/sre-book/handling-overload/).
