# 02 · Requirements and Capacity

**Level:** Beginner · **Status:** First draft · **Prerequisite:** [Thinking in systems](01-thinking-in-systems.md)

## Learning objectives
- Turn an open-ended prompt into explicit functional and non-functional requirements.
- Identify workload shape: users, read/write mix, peak traffic, payload sizes and growth.
- Calculate average and peak request rates, rough storage and bandwidth.
- State assumptions and identify which estimate matters most.

## 1. Functional requirements

Functional requirements describe user-visible behavior. For a photo-sharing product: users can upload a photo, follow accounts, view a feed, like or comment on a post.

Define scope carefully. "Build Instagram" is not a useful first requirement set. Pick the core user journey and make exclusions explicit.

## 2. Non-functional requirements (NFRs)

NFRs describe how well the system must behave:
- **Latency:** how long a request takes, often described with p50, p95 and p99.
- **Availability:** proportion of time the service is usable.
- **Durability:** likelihood that acknowledged data is not lost.
- **Consistency:** what users can observe after a write.
- **Scalability:** how capacity changes as demand grows.
- **Security and privacy:** who can access which data and under what conditions.
- **Cost:** infrastructure and operational budget.

Do not write "fast, scalable, secure". Make targets measurable, and state the scope and measurement window.

Example: "For the first release, 95% of feed-read requests should complete under 250 ms at 2,000 requests/second in the primary region, excluding client network time." This is a hypothetical target, not a universal benchmark.

## 3. Estimate traffic

Suppose a service has 2 million daily active users. Assume each active user makes 30 API requests per day.

- Daily requests = 2,000,000 × 30 = 60,000,000.
- Average requests/second = 60,000,000 ÷ 86,400 ≈ 694.
- If peak is 4× the daily average, peak ≈ 2,776 requests/second.

This is a starting estimate. Real traffic is bursty, and the multiplier must be justified from product behavior or measurement.

## 4. Estimate storage

Suppose 100,000 new objects are uploaded daily, each averaging 2 MB.
- Raw growth/day = 100,000 × 2 MB = 200,000 MB ≈ 200 GB/day (decimal units).
- Raw growth/year ≈ 73 TB/year.
- Replicas, backups, metadata, thumbnails and retention policies increase the actual footprint.

Always state whether you use decimal GB/TB or binary GiB/TiB. Ask how much data is deleted, compressed, deduplicated or retained.

## 5. Estimate bandwidth

If 2,000 peak requests/second each return an average 40 KB response:
- Egress ≈ 2,000 × 40 KB = 80 MB/s.
- That is roughly 640 Mbps before protocol overhead and traffic variation.

For media products, calculate upload and download traffic separately. A CDN may shift origin traffic, but it does not make egress disappear.

## 6. Build an assumptions table

| Variable | Example assumption | Why it matters |
|---|---:|---|
| Daily active users | 2 million | Demand baseline |
| Requests / active user / day | 30 | Daily request volume |
| Peak multiplier | 4× | Capacity headroom |
| Average response size | 40 KB | Network egress |
| New objects / day | 100,000 | Storage growth |
| Average object size | 2 MB | Storage and bandwidth |

An estimate is only as good as the assumptions. Prioritize validating the variables that dominate cost or capacity.

## 7. What to ask next
- What is the read/write ratio?
- Are requests evenly distributed or concentrated in bursts?
- What is the hot-key or hot-user distribution?
- How long is data retained?
- What is the regional distribution?
- Are operations synchronous or asynchronous?
- Which workload is latency-sensitive?
- What are the recovery objectives after data loss or regional failure?

## Retrieval practice
1. Convert 10 million requests/day to average QPS.
2. Why is average QPS insufficient for capacity planning?
3. What is the difference between p95 latency and average latency?
4. Which assumptions dominate storage cost in the example above?

<details><summary>Hints</summary>
1. 10,000,000 ÷ 86,400 ≈ 116 requests/second.
2. Peaks, bursts, skew and correlated events can be much higher than average.
3. p95 is the value at or below which 95% of observations fall; the average can hide slow tails.
4. Daily object count, average size, retention, replicas and derived copies.
</details>

## Sources
- [Google SRE Book: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/) — setting measurable reliability expectations.
- [Google SRE Workbook](https://sre.google/workbook/table-of-contents/) — practical reliability exercises.
- [System Design Primer](https://github.com/donnemartin/system-design-primer) — sizing and scalability concepts.

## Next
Continue to [03 · The web request](03-the-web-request.md).
