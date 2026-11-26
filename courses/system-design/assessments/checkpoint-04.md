# Assessment 04 · Distributed Failure, Consistency & Coordination

**Modules covered:** Module 06 (L28–L32)
**Level:** Advanced
**Time:** 45–60 minutes

## Questions

1. A service chain is 3 hops deep (`Gateway -> Order -> Inventory -> DB`), and each service configures `3` retries with a `5 s` timeout. Calculate the worst-case amplification factor on the DB during a brownout and explain why Full Jitter + a `10%` retry budget breaks the feedback loop.
2. Why can `System.currentTimeMillis()` (wall-clock NTP time) move backward or jump forward by several seconds, and how does Google Spanner's TrueTime uncertainty interval `[earliest, latest]` (`2ε`) solve external consistency without zero-skew clocks?
3. Two workers use a Redis `SET lock_key val NX PX 10000` lease to write exclusively to an object store. Worker A acquires the lock, hits a `15 s` stop-the-world GC pause, and wakes up while Worker B now holds the lock. Explain why `DEL` checks do not prevent Worker A from corrupting storage, and show how monotonic fencing tokens fix the race.
4. For a Dynamo-style quorum store with `N = 5` replicas:
   - What happens to consistency and availability if `W = 3, R = 3` vs. `W = 2, R = 2` vs. `W = 5, R = 1`?
   - Under `W = 3, R = 3`, how many simultaneous node failures can writes tolerate, and why can stale reads still happen during a **sloppy quorum** + hinted handoff?
5. State the CAP theorem accurately without the common "pick 2 of 3" myth. Using PACELC, classify a single-region Raft cluster (`etcd`), a Dynamo-style eventually consistent store (`Cassandra` at `ONE/ONE`), and a globally distributed linearizable DB (`Spanner`).
6. In Raft, why must a candidate's log be "at least as up-to-date" as a majority of followers to win an election, and why does a leader only commit log entries from its **current** term by counting replicas (rather than directly committing old-term entries)?
7. Why should you never route high-throughput application business traffic (`50,000 QPS` user profile reads) through `etcd` or ZooKeeper, even though they provide strong linearizable consistency?

## Practical task

**Scenario:** You are designing a **Distributed Cron / Job Scheduler** that triggers billing jobs once per hour across `50` worker nodes.
1. Draw the coordination architecture showing how workers elect a leader or claim job leases via `etcd` (with TTL leases) and write job outputs to an idempotent PostgreSQL ledger.
2. Trace what happens if the elected scheduler leader loses network connectivity to `etcd` for `12 s` while its lease TTL is `10 s`, and a second node becomes leader.
3. Specify the exact fencing token + database `UNIQUE` / conditional `UPDATE ... WHERE fencing_token < $new` mechanism that prevents duplicate billing charges.

## Scoring rubric

| Criterion | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Understanding | Missing | Partial | Correct | Precise |
| Application | No attempt | Weak fit | Sound fit | Defends alternatives |
| Reasoning | No rationale | Limited | Clear | Evidence and trade-offs |

Score every question `0–3` using the [readiness rubric](../roadmap.md#readiness-rubric). Revisit any lesson where you score `0` or `1`.

## Answer guide

<details><summary>Reveal hints</summary>

1. **Amplification:** `4 × 4 × 4 = 64×` worst-case load on the DB (`(1 + 3)^3`). Full Jitter (`rand(0, min(cap, base * 2^attempt))`) spreads retry spikes uniformly instead of creating synchronized waves; a `10%` retry budget caps total extra traffic even during prolonged outages; circuit breakers fail fast (`Open`) so threads don't block for `5 s`.
2. **Clocks:** NTP steps/slews clocks and leap seconds cause non-monotonic jumps; use `CLOCK_MONOTONIC` for durations. TrueTime bounds clock uncertainty `ε` (e.g., `1–7 ms`) and performs a **commit wait** (`wait 2ε`) before releasing locks/returning so any causally later transaction is guaranteed to get a strictly larger timestamp.
3. **Fencing:** Worker A already passed the lock check *before* its `15 s` GC pause and sends its write directly to storage after the lease expired. Storage itself must reject writes whose monotonically increasing `fencing_token` (issued by the lock service on grant) is `<= last_seen_token`.
4. **Quorums:** `W=3, R=3` satisfies `R + W = 6 > 5` (strict overlap of `>= 1` replica), tolerating `2` node failures for both reads and writes. `W=2, R=2` (`4 <= 5`) allows stale reads. `W=5, R=1` gives fast reads (`1` node) but fails writes if even `1` replica is down. Sloppy quorums write to non-owner fallback nodes during partitions, breaking overlap with the canonical `N` replicas.
5. **CAP / PACELC:** Partitions (`P`) are a reality of distributed networks, so during `P` you choose `C` (linearizability) or `A` (every non-failing node responds). Under PACELC: `etcd` is `PC/EC`; `Cassandra (ONE/ONE)` is `PA/EL`; `Spanner` is `PC/EC` (pays cross-DC commit-wait/quorum latency).
6. **Raft:** The `RequestVote` log up-to-dateness check (comparing last log term, then index) ensures any newly elected leader already holds all previously committed entries. Counting replicas only for current-term entries (Figure 8 of the Raft paper) prevents an old-term entry from being overwritten after partial replication.
7. **Coordination stores:** Consensus stores serialize all writes through a single Raft leader and `fsync` quorum disk logs (`~1,000–10,000 writes/s` ceiling, high sensitivity to payload size and watcher fan-out). Keep only small metadata, leases, and service discovery there; keep business data in sharded OLTP/KV stores.

</details>
