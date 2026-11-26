# YouTube Production & Downloadable HTML Slides Plan

This document maps every lesson and case study to its **YouTube video episode**, **Markdown slide source**, **downloadable standalone `.html` slide deck**, and **PPTX/PDF distribution assets**.

See [Downloadable Animated HTML Slides Spec](../../shared/guides/downloadable-html-slides.md) and [Content Authoring Playbook](../../shared/guides/content-authoring-playbook.md) for the step-by-step authoring and recording workflow.

---

## 1. YouTube Channel & Playlist Architecture

- **Channel:** [@StackShade](https://www.youtube.com/@StackShade)
- **Main Course Playlist:** *System Design: Beginner to Advanced (Full Course)*
- **Sub-Playlists (Udemy-style clear segmentation):**
  1. **Part 1 · Foundations & Networking (EP01–EP09)**
  2. **Part 2 · Storage, Caching & Scaling Data (EP10–EP22)**
  3. **Part 3 · Messaging, Distributed Systems & Reliability (EP23–EP37)**
  4. **Part 4 · Case Studies & Staff Mastery (EP38–EP40 + CS01–CS16)**

---

## 2. Recording & Video Linking Workflow

1. **Author article first** (`lessons/NN-slug.md`) and confirm all assumptions, units, and primary sources.
2. **Author slide deck** (`slides/NN-slug.md`) with `<!-- step -->` animation cues, Mermaid diagrams, Tier-2 interactive widgets, and `<!-- note: -->` talking points.
3. **Export standalone `.html` deck** (and verify all animations work cleanly in Dark Mode `1920×1080`).
4. **Teach & record:** Open the web **Presenter Mode** (or the exported `.html` deck), enable the local circular webcam bubble if desired, and capture via OBS.
5. **Publish & sync metadata:** Paste the YouTube `videoId`, chapter timestamps, and transcript link into the lesson's YAML frontmatter and `courses/system-design/course.json`.

### Metadata Block Example (`course.json` / Lesson Frontmatter)
```json
{
  "lessonId": "01",
  "episode": "EP01",
  "title": "Thinking in Systems",
  "youtubeVideoId": null,
  "duration": "14:30",
  "status": "draft",
  "slideSource": "slides/01-course-kickoff.md",
  "downloadHtml": "downloads/01-course-kickoff.html",
  "downloadPptx": "downloads/01-course-kickoff.pptx",
  "chapters": [
    { "time": "00:00", "title": "Why products fail before scale" },
    { "time": "03:15", "title": "The 5-layer system mental model" },
    { "time": "08:40", "title": "Requirements vs technology choices" }
  ]
}
```

---

## 3. Complete Episode & Slide Deck Manifest (`EP01–EP40 + Case Studies`)

| Ep | Module | Slide Source (`slides/`) | Downloadable HTML Deck (`downloads/`) | Target Video Length | Status |
|---|---|---|---|---:|---|
| **EP01** | M00 | [01-course-kickoff.md](slides/01-course-kickoff.md) | `01-course-kickoff.html` | 12–15 min | Slide source ready |
| **EP02** | M00 | [02-requirements-and-estimation.md](slides/02-requirements-and-estimation.md) | `02-requirements-and-estimation.html` | 15–18 min | Slide source ready |
| **EP03** | M00 | `03-capacity-estimation.md` | `03-capacity-estimation.html` | 15–18 min | Planned |
| **EP04** | M00 | `04-latency-and-bottlenecks.md` | `04-latency-and-bottlenecks.html` | 15–18 min | Planned |
| **EP05** | M01 | `05-web-request-dns.md` | `05-web-request-dns.html` | 16–20 min | Planned |
| **EP06** | M01 | `06-transport-tls-http.md` | `06-transport-tls-http.html` | 18–22 min | Planned |
| **EP07** | M01 | `07-proxies-cdn-gateway.md` | `07-proxies-cdn-gateway.html` | 14–18 min | Planned |
| **EP08** | M01 | `08-load-balancing.md` | `08-load-balancing.html` | 15–18 min | Planned |
| **EP09** | M01 | `09-api-contracts.md` | `09-api-contracts.html` | 18–22 min | Planned |
| **EP10** | M02 | `10-data-models.md` | `10-data-models.html` | 18–20 min | Planned |
| **EP11** | M02 | `11-storage-engines.md` | `11-storage-engines.html` | 20–25 min | Planned |
| **EP12** | M02 | `12-indexing-query-plans.md` | `12-indexing-query-plans.html` | 18–22 min | Planned |
| **EP13** | M02 | `13-transactions-isolation.md` | `13-transactions-isolation.html` | 20–24 min | Planned |
| **EP14** | M02 | `14-object-storage.md` | `14-object-storage.html` | 14–18 min | Planned |
| **EP15** | M03 | `15-caching-patterns.md` | `15-caching-patterns.html` | 15–18 min | Planned |
| **EP16** | M03 | `16-eviction-invalidation.md` | `16-eviction-invalidation.html` | 15–18 min | Planned |
| **EP17** | M03 | `17-cache-failure-modes.md` | `17-cache-failure-modes.html` | 16–20 min | Planned |
| **EP18** | M03 | `18-stateless-concurrency.md` | `18-stateless-concurrency.html` | 15–18 min | Planned |
| **EP19** | M04 | `19-replication.md` | `19-replication.html` | 18–22 min | Planned |
| **EP20** | M04 | `20-sharding-hashing.md` | `20-sharding-hashing.html` | 18–22 min | Planned |
| **EP21** | M04 | `21-hot-shards-migrations.md` | `21-hot-shards-migrations.html` | 16–20 min | Planned |
| **EP22** | M04 | `22-distributed-ids.md` | `22-distributed-ids.html` | 14–16 min | Planned |
| **EP23** | M05 | `23-queues-vs-streams.md` | `23-queues-vs-streams.html` | 16–20 min | Planned |
| **EP24** | M05 | `24-delivery-semantics.md` | `24-delivery-semantics.html` | 15–18 min | Planned |
| **EP25** | M05 | `25-outbox-saga-cqrs.md` | `25-outbox-saga-cqrs.html` | 20–24 min | Planned |
| **EP26** | M05 | `26-search-pipelines.md` | `26-search-pipelines.html` | 18–22 min | Planned |
| **EP27** | M05 | `27-stream-olap.md` | `27-stream-olap.html` | 18–22 min | Planned |
| **EP28** | M06 | `28-partial-failure.md` | `28-partial-failure.html` | 16–20 min | Planned |
| **EP29** | M06 | `29-clocks-and-fencing.md` | `29-clocks-and-fencing.html` | 18–22 min | Planned |
| **EP30** | M06 | `30-consistency-quorums.md` | `30-consistency-quorums.html` | 20–24 min | Planned |
| **EP31** | M06 | `31-cap-consensus-raft.md` | `31-cap-consensus-raft.html` | 22–26 min | Planned |
| **EP32** | M06 | `32-distributed-coordination.md` | `32-distributed-coordination.html` | 15–18 min | Planned |
| **EP33** | M07 | `33-reliability-overload.md` | `33-reliability-overload.html` | 18–22 min | Planned |
| **EP34** | M07 | `34-observability-chaos.md` | `34-observability-chaos.html` | 18–22 min | Planned |
| **EP35** | M07 | `35-security-identity.md` | `35-security-identity.html` | 20–24 min | Planned |
| **EP36** | M07 | `36-cloud-deployments.md` | `36-cloud-deployments.html` | 16–20 min | Planned |
| **EP37** | M07 | `37-multi-region-finops.md` | `37-multi-region-finops.html` | 20–24 min | Planned |
| **EP38** | M08 | `38-problem-decomposition.md` | `38-problem-decomposition.html` | 18–20 min | Planned |
| **EP39** | M08 | `39-ai-systems-architecture.md` | `39-ai-systems-architecture.html` | 20–25 min | Planned |
| **EP40** | M08 | `40-system-evolution.md` | `40-system-evolution.html` | 18–22 min | Planned |
| **CS01–16** | M08 | `cs-01-url-shortener.md` … `cs-16-multitenant-saas.md` | `cs-01-url-shortener.html` … | 20–30 min each | Planned |

---

## 4. Video Production Checklist (Per Episode)

- [ ] Lesson Markdown article finalized & verified against primary docs
- [ ] Mermaid diagrams verified in both Light & Dark theme
- [ ] Interactive visualization/animation verified inside standalone `.html` slide build
- [ ] Slide speaker notes reviewed; 1080p browser capture checked (webcam corner safe)
- [ ] Video recorded, audio normalized, captions/subtitles exported
- [ ] Chapter timestamps & lesson links added to YouTube description
- [ ] `videoId` & chapters updated in lesson frontmatter and `course.json`
- [ ] Standalone `.html` deck + PPTX/PDF available on the Downloads tab
