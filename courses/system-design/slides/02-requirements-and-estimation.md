---
marp: true
theme: dark
paginate: true
size: 16:9
slug: 02-requirements-and-estimation
lesson: ../lessons/02-requirements-and-capacity.md
title: Requirements and Capacity Estimation
description: A first-principles system design module
style: |
  section { background: #10141d; color: #e6edf3; font-family: Arial, sans-serif; padding: 58px; }
  h1, h2 { color: #a3e635; }
  strong { color: #d9f99d; }
  table { font-size: 0.78em; }
---

# Requirements & Capacity

## Turn an ambiguous prompt into numbers

StackShade · System Design

---

# 1. Requirements before architecture

**Functional:** what must the product do?

**Non-functional:** how well must it do it?

**Constraints:** what limits the solution?

Don't confuse "use Redis" with a requirement.

---

# 2. Make quality measurable

| Attribute | Example question |
|---|---|
| Latency | p95 under what threshold? |
| Availability | What counts as usable? |
| Durability | Which failures must data survive? |
| Consistency | What can a user observe after a write? |
| Security | Who can access which data? |
| Cost | What is the operating budget? |

Targets need a workload, scope and measurement window.

---

# Interactive Tail Latency Explorer (p95 / p99)

<!-- anim: anim-tail-latency -->

<!-- note: Drag the Slow Requests % slider live to show why average latency hides p99 pain. -->

---

# 3. Estimate average QPS

Assume:
- 2 million DAU
- 30 requests per user per day

Daily requests = 2,000,000 × 30 = **60 million**

Average QPS = 60,000,000 ÷ 86,400 ≈ **694**

---

# 4. Estimate peak QPS

Assume a 4× peak multiplier.

Peak QPS ≈ 694 × 4 = **2,776**

This is a planning assumption, not a universal constant.

Real traffic is bursty and skewed. Validate with telemetry when available.

---

# 5. Estimate storage

100,000 objects/day × 2 MB each

= **200 GB/day** raw growth

× 365 days ≈ **73 TB/year**

Then account for indexes, replicas, backups, derived data, retention and compression.

---

# 6. Estimate bandwidth

2,000 requests/s × 40 KB response

≈ 80 MB/s ≈ 640 Mbps

Calculate upload and download separately. A CDN shifts origin traffic; it does not make bandwidth free.

---

# 7. Write your assumptions

| Input | Value | Confidence |
|---|---:|---|
| DAU | 2 million | Hypothetical |
| Requests/user/day | 30 | Hypothetical |
| Peak multiplier | 4× | Validate |
| Response size | 40 KB | Measure |
| Retention | 1 year | Product decision |

Which assumption has the biggest impact?

---

# 8. What comes next?

- Read/write ratio
- Hot users and hot keys
- Geographic distribution
- Data retention and deletion
- Queueing and asynchronous work
- Recovery objectives
- Cost per request / per stored GB

---

# Exercise

Change peak traffic to 20×.

Recalculate peak QPS. Identify the likely bottleneck and explain what you would measure before scaling.

**Practice:** [Capacity Estimation Lab](../labs/01-capacity-estimation.md)
