# Assessment 05 · Reliability, Security, Observability & Cloud Operations

**Modules covered:** Module 07 (L33–L37)
**Level:** Advanced
**Time:** 45–60 minutes

## Questions

1. A service has an availability SLO of `99.95%` over a 30-day rolling window.
   - Calculate its exact monthly error budget in minutes (`30 × 24 × 60 = 43,200 min`).
   - Design a multi-window burn-rate alert (`2%` budget consumed in `1 h` vs `5%` in `6 h`) and explain why alerting on `CPU > 80%` is an inferior paging signal.
2. Explain **Little's Law** (`L = λW`) during overload. Why does an unbounded FIFO queue collapse useful goodput to near zero once arrival rate `λ` exceeds service capacity `μ`, and how do **bounded queues + LIFO + priority load shedding** restore goodput?
3. You notice a Prometheus time-series database OOM-crashing after a developer adds `user_id` and `request_id` as labels on `http_request_duration_seconds`. Explain the **high-cardinality** problem and which observability signal (metrics, structured logs, or distributed traces) should hold `user_id` and `trace_id` instead.
4. Trace the **OAuth 2.1 Authorization Code + PKCE (`S256`)** flow across trust boundaries. Why is PKCE mandatory even for confidential clients (RFC 9700), and when should you choose **opaque reference tokens + introspection** over self-contained **JWTs**?
5. Compare **RBAC**, **ABAC**, and **ReBAC (Google Zanzibar)** for an enterprise document platform where users can belong to nested teams and share individual folders with external guests.
6. Contrast **Blue/Green** vs. **Progressive Canary** deployments for a stateful service undergoing a backward-incompatible database column rename. Why must schema changes follow **Expand-Contract** before any canary traffic shift?
7. A product claims `RPO = 0` and `RTO < 30 s` across `US-East` and `EU-West` (`80 ms` RTT), while also demanding `< 15 ms p95` write latency for all users. Prove why those three requirements conflict simultaneously and propose a realistic architecture trade-off.

## Practical task

**Scenario (Stage 3 Prep):** Design the reliability, security, and multi-region operations plan for a **Multi-Region Chat & Presence System** (`10M` DAU, `5,000 writes/s`).
1. Define 2 measurable SLIs/SLOs (message delivery latency and availability) and an overload shedding order (`typing indicators` -> `read receipts` -> `message send`).
2. Specify the edge security & abuse controls (OAuth 2.1 + mTLS internal mesh + per-user Token Bucket rate limiter).
3. Draw the failover procedure when `US-East` fails completely, stating expected `RPO`, `RTO`, and monthly cross-region replication egress cost (`500 B` average message).

## Scoring rubric

| Criterion | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Understanding | Missing | Partial | Correct | Precise |
| Application | No attempt | Weak fit | Sound fit | Defends alternatives |
| Reasoning | No rationale | Limited | Clear | Evidence and trade-offs |

Score every question `0–3` using the [readiness rubric](../roadmap.md#readiness-rubric). Revisit any lesson where you score `0` or `1`.

## Answer guide

<details><summary>Reveal hints</summary>

1. **Error budget:** `100% - 99.95% = 0.05% = 0.0005`. `43,200 min × 0.0005 = 21.6 minutes/month`. Multi-window burn-rate alerts detect fast outages (`14.4×` burn rate over `1h` + `5m` short window to confirm it's still firing) without paging on brief noise or non-user-impacting CPU spikes.
2. **Overload:** As queue depth `L` grows unboundedly, wait time `W = L / λ` exceeds client deadlines (`e.g., 1 s`). Every request finishes *after* the client already disconnected, wasting `100%` of server work. Bounded queues fail fast (`503`), LIFO serves the freshest non-expired requests first, and priority shedding protects revenue/critical endpoints.
3. **Cardinality:** Metrics index every unique `(metric_name, label_set)` pair in memory. `1M` users × `10` endpoints × `12` histogram buckets = `120M` series! Put low-cardinality dimensions (`service`, `route_template`, `status_class`) in metrics; put `user_id`, `request_id`, and `trace_id` in structured logs and OpenTelemetry trace spans (with tail/head sampling and exemplars).
4. **OAuth 2.1 / Tokens:** PKCE prevents authorization code injection/interception even if a client secret is absent or leaked. Choose opaque tokens (with Redis/Auth introspection) when instant revocation (logout/compromise) within milliseconds is mandatory; choose short-lived (`5 min`) JWTs + rotating refresh tokens to avoid Auth Server lookup on every API call.
5. **Authorization:** RBAC (`admin`, `editor`) cannot model per-folder sharing without role explosion. ReBAC (relationship tuples like `doc:42#viewer@group:eng#member`) models hierarchical, per-resource permissions natively with graph evaluation and Leopard/Zanzibar caching.
6. **Deployments:** During a canary (`5%` v2, `95%` v1) or blue/green instant rollback, v1 and v2 run concurrently against the *same* database. Dropping/renaming a column breaks v1. Expand-Contract adds the new column, dual-writes, backfills, deploys v2, and only drops the old column after rollback is no longer needed.
7. **Multi-region physics:** `RPO = 0` across regions requires synchronous cross-region consensus/replication (`>= 1` RTT = `80 ms` minimum + commit overhead), making `< 15 ms` global write latency physically impossible (`c` in fiber). Fix by either: (a) homing each user/tenant to a primary region (`RPO = 0` inside local multi-AZ cluster, `< 15 ms` local writes, async cross-region DR with `RPO ~ 1-5 s`), or (b) accepting `~90-150 ms` writes for strictly global `RPO = 0` financial state.

</details>
