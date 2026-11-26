# System Design: Beginner to Advanced

**Learn to design, measure, scale, secure, and defend real-world software systems from first principles.**

- **Level:** Beginner → Intermediate → Advanced → Staff Architecture
- **Scope:** 9 Modules · 40 Written Lessons · 14 Hands-On Labs · 16 End-to-End Case Studies · 4 Stage Projects · 5 Checkpoints
- **Interactive Teaching Assets:** 19 `.mmd` + 40+ inline Mermaid diagrams · 40 zero-dependency interactive visualizations · 40 standalone animated `.html` slide decks (with built-in presenter webcam bubble)
- **Status:** Content drafts complete (`L01–L40`, `Labs 01–14`, `Case Studies 01–16`, `Slides 01–40`); YouTube video recordings in progress
- **YouTube Channel:** [@StackShade](https://www.youtube.com/@StackShade)

---

## Start Studying or Teaching Immediately

- **Open Offline Slides & Interactive Visuals Hub:** [`downloads/index.html`](downloads/index.html) *(40 animated `.html` decks + all 40 live simulations, works offline)*
- **Browse Full Curriculum:** [Full Curriculum Map](curriculum.md) · [Staged Roadmap](roadmap.md) · [Detailed Syllabus](syllabus.md)
- **First Lesson:** [01 · Thinking in Systems](lessons/01-thinking-in-systems.md)

---

## What You Will Learn

- **Reason from constraints first:** Turn ambiguous prompts into measurable functional requirements, SLIs/SLOs, and back-of-the-envelope capacity math.
- **Master internet & data foundations:** Trace DNS, TCP, TLS 1.3, HTTP/2–3, CDNs, load balancers, B+Trees, LSM-Trees, MVCC, and object storage.
- **Scale reads, writes, and state:** Apply caching topologies, singleflight stampede defense, replication, consistent hashing, sharding, and Snowflake/UUIDv7 IDs.
- **Architect asynchronous & distributed systems:** Design queues, Kafka-style streams, outbox/CDC, sagas, Raft/consensus, quorums (`R + W > N`), and fencing tokens.
- **Operate reliable, secure, cost-aware production systems:** Implement rate limiters, OAuth 2.1/OIDC, OpenTelemetry observability, overload shedding, multi-region DR, FinOps, and modern AI/LLM inference pipelines.
- **Defend complete architectures:** Execute 16 production case studies and an end-to-end capstone with ADRs, load tests, and failure drills.

---

## Course Snapshot

| Track | Modules | Lessons | Labs & Checkpoints | Stage Project / Milestone |
|---|---:|---:|---|---|
| **Stage 1 · Foundations** | Modules 0–2 | [L01](lessons/01-thinking-in-systems.md)–[L14](lessons/14-object-storage.md) | Labs `01–05` · [Checkpoint 01](assessments/checkpoint-01.md) & [02](assessments/checkpoint-02.md) | System map, API spec, Storage ADR |
| **Stage 2 · Building Blocks & Scale** | Modules 3–5 | [L15](lessons/15-caching-patterns.md)–[L27](lessons/27-stream-olap.md) | Labs `06–10` · [Checkpoint 03](assessments/checkpoint-03.md) | [Project 01 · URL Shortener](projects/01-url-shortener-platform/README.md) · [Project 02 · Notification & Feed](projects/02-notification-and-feed/README.md) |
| **Stage 3 · Distributed & Reliable** | Modules 6–7 | [L28](lessons/28-partial-failure.md)–[L37](lessons/37-multi-region-finops.md) | Labs `11–14` · [Checkpoint 04](assessments/checkpoint-04.md) & [05](assessments/checkpoint-05.md) | [Project 03 · Multi-Region Chat](projects/03-multi-region-chat/README.md) |
| **Stage 4 · Architecture Mastery** | Module 8 | [L38](lessons/38-problem-decomposition.md)–[L40](lessons/40-system-evolution.md) | 16 Case Studies (`01–16`) | [Project 04 · Capstone](projects/04-capstone/README.md) |

---

## Course Directory & Tools

| Resource | Link |
|---|---|
| **Downloadable Animated HTML Decks** | [Downloads Guide](downloads/README.md) · [`downloads/index.html`](downloads/index.html) |
| **Slide Markdown Sources (`01–40`)** | [`slides/`](slides/01-course-kickoff.md) (compiled via `node scripts/build-slides.mjs`) |
| **Visualizations & Mermaid Catalog** | [Animations & Visuals](animations-and-visuals.md) |
| **Practice, Quizzes & Interview Prep** | [Neuroscience Study & Interview Guide](interview-practice.md) · [Quizzes & Flashcards JSON](practice-and-quizzes.json) |
| **YouTube Production Tracker** | [YouTube & Slides Plan](youtube-and-slides-plan.md) |
| **Curated References & Glossary** | [Resource Library](resources/README.md) · [Topic Matrix](resources/topic-index.md) · [Glossary](glossary.md) |
| **Templates & Learning Guide** | [System Design Template](templates/system-design.md) · [ADR](templates/adr.md) · [Learning Loop](learning-system.md) |
