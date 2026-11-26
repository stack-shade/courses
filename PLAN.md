# StackShade Courses — Product & Content Plan

> **Purpose:** Build the educational home for the [StackShade YouTube channel](https://www.youtube.com/@StackShade). This is the product and content blueprint, implemented in [`apps/web/`](apps/web/package.json) and deployed via [`.github/workflows/pages.yml`](.github/workflows/pages.yml).

**Repository:** https://github.com/stack-shade/courses  
**YouTube:** https://www.youtube.com/@StackShade  
**Intended learning hub:** https://stack-shade.github.io/courses/  
**Project type:** Multi-course education platform + content production system  
**Status:** Planning / course-content foundation

---

## 1. Vision

Create a polished, useful, multi-course learning platform for StackShade. It should turn each YouTube learning series into a complete learning path, not just a collection of videos.

A learner should be able to discover a course, understand its prerequisites, follow a beginner-to-advanced roadmap, read structured notes, watch the matching YouTube lesson, explore diagrams and interactive demos, download slides and cheat sheets, complete exercises, build projects, and assess their understanding.

The platform must support **many independent courses**. System Design is the first course, not the whole website.

The channel's teaching promise:

**Learn → Understand → Visualize → Build → Experiment → Explain.**

The website is the companion classroom and reference library for the videos.

## 2. Product principles

1. **Beginner-friendly, technically serious.** Explain concepts in simple language before adding precise terminology and deeper detail.
2. **Visual first, not decoration first.** Diagrams, timelines, animations, simulations and real examples must explain something.
3. **Course-native organization.** Each course owns its curriculum, material, projects and references. Shared templates and the website design system are maintained once.
4. **Learn by making.** Every meaningful module should include an exercise, lab, design task or project.
5. **Credible sources.** Prefer primary docs, standards, research papers and first-party engineering stories. Cite and summarize; do not reproduce copyrighted content.
6. **Built for video teaching.** Lessons and HTML presentations must work beautifully on a screen during recording.
7. **Fast and accessible.** Responsive, keyboard-friendly, readable, searchable, light on unnecessary JavaScript and comfortable for long study sessions.
8. **Honest progress.** Clearly distinguish planned, draft, reviewed and published material. Never present an empty placeholder as a finished lesson.
9. **Agent-friendly and maintainable.** Content is version-controlled Markdown/MDX and code; course metadata is structured and validated.
10. **Autonomous improvements are welcome.** The implementation agent should make sensible product, UX, architecture and visual decisions beyond this document when they materially improve the result.

## 3. Audience and use cases

### Learners
- Students and early-career developers learning fundamentals.
- Developers preparing for interviews or moving into more senior engineering work.
- Self-directed learners who want structured notes and practical projects.
- Viewers who discover a topic through a StackShade video and want to go deeper.

### Creator / instructor
- Plan and publish multiple educational series.
- Teach directly from the website or from a browser-based HTML slide deck.
- Use presenter mode with an optional webcam overlay.
- Keep slide sources, notes, diagrams and downloads organized next to the relevant course.
- Use external capture/recording software when recording a lesson.

### Primary user journeys
1. **Discover:** channel viewer → course catalogue → course overview → roadmap.
2. **Study:** lesson → video/transcript → notes/visualization → quiz → next lesson.
3. **Practice:** module → lab → code/artifact → reflection → project.
4. **Teach:** open lesson/deck → present mode → optionally enable webcam bubble → record browser with a capture app.
5. **Reference:** search a concept → open a short explanation → inspect diagram/source → return to full lesson.

## 4. Information architecture

### Top-level site map

- **Home** — clear channel identity, featured courses, learning paths, new lessons and a strong "Start learning" route.
- **Courses** — searchable and filterable multi-course catalogue.
- **Course overview** — purpose, audience, outcomes, prerequisites, roadmap, curriculum, modules, projects and resources.
- **Learning workspace** — lesson viewer, module navigation, video, transcript, notes, visualizations, examples, quizzes, resources and previous/next navigation.
- **Presentations** — beautiful browser-based HTML decks with presentation controls and optional instructor camera overlay.
- **Labs & projects** — practical catalogues and project briefs per course.
- **Resources** — curated external source links, books, papers, documentation and engineering blogs.
- **About StackShade** — explain the channel and connect learners to YouTube.
- **Search** — global search across course titles, lesson content, tags, glossary terms and resources.

### Suggested routes

```text
/
├── /courses
├── /courses/[courseSlug]
├── /courses/[courseSlug]/roadmap
├── /courses/[courseSlug]/curriculum
├── /courses/[courseSlug]/learn/[...lessonSlug]
├── /courses/[courseSlug]/labs/[labSlug]
├── /courses/[courseSlug]/projects/[projectSlug]
├── /courses/[courseSlug]/case-studies/[caseSlug]
├── /courses/[courseSlug]/resources
├── /present/[courseSlug]/[deckSlug]
├── /search
└── /about
```

The exact route and content loader implementation is Claude's architectural decision, provided all course content remains independently organized and the site can be statically exported to GitHub Pages.

## 5. Multi-course repository model

The repository is a **course monorepo**: shared platform material once, independent course material by slug.

```text
.
├── README.md
├── PLAN.md
├── CONTRIBUTING.md
├── courses/
│   ├── catalog.json
│   ├── README.md
│   └── <course-slug>/
│       ├── README.md
│       ├── course.json
│       ├── roadmap.md
│       ├── curriculum.md
│       ├── lessons/
│       ├── modules/
│       ├── slides/
│       ├── labs/
│       ├── projects/
│       ├── case-studies/
│       ├── diagrams/
│       ├── resources/
│       ├── assessments/
│       ├── templates/
│       ├── assets/
│       └── downloads/
├── shared/
│   ├── standards/
│   ├── templates/
│   ├── resources/
│   └── publishing.md
├── apps/
│   └── web/                 # Claude builds the Next.js application here
├── public/
│   ├── brand/
│   └── course-thumbnails/
├── scripts/
│   └── new-course.sh
└── .github/
    └── workflows/           # Claude adds validated CI + GitHub Pages deployment
```

Do not put the website source inside a course. Do not copy shared templates into every course. A new course must be added to `courses/catalog.json` and use a separate `courses/<slug>/` directory.

## 6. Standard structure for each course

### Course metadata
Every `course.json` should describe:
- slug, title, one-line description and full overview;
- category, level, status and target audience;
- prerequisites and expected outcomes;
- estimated time, modules and topics;
- thumbnail, accent/color token and featured status;
- YouTube playlist/channel/video references, where available;
- entrypoint, roadmap and curriculum paths.

Use typed validation (for example Zod) and fail the build on malformed metadata or broken required links.

### Standard module
Each module should have:
1. An overview, objectives and prerequisites.
2. Ordered lessons and estimated study time.
3. A conceptual map and key vocabulary.
4. Core notes with diagrams and worked examples.
5. At least one practical artifact: exercise, lab, simulation or design task.
6. A checkpoint quiz with feedback/hints.
7. A module summary, revision sheet and further reading.
8. A slide deck or teaching outline when appropriate.

### Standard lesson
A full lesson should include:
- title, summary, learning objectives, difficulty, estimated time and prerequisites;
- a clear problem statement and mental model;
- a simple explanation, then accurate technical depth;
- diagrams, tables, sequence flows, formulas or animations where useful;
- a worked example with assumptions and units;
- implementation or hands-on activity;
- common mistakes, trade-offs and failure cases;
- knowledge-check questions and optional hints;
- matching YouTube video, chapters and transcript/captions when available;
- further reading with citations;
- previous/next links and related lessons.

### Artifacts to collect per course
- Markdown/MDX lessons and module notes.
- Slide source files and published HTML slide presentations.
- PPTX and PDF downloads where useful.
- Original diagrams (Mermaid, SVG, React Flow source, PlantUML or editable source format).
- Interactive simulations and visual explanations.
- Code examples, runnable snippets, notebooks and GitHub project links.
- Labs, assignments, architecture/design documents and case studies.
- Quizzes, flashcards, glossaries and revision sheets.
- Cheat sheets, printable summaries and reference tables.
- YouTube video links, timestamps, transcripts and presentation scripts.
- Curated books, papers, official docs, standards and engineering blogs.
- Changelog/review notes so old material can be updated responsibly.

Do not create an empty folder or placeholder file just to fill this list. Add artifacts as the course needs them.

## 7. First course: System Design — Beginner to Advanced

**Course goal:** build the ability to design, explain, test and evolve scalable, reliable, secure and cost-aware software systems.

### Stage A — Foundations
1. What is system design? Thinking in systems, boundaries and abstractions.
2. Requirements: functional requirements, NFRs, constraints and quality attributes.
3. Back-of-the-envelope estimation: users, QPS, peak load, storage, bandwidth and growth.
4. Internet fundamentals: DNS, IP, TCP/UDP, TLS, HTTP/1.1, HTTP/2, HTTP/3, proxies and CDNs.
5. API design: REST, RPC, pagination, versioning, idempotency and error semantics.
6. Data fundamentals: relational vs document vs key-value, schema, normalization and transactions.
7. Storage internals: indexes, B-trees, LSM trees, WAL, compaction and query plans.

**Foundation project:** URL shortener with assumptions, API contract, data model and capacity estimates.

### Stage B — Building blocks and scaling
8. Caching: cache-aside, read/write-through, TTL, eviction, invalidation, hot keys and stampedes.
9. Traffic management: reverse proxies, L4/L7 load balancing, health checks and autoscaling.
10. Application architecture: monoliths, modular monoliths, services, statelessness, sessions and concurrency.
11. Asynchronous processing: queues, streams, workers, retries, delivery semantics and dead-letter queues.
12. Data at scale: replication, partitioning, sharding, rebalancing, hot partitions and consistency.
13. Search, media and object storage: indexes, uploads, processing pipelines and CDN delivery.
14. Security: authentication, authorization, OAuth/OIDC, TLS, encryption, secrets, rate limits and abuse prevention.

**Intermediate projects:** notification platform, file upload/media pipeline, social feed and search service.

### Stage C — Distributed systems and resilience
15. Partial failure, timeouts, retries, exponential backoff, jitter and circuit breakers.
16. Consistency models, linearizability, eventual consistency, quorum reads/writes and replication lag.
17. Distributed coordination: consensus, Raft, leader election, leases, clocks and split-brain.
18. Messaging patterns: transactional outbox, saga, CQRS, event sourcing and idempotent consumers.
19. Reliability engineering: SLIs, SLOs, SLAs, error budgets and incident management.
20. Observability: structured logs, metrics, distributed tracing, dashboards and alerting.
21. Resilience: bulkheads, backpressure, load shedding, chaos testing, backups and disaster recovery.
22. Multi-region design: replication topology, failover, data residency, latency and cost.

**Advanced project:** multi-region chat/collaboration service with a failure-injection exercise and postmortem.

### Stage D — Architecture mastery
23. Clarify open-ended prompts and scope ambiguous product problems.
24. Estimate traffic, storage, capacity, bottlenecks and cost.
25. Compare architectures and explain trade-offs.
26. Design APIs, schemas, data flows, synchronous and asynchronous paths.
27. Plan security, observability, deployment, migrations and operations.
28. Prepare architecture reviews and defend decisions with evidence.

**Capstone:** one production-style design document, architecture diagrams, ADRs, small working vertical slice, load test, failure drill, cost model and recorded walkthrough.

### Essential case-study library
- URL shortener
- Pastebin / document sharing
- Rate limiter
- Notification service
- News feed / social network
- Chat and presence service
- File storage and sync
- Video upload, transcoding and streaming
- Search/autocomplete
- Ride-hailing / location tracking
- Food delivery / logistics
- Payment processing and ledger
- Ticket booking / inventory reservation
- Metrics/log ingestion pipeline
- Distributed job scheduler
- Multi-tenant SaaS architecture

Every case study should include requirements, assumptions, capacity estimates, APIs, data model, architecture, alternatives, bottlenecks, security, failure modes, operations and cost.

### Learning progression
Do not teach products before concepts. Teach why a cache is needed before choosing Redis; why a stream is needed before choosing Kafka; why orchestration is needed before choosing Kubernetes.

Learners should progress through:
- **Understand:** define and draw the concept.
- **Apply:** choose it for a scenario.
- **Measure:** experiment with actual behavior.
- **Defend:** explain trade-offs and alternatives.

## 8. Technology direction for the website

These are recommendations, not a license to use every library. Claude should check the current official documentation, select compatible stable releases, and avoid redundant dependencies.

| Concern | Preferred direction | Why |
|---|---|---|
| Web framework | Next.js App Router, latest stable supported release | Structured layouts, static generation and React ecosystem |
| React | Latest stable release compatible with Next.js | Server/client component architecture |
| Documentation | Fumadocs + Fumadocs MDX | MDX content, navigation, TOC and docs UI |
| Styling | Tailwind CSS v4 | Fast, token-driven responsive styling |
| Components | shadcn/ui using accessible primitives | Customizable components owned by the repository |
| Icons | lucide-react | Consistent light icon system |
| Animation | Motion for React | Subtle, purposeful interactions |
| Themes | next-themes | Dark/light theme with system preference |
| MDX enhancements | remark-gfm, Shiki/rehype-pretty-code, remark-math + KaTeX where needed | Tables, code, math and rich technical documents |
| Diagrams | Mermaid for authored diagrams; `@xyflow/react` for interactive editable diagrams | Simple static diagrams plus interactive architecture playgrounds |
| Charts | Recharts or Observable Plot, only where data visualization is needed | Accessible and maintainable visual explanations |
| Live code examples | Sandpack for isolated browser-side examples; external GitHub/StackBlitz links for heavier labs | Practical learning without executing arbitrary code on the server |
| Search | Fumadocs static search configuration; Pagefind as a fallback if it better fits the static build | Search must work without a server |
| Slides | Slidev for HTML-first presentations plus PDF/PPTX export | Markdown-authored lessons can become teaching decks |
| Validation | Zod for course metadata and content schemas | Type-safe content catalogue |
| Testing | Vitest + Playwright + axe accessibility checks | Unit, browser and accessibility verification |
| Package tooling | pnpm with a committed lockfile | Reproducible builds |
| CI/CD | GitHub Actions | Validate, export and publish from main |

### Static hosting constraint

The destination is GitHub Pages, so the production site must work as a static export with no Node.js server or database. Use Next.js static export (`output: 'export'`) and configure the repository subpath `/courses` correctly (including asset URLs, links, route generation and trailing slashes). Use only features supported by static export. Do not quietly introduce server actions, runtime API routes, dynamic server search or an auth requirement.

Fumadocs normally supports server-first setups; configure its static mode and browser-side search/index generation. Verify every route and search result from the built `out/` directory before publishing.

Possible future migration: the content architecture must allow deployment to a server-capable host later without moving or rewriting all lesson files.

## 9. Slide and teaching experience

The course website itself is a teaching surface. A lesson may be delivered as a regular article or as a full-screen HTML presentation.

### Presentation modes
- **Study mode:** normal website with navigation, reading width, code blocks, diagrams and notes.
- **Presentation mode:** full-screen slide deck, minimal chrome, keyboard navigation, progress indicator and presenter-friendly controls.
- **Presenter mode:** the HTML slides or lesson remain visible, with an optional instructor webcam bubble over the content.

### Webcam bubble requirements
- Camera is **off by default** and starts only after an explicit user click and browser permission.
- Use the browser `getUserMedia` API for a local live preview. Never upload or persist webcam footage.
- Provide circular crop as the default option, plus rounded-rectangle/square shape options.
- Make it draggable to any corner/position and resizable with sensible minimum/maximum sizes.
- Include show/hide, camera selection where supported, mirror preview, position reset and camera-off controls.
- Use accessible labels, keyboard controls and clear permission/error states.
- The overlay must sit above the lesson/slide layer so it appears in a normal window/screen capture.
- Offer browser Picture-in-Picture only as an optional enhancement when supported; never make the experience depend on it.
- Do not build a recording or streaming server. The instructor may use OBS or another capture/recording app to record the browser output.

### Recording/teaching workflow
1. Open the lesson or HTML deck.
2. Switch to Presentation/Presenter mode.
3. Optionally enable and position the webcam bubble.
4. Start the external capture tool and record the browser/window.
5. Use the deck's presenter notes / lesson outline while explaining.
6. Publish the resulting YouTube video and add its URL, chapters and transcript to the lesson metadata.

The platform should provide an instructor-friendly overlay, not attempt to replace professional screen capture software.

## 10. YouTube channel integration

- Brand the platform as the companion learning hub for [@StackShade](https://www.youtube.com/@StackShade).
- Include a visible channel link and context-appropriate subscribe/watch links.
- Support course playlists, individual video IDs, titles, thumbnails, chapters and transcript/caption URLs in course metadata.
- Use privacy-enhanced YouTube embeds where possible and do not autoplay audio.
- A lesson can be published before its matching video, and a video can exist before the lesson. Show honest states.
- Generate a video production checklist: outline, visual assets, HTML deck, recording, edit, captions, chapter timestamps, description, references and website lesson update.

## 11. Content source and quality policy

Prioritize the following types of source:
1. Standards and RFCs.
2. Official documentation.
3. Research papers and academic course material.
4. First-party engineering blogs and postmortems.
5. High-quality secondary explainers as supplementary material.

Starter reference library:
- [System Design Primer](https://github.com/donnemartin/system-design-primer)
- [System Design 101](https://github.com/ByteByteGoHq/system-design-101)
- [Designing Data-Intensive Applications](https://dataintensive.net/)
- [MIT Distributed Systems course](https://pdos.csail.mit.edu/6.5840/)
- [Google SRE Book](https://sre.google/sre-book/table-of-contents/)
- [Google SRE Workbook](https://sre.google/workbook/table-of-contents/)
- [AWS Well-Architected](https://docs.aws.amazon.com/wellarchitected/)
- [Azure Architecture Center](https://learn.microsoft.com/en-us/azure/architecture/)
- [Cloudflare Learning Center](https://www.cloudflare.com/learning/)
- [MDN HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP)
- [RFC Editor](https://www.rfc-editor.org/)
- [PostgreSQL docs](https://www.postgresql.org/docs/current/)
- [Redis docs](https://redis.io/docs/latest/)
- [Apache Kafka docs](https://kafka.apache.org/documentation/)
- [OpenTelemetry docs](https://opentelemetry.io/docs/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [C4 Model](https://c4model.com/)
- [Structurizr DSL](https://structurizr.com/dsl)
- [Mermaid](https://mermaid.js.org/)
- [Slidev](https://sli.dev/)

Engineering blogs to monitor for real-world case studies:
[Netflix](https://netflixtechblog.com/), [Cloudflare](https://blog.cloudflare.com/), [Uber](https://www.uber.com/blog/engineering/), [Discord](https://discord.com/blog), [Meta](https://engineering.fb.com/), [Stripe](https://stripe.com/blog/engineering), [GitHub](https://github.blog/engineering/) and [Amazon Builders' Library](https://aws.amazon.com/builders-library/).

For all resources: link the original source, describe why it is useful, and add the date checked when information changes frequently. Never copy paid-course material, copyrighted slide decks or third-party diagrams.

## 12. Quality, accessibility and performance

- Target WCAG 2.2 AA where practical.
- Keyboard access for menus, search, quizzes, diagrams and presentation controls.
- Visible focus states, correct heading hierarchy, semantic landmarks and alt text.
- Reduced-motion preference support.
- Responsive layouts from small phones through large presentation displays.
- Fast first paint; defer heavy diagrams, video embeds and playgrounds until needed.
- Avoid huge client bundles and unnecessary animation.
- Use optimized local assets and correctly prefixed GitHub Pages paths.
- Every lesson and slide deck must pass link/build checks.
- Include a useful 404 page, loading states and content-empty states.

## 13. GitHub Pages deployment

Intended URL: `https://stack-shade.github.io/courses/`.

The implementation should:
1. Build the Next.js static site.
2. Export Slidev HTML presentations and downloadable PDF/PPTX versions where configured.
3. Run link, metadata, route and build validation.
4. Upload the static output as a GitHub Pages artifact.
5. Deploy with GitHub Actions on changes to main.
6. Keep generated files out of source control unless explicitly necessary.
7. Provide local development and deployment instructions.

One-time GitHub Pages repository settings may need enabling manually if Actions does not have permission. The published site must be checked after deployment.

## 14. Phased delivery

### Phase 1 — Foundation
- Inspect existing repository and preserve course material.
- Build multi-course catalogue, responsive home page, course overview and learning layout.
- Load System Design content from the repository.
- Add global search, dark/light theme, breadcrumbs, TOC and previous/next links.
- Implement static export and GitHub Pages workflow.
- Ensure no server/database is required.

### Phase 2 — Teaching and learning
- Integrate Slidev HTML decks and downloadable exports.
- Add the lesson video/transcript component.
- Add presenter mode and optional local webcam bubble.
- Add diagrams, math, code highlighting, quizzes and local progress.
- Add resource and glossary interfaces.

### Phase 3 — Interactive depth
- Add React Flow architecture playgrounds and carefully chosen simulations.
- Add selected runnable code labs.
- Add printable revision sheets and flashcards.
- Add per-course search and related-content recommendations.

### Phase 4 — Content scale and polish
- Add new courses using metadata and the folder template.
- Improve accessibility, search ranking, mobile experience, performance and navigation.
- Add YouTube video production workflow and consistent course updates.

## 15. Definition of done

- [ ] Home page clearly communicates StackShade Courses and links to YouTube.
- [ ] Multiple independent courses are supported by data, not hardcoded one-off pages.
- [ ] System Design is the first complete example course.
- [ ] All existing course notes, slides, labs, resources and case studies are accessible.
- [ ] Lesson pages support rich MDX, code, math, diagrams, video and references.
- [ ] HTML presentation mode works and is screen-recording friendly.
- [ ] Optional webcam overlay is local-only, permission-gated and draggable/resizable.
- [ ] Slides can be exported to PDF/PPTX where configured.
- [ ] Search works on the static site.
- [ ] GitHub Pages static export works under `/courses/`.
- [ ] CI validates build and deploys successfully.
- [ ] Mobile, keyboard and accessibility checks pass.
- [ ] README documents setup, content authoring, course creation and deployment.
- [ ] Claude documents meaningful assumptions and extra improvements.
- [ ] No generated website code was committed by the planning step; implementation happens via the Claude prompt.

---

## 16. Repository metadata proposal

Recommended GitHub repository description:

> Open course materials, structured lessons, diagrams, labs, slide decks and learning resources for the StackShade YouTube channel.

Recommended homepage URL after the site has deployed:

`https://stack-shade.github.io/courses/`

Recommended repository topics:
`stackshade`, `youtube`, `education`, `online-learning`, `courses`, `system-design`, `software-engineering`, `computer-science`, `developer-education`, `nextjs`, `mdx`, `fumadocs`, `slidev`, `github-pages`, `learning-resources`.

The YouTube channel itself is linked in the README and site design. Prefer the deployed website as the GitHub homepage URL once it is live; do not point the homepage field at an undeployed URL if that would mislead visitors.
