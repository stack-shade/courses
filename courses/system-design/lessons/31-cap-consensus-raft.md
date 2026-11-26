---
id: "31"
module: "06"
title: "CAP, PACELC & Consensus Algorithms (Raft / Paxos)"
level: "Advanced"
status: "draft"
durationMinutes: 30
prerequisites:
  - "L30 · Consistency Models, Quorums (R + W > N) & CRDTs"
objectives:
  - "State the CAP theorem accurately and apply PACELC to classify real databases during normal operation and partitions"
  - "Trace Raft leader election, randomized election timeouts, terms, and majority quorum rules"
  - "Explain Raft log replication, commitIndex advancement, and why Figure 8 forbids directly committing old-term entries"
  - "Protect Raft reads from stale split-brain leaders using ReadIndex or leader leases"
slides: "../slides/31-cap-consensus-raft.md"
downloadHtml: "../downloads/31-cap-consensus-raft.html"
diagrams:
  - "../diagrams/raft-leader-election.mmd"
animations:
  - "sim-raft-election"
youtube:
  videoId: null
  publishedAt: null
  chapters: []
  transcriptUrl: null
---

# 31 · CAP, PACELC & Consensus Algorithms (Raft / Paxos)

**Level:** Advanced · **Module:** 06 (Distributed Systems Theory & Coordination) · **Status:** Draft

## Learning objectives

By the end of this lesson, you should be able to:
- Refute the *"pick 2 of 3"* CAP oversimplification and use **PACELC** to analyze both partition and normal-case trade-offs.
- Walk through **Raft** leader election, monotonic `term` numbers, and log up-to-dateness voting rules.
- Trace how Raft commits replicated log entries safely without split-brain or lost committed data.
- Explain **linearizable reads** (`ReadIndex` vs. clock-bound leases) and why consensus clusters use odd node counts (`3, 5, 7`).

---

## 1. The Problem: Two Leaders Both Think They Own the Cluster

Suppose you manage a `5`-node metadata store across two availability zones (`3` nodes in `AZ-1`, `2` nodes in `AZ-2`). A fiber cut isolates `AZ-1` from `AZ-2`:

- If `AZ-2` (`2` nodes) elects its own leader so it can stay "available", and `AZ-1` (`3` nodes) keeps serving writes, **both sides accept conflicting writes**—instant **split-brain** corruption!
- Conversely, if the cluster shuts down completely whenever *any* node is unreachable, a single routine server reboot halts the entire company.

How does a cluster automatically elect **at most one** leader per term, keep making progress when `2` of `5` nodes die, and safely heal when the partition ends?

---

## 2. Mental Model

### CAP and PACELC Without the Myths
Forget *"pick 2 of C, A, P."* Networks in distributed systems **always experience partitions (`P`)**—you cannot opt out of dropped cables or asymmetric switches.
- **CAP Theorem (Brewer / Gilbert & Lynch):** *When* a network partition (`P`) occurs, a distributed system must choose between:
  - **CP (Consistency / Linearizability):** Reject or stall writes/reads on the minority side so no stale or conflicting state is exposed.
  - **AP (100% Availability):** Every non-failing node responds, even if disconnected halves diverge.
- **PACELC (Daniel Abadi):** Extends CAP to normal operation when there is **no** partition:
  - **If `P` (Partition):** choose **`A`** or **`C`**.
  - **Else `E` (Normal operation):** choose **`L` (Latency)** or **`C` (Consistency)**.
  - Examples: `etcd` / `ZooKeeper` = **PC/EC**; `DynamoDB` (default eventual reads) / `Cassandra (ONE)` = **PA/EL**; `PNUTS` = **PC/EL** (wait, actually `PA/EL` or `PC/EL`—async master with timeline consistency).

### Consensus (Raft) as a Parliamentary Vote
Consensus means getting a set of unreliable machines to agree on an ordered sequence of commands (`replicated state machine`).
- Every command goes into an **append-only log** replicated across `N` nodes.
- You need a strict **majority quorum** ($\lfloor N/2 \rfloor + 1$) for both **electing a leader** and **committing an entry**. Because any two majorities of `N` overlap in at least one node, a newly elected leader is guaranteed to hear about every previously committed entry!

---

## 3. How It Works Under the Hood

### Phase 1: Raft Leader Election
Every node is in one of three states: **Follower**, **Candidate**, or **Leader**, and persists `currentTerm`, `votedFor`, and `log[]` on disk (`fsync`). See [raft-leader-election.mmd](../diagrams/raft-leader-election.mmd):

```mermaid
sequenceDiagram
  participant F1 as Follower A (Term 1)
  participant F2 as Follower B (Term 1)
  participant F3 as Follower C (Term 1)
  participant Old as Stale Leader (Term 1)

  Note over F1,F3: Old Leader partitioned; F1 election timer (180 ms) expires first
  F1->>F1: Increment currentTerm = 2, vote for self (1/3)
  F1->>F2: RequestVote(term=2, candidate=A, lastLogIdx=42, lastLogTerm=1)
  F1->>F3: RequestVote(term=2, candidate=A, lastLogIdx=42, lastLogTerm=1)
  F2-->>F1: VoteGranted(term=2, true) -> 2/3 majority reached
  F3-->>F1: VoteGranted(term=2, true) -> 3/3

  Note over F1: F1 becomes Leader for Term 2
  F1->>F2: AppendEntries heartbeat(term=2, leaderCommit=42)
  F1->>F3: AppendEntries heartbeat(term=2, leaderCommit=42)

  Note over Old,F2: Partition heals; Old sends stale Term 1 AppendEntries
  Old->>F2: AppendEntries(term=1)
  F2-->>Old: Reject(term=2) -> Old steps down to Follower (Term 2)
```

1. **Randomized Election Timeouts (`150–300 ms`):** Prevents simultaneous split votes. The first follower to time out bumps `currentTerm`, votes for itself, and sends `RequestVote`.
2. **At-Most-One-Vote per Term + Log Up-to-Dateness:** A follower grants a vote **only if** (a) it hasn't voted in that term yet, AND (b) the candidate's log is **at least as up-to-date** as its own (higher `lastLogTerm`, or equal `lastLogTerm` and `>= lastLogIndex`).
3. **Stale Leader Fencing:** When the partitioned old leader (`Term 1`) reconnects, any peer with `Term 2` rejects its RPCs and returns `term=2`, forcing the old leader to step down immediately.

### Phase 2: Log Replication & Safety Rules
1. Client sends `SET x = 5` to the Leader.
2. Leader appends `(term=2, index=43, SET x=5)` locally and broadcasts `AppendEntries(prevLogIndex=42, prevLogTerm=1, entries=[...])`.
3. Followers verify `(prevLogIndex, prevLogTerm)` matches their own log (log matching invariant). If mismatched, the Leader walks `nextIndex` backward until logs align and overwrites uncommitted follower divergence.
4. Once a majority ($\lfloor N/2 \rfloor + 1$) appends index `43` to durable storage, the Leader advances `commitIndex = 43`, applies `SET x = 5` to its state machine, and replies `200 OK` to the client.
5. **The Figure 8 Rule (Critical Safety Subtlety):** A Raft leader **never** marks a log entry from a *previous* term as committed simply by counting replicas; it only commits entries from its **current** term by counting replicas, which then **indirectly commits** all earlier entries in its log. (Otherwise, a partial old-term entry could be overwritten in a later crash sequence!)

### Phase 3: Preventing Stale Reads from a Partitioned Leader
Even a valid Leader might be partitioned from the majority right after replying to a client and before its heartbeat expires—serving stale local memory reads! Two production fixes:
- **`ReadIndex` (Zero clock dependency):** On a read, the Leader records `readIndex = commitIndex`, sends one round of `AppendEntries` heartbeats to confirm a majority still recognizes it as Leader, waits for `lastApplied >= readIndex`, and returns the value.
- **Leader Lease:** Uses monotonic local timers bounded by clock drift (`election_timeout / max_drift_ratio`) to serve reads locally without a heartbeat RTT—faster, but vulnerable if a host suffers an extreme VM/clock pause exceeding drift bounds.

---

## 4. Worked Example & Interactive Visualization

Let's size a `5`-node Raft cluster (`etcd` / `CockroachDB` range) across `3` Availability Zones (`2` in AZ-A, `2` in AZ-B, `1` in AZ-C):

1. **Cluster Size & Failure Math:**
   - Quorum = $\lfloor 5 / 2 \rfloor + 1 = 3$ nodes.
   - Tolerates **`F = 2` simultaneous node failures** (including an entire `2`-node AZ failure!).
   - Why not `4` nodes? Quorum of `4` is $\lfloor 4 / 2 \rfloor + 1 = 3$, which tolerates only **`1` node failure** (`4 - 3 = 1`)—same fault tolerance as `3` nodes (`3 - 2 = 1`) at `33%` higher hardware cost and larger quorum wait!
2. **Write Latency & Throughput Ceiling:**
   - Assume cross-AZ RTT = `2.0 ms`, NVMe `fsync` = `1.5 ms`.
   - Each committed write requires: Leader `fsync` (`1.5 ms`) + parallel `AppendEntries` to peers (`1.0 ms` one-way + `1.5 ms` follower `fsync` + `1.0 ms` ACK) $\approx 3.5\text{–}4.5\text{ ms}$ (since Leader and Follower `fsync` overlap partially).
   - With `100` pipelined/batched concurrent client requests (`batch = 100` entries per `fsync`), throughput reaches `~22,000 writes/s`; **unbatched sequential** writes on one key max out at `1,000 ms / 4 ms = 250 writes/s`.

> **Interactive Visualization (`sim-raft-election`):** Launch [sim-raft-election](../animations-and-visuals.md) on a `5`-node cluster. Kill the Leader, inspect randomized election timers (`150–300 ms`), and split the cluster `3 vs 2`: observe the `3`-node side elect a new leader and commit entries while the `2`-node minority side stalls cleanly without diverging.

---

## 5. Trade-Offs & Failure Modes

| Choice | Benefit | Cost / Risk | Fails When |
|---|---|---|---|
| **`3`-Node Cluster** | Lowest consensus cost; `2/3` quorum | Tolerates only `1` failure; rolling upgrade + `1` crash = outage! | Planned maintenance overlaps an unexpected node failure |
| **`5`-Node Cluster** | Tolerates `2` failures (maintenance + 1 crash) | Slightly higher replication fan-out (`4` peers) | All `5` placed in `2` AZs (`3 + 2`): losing the `3`-node AZ loses quorum |
| **`ReadIndex` Reads** | Linearizable without trusting physical clock drift | Adds `1` heartbeat RTT to every linearizable read | Read-heavy workload needs `< 1 ms` local reads (use follower reads + `ReadIndex` batching or leases) |
| **Multi-Paxos vs. Raft** | Multi-Paxos allows out-of-order log gaps & flexible leaderless tweaks | Harder to specify & implement correctly (`Viewstamped Replication` / `EPaxos`) | Team needs clean membership changes & understandable debuggability (Raft wins) |

### What changes at 10× and 100× scale?
- **At 10× (`50,000+ writes/s`):** A single Raft group serializes all writes through one leader and one disk log. Break the keyspace into **Multi-Raft** ranges (like CockroachDB, TiKV, or YugabyteDB): `1,000` independent `64 MiB` ranges, each running its own `3`- or `5`-node Raft group with leaders balanced across all servers.
- **At 100× (Multi-Region Global Scale):** Cross-region Raft quorums (`80–150 ms` RTT) make writes slow. Use **regional pinning** (place `3` of `5` voters in the user's home region, or use non-voting **Learner** replicas in remote regions) so local commits complete in `~4 ms` while preserving global DR copies.

---

## 6. Practical Exercise

Given a `5`-node Raft cluster distributed across `3` regions (`2` in `US-East`, `2` in `US-West`, `1` in `EU-West`):
1. If `US-East` (`2` nodes) is completely disconnected, can the remaining `3` nodes elect a leader and commit writes? What is the minimum write RTT across `US-West <-> EU-West` (`140 ms` RTT)?
2. Explain why placing `3` nodes in `US-East` and `1` each in `US-West` and `EU-West` drops write latency to `~4 ms` during normal operation—and what happens to availability if `US-East` goes down completely.

---

## 7. Retrieval Practice

1. State the CAP theorem accurately without saying *"pick 2 of 3"*, and explain what `EL` vs `EC` adds in PACELC.
2. Why are `4`-node and `6`-node Raft clusters almost never used in production?
3. During a split vote where `Node A` and `Node B` start `Term 2` simultaneously and each gets `2` of `5` votes, how does Raft recover?
4. How does Raft ensure a newly elected leader never loses an entry that was already acknowledged to a client?
5. Why can a Raft Leader still return stale data if it serves `GET` requests directly from its local memory without checking a quorum (`ReadIndex`) or holding a valid lease?

<details><summary>Hints</summary>
1. Partitions (`P`) are unavoidable, so during `P` you choose `C` (consistency) or `A` (availability). PACELC adds normal non-partition operation (`E`): choose lower Latency (`L`) or Consistency (`C`).
2. Even-numbered clusters need `(N/2)+1` nodes, yielding the same fault tolerance as `N - 1` (`4` tolerates `1` failure, same as `3`) while increasing cost and failure surface.
3. Election timers are randomized (`150–300 ms`), so one node times out first, increments to `Term 3`, and wins a majority before others expire.
4. Every committed entry was written to a majority; any future leader must collect votes from a majority (which overlaps in `>= 1` node) AND `RequestVote` rejects candidates whose log is behind the voter's log.
5. The network may have partitioned the leader from the majority and elected a new leader that processed newer writes, while the old leader's heartbeat timer hasn't expired yet.
</details>

---

## Primary Sources

- **Tier 3 (Paper):** [In Search of an Understandable Consensus Algorithm (Ongaro & Ousterhout, USENIX ATC '14)](https://raft.github.io/raft.pdf) — Full Raft specification, safety proofs, and Figure 8 log-commitment rule.
- **Tier 3 (Visual Guide):** [The Secret Lives of Data · Raft](https://thesecretlivesofdata.com/raft/) — Step-by-step interactive explanation of leader election and log replication.
- **Tier 3 (Paper):** [PACELC: Consistency Tradeoffs in Modern Distributed Database System Design (Abadi, IEEE Computer 2012)](https://www.cs.umd.edu/~abadi/papers/abadi-pacelc.pdf) — Extending CAP to normal-case latency vs. consistency.
- **Tier 3 (Paper):** [Paxos Made Simple (Lamport, 2001)](https://lamport.azurewebsites.net/pubs/paxos-simple.pdf) — Classic single-decree and multi-decree consensus foundations.

---

## Next

Continue to [32 · Distributed Coordination, Leases & Locking](32-distributed-coordination.md).
