# Neuroscience-Backed Study, Practice & Interview Guide

Reading articles or watching videos creates an *illusion of competence*. Lasting mastery in system design comes from four evidence-backed cognitive mechanisms built directly into this course:

1. **Active Recall (Testing Effect):** Every lesson includes instant-feedback diagnostic MCQs (`practice-and-quizzes.json`) and retrieval prompts. Testing yourself *before* re-reading strengthens memory retrieval far more than highlighting.
2. **Spaced Repetition (Ebbinghaus / SM-2 Leitner Intervals):** Use the **Spaced Repetition Deck** in the Practice Arena (`/courses/system-design/practice/`) to review high-yield concepts at expanding intervals (`Again <1m → Hard 1d → Good 3d → Easy 7d`).
3. **Interleaved Mixed Practice:** Instead of only drilling one module at a time, run **Interleaved Mixed Drills** that shuffle scenarios across caching, sharding, consensus, and reliability—forcing your brain to *diagnose which pattern fits which constraint*.
4. **Feynman Teach-Back & Consolidation Rest:** Write a plain-language explanation from memory in the Lesson **Quiz & Recall** tab (Problem, Trade-Off, Failure Mode), then take a 5-minute break after a 25-minute focus sprint so memory traces consolidate.

---

## Structured 45-Minute Interview Drill Protocol

| Minute | Phase | Goal |
|---:|---|---|
| **0–5** | Clarify & Scope | Nail functional scope, explicit exclusions, `p95/p99` targets, and consistency needs |
| **5–12** | Back-of-the-Envelope Math | Estimate DAU, average & peak QPS, storage growth (raw vs replicated), and egress bandwidth |
| **12–22** | Core Architecture & APIs | Draw clean end-to-end read/write paths, data models, and primary API contracts |
| **22–38** | Deep Dives & Bottlenecks | Attack the 2 hardest bottlenecks (hot keys, sharding, fan-out, contention, consensus, async lag) |
| **38–45** | Failure Modes, Security & Cost | Address overload shedding, partial failure recovery, observability SLIs, and cost levers |

---

## Verified External Practice & Lab Platforms

| Platform | Focus Area | Access | How to Use With This Course |
|---|---|---|---|
| [System Design Primer · Practice Questions](https://github.com/donnemartin/system-design-primer#system-design-interview-questions-with-solutions) | End-to-end system prompts | Free / Open Source | Sketch your own design first for 25 min, then compare against reference trade-offs |
| [Hello Interview · System Design](https://www.hellointerview.com/) | Modern interview breakdowns | Freemium | Study Staff-level deep dives alongside our 16 Case Studies |
| [MIT 6.5840 Distributed Systems Labs](https://pdos.csail.mit.edu/6.5840/labs/lab-raft1.html) | Implementing Raft & KV stores | Free / Open Course | Pair with Module 06 (`L30–L32`) to build real consensus in Go |
| [PostgreSQL Exercises (pgexercises.com)](https://pgexercises.com/) | SQL queries, joins & indexing | Free | Pair with Module 02 (`L10–L13`) for query mechanics |
| [SQLBolt](https://sqlbolt.com/) | Interactive SQL fundamentals | Free | Warm up relational modeling before `L12` Indexing |
| [Use The Index, Luke](https://use-the-index-luke.com/) | B-Tree indexes & execution plans | Free | Pair directly with `Lab 04 · Index & EXPLAIN Tuning` |
| [SadServers](https://sadservers.com/) | Live Linux & production debugging | Freemium (free tier) | Practice root-cause triage for Module 07 (`L33–L34`) |
| [Jepsen Distributed Systems Analyses](https://jepsen.io/analyses) | Real database consistency bugs | Free | Read alongside `L19` Replication & `L30` Quorums |
| [Excalidraw](https://excalidraw.com/) | Timed architecture sketching | Free / Open Source | Use for 15-minute blank-canvas whiteboard drills |
| [Cloudflare Radar](https://radar.cloudflare.com/) | Live global internet & BGP/HTTP telemetry | Free | Explore real HTTP/3, DNS, and outage signals for Module 01 |
