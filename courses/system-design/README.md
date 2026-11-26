# System Design: Beginner to Advanced

**Learn to design, measure, scale, secure, and defend real-world software systems from first principles.**

- **Level:** Beginner → Intermediate → Advanced → Staff Architecture
- **Scope:** 9 Modules · 40 Structured Lessons · 14 Hands-On Labs · 16 End-to-End Case Studies · 4 Stage Projects + 1 Capstone · 5 Checkpoints
- **Formats:** Written articles · 45+ Mermaid diagrams · 20 animated/interactive visuals · Downloadable standalone HTML slides & PPTX · YouTube video lectures
- **Status:** In progress (Foundation drafts live; full syllabus mapped)
- **YouTube Channel:** [@StackShade](https://www.youtube.com/@StackShade)

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

| Track | Modules | Lessons | Labs | Milestone / Project |
|---|---:|---:|---:|---|
| **Stage 1 · Foundations** | Modules 0–2 | L01–L14 | Labs 01–05 | System map, API spec, Storage ADR |
| **Stage 2 · Building Blocks & Scale** | Modules 3–5 | L15–L27 | Labs 06–10 | URL Shortener, Notification & Feed Platforms |
| **Stage 3 · Distributed & Reliable** | Modules 6–7 | L28–L37 | Labs 11–14 | Multi-Region Chat & Presence + Chaos Drill |
| **Stage 4 · Architecture Mastery** | Module 8 | L38–L40 | 16 Case Studies | Production Capstone + Recorded Review |

---

## Curriculum Navigation

| Document | Purpose |
|---|---|
| [Full Curriculum Map](curriculum.md) | 9-module master table (40 lessons, 14 labs, 16 case studies, 5 checkpoints) |
| [Detailed Lesson Syllabus](syllabus.md) | Objectives, Mermaid specs, animations, resources & YT slots for L01–L40 |
| [Staged Roadmap](roadmap.md) | Sequential checklist with weekly study cycle & readiness rubric |
| [Animations & Visuals Catalog](animations-and-visuals.md) | All 45+ Mermaid diagrams & 20 interactive/animated visualizations |
| [YouTube & Slides Production Plan](youtube-and-slides-plan.md) | Episode plan, HTML slide deck manifest & video-linking workflow |
| [Downloadable Slides & Assets](downloads/README.md) | Standalone animated `.html` decks + PPTX/PDF downloads |
| [Curated Resource Library](resources/README.md) & [Topic Index](resources/topic-index.md) | RFCs, official docs, research papers & engineering blogs mapped to every module |
| [Glossary](glossary.md) | Concise working definitions linked across all stages |

---

## Live Drafts Available Today

- **Lessons:**
  - [01 · Thinking in Systems](lessons/01-thinking-in-systems.md) *(First draft)*
  - [02 · Requirements and Capacity](lessons/02-requirements-and-capacity.md) *(First draft)*
  - [03 · The Life of a Web Request](lessons/03-the-web-request.md) *(First draft)*
- **Lab:** [Lab 01 · Back-of-the-Envelope Capacity Estimation](labs/01-capacity-estimation.md)
- **Case Study:** [Case Study 01 · URL Shortener](case-studies/01-url-shortener.md)
- **Assessment:** [Checkpoint 01 · Foundations](assessments/checkpoint-01.md)
- **Slides (Markdown Source):** [01 · Course Kickoff](slides/01-course-kickoff.md) · [02 · Requirements & Estimation](slides/02-requirements-and-estimation.md)
- **Worksheets & Templates:** [System Design Worksheet](templates/system-design.md) · [ADR Template](templates/adr.md) · [Learning Log](templates/learning-log.md)

---

## Prerequisites & Who This Course Is For

- **Beginners & students:** Basic programming comfort and familiarity with building simple HTTP endpoints or SQL queries.
- **Backend / full-stack engineers:** Preparing for senior design reviews, production scaling, or system-design interviews.
- **Self-learners:** Prefer first-principles explanations, interactive diagrams, and real failure analysis over memorizing buzzwords.

---

## Teaching & Study Method

> **Learn → Understand → Visualize → Build → Experiment → Break → Explain**

Every lesson teaches **why a problem exists before introducing any vendor product**. See [How to Learn System Design](learning-system.md) for the weekly study loop and [Content Authoring Playbook](../../shared/guides/content-authoring-playbook.md) if you are authoring or recording lessons.
