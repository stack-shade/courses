# Page Layouts & Udemy-Inspired Anatomy

Every page uses the 12 tokens in [README.md](README.md) with zero extra visual clutter. Layouts adapt cleanly across **Desktop (`1440px`)**, **Tablet (`768px`)**, and **Mobile (`375px`)**.

---

## 1. Course Overview Page (`/courses/[slug]`)

Inspired directly by Udemy's ultra-clean course landing structure—giving learners immediate clarity on scope, outcomes, curriculum depth, video status, and downloadable materials.

```text
+-----------------------------------------------------------------------------+
| [StackShade]   Courses   Resources   [Search Cmd+K]    [Theme]  [YouTube ↗] |
+-----------------------------------------------------------------------------+
| DARK/ACCENTED HERO BAND (max-width: 1200px)                                 |
| Breadcrumb: Courses / System Design                                         |
| Title: System Design: Beginner to Advanced                                  |
| Subtitle: From first principles & capacity math to distributed consensus...   |
| Meta: [Beginner → Advanced] · 9 Modules · 40 Lessons · 16 Case Studies      |
+------------------------------------------------------+----------------------+
| MAIN COLUMN (65% width, max 760px)                   | STICKY COURSE CARD   |
|                                                      | (340px right rail)   |
| [What You'll Learn — 2-col checkmark box]            | +------------------+ |
| ✓ Decompose open prompts   ✓ Estimate QPS/storage    | | [Course Visual]  | |
| ✓ Design replication/shard ✓ Reason about CAP/Raft   | |  16:9 SVG Motif  | |
|                                                      | +------------------+ |
| [Course Content — Collapsible Module Accordions]     | [Continue Learning]  |
|  ▾ Module 0: Foundations & Reasoning (4 lessons)     | [Download All HTML   |
|    ▶ 01 · Thinking in Systems     [Draft] [Slides]   |  Slides (.zip)]      |
|    ▶ 02 · Requirements & NFRs     [Draft] [Slides]   | [Watch Playlist ↗]   |
|    🧪 Lab 01 · Capacity Math      [Lab]   [30m]      |                      |
|  ▸ Module 1: Networking & APIs    (5 lessons)        | Includes:            |
|  ▸ Module 2: Data & Storage       (5 lessons)        | • 40 Structured Labs |
|  ...                                                 | • Animated HTML PPTs |
|                                                      | • 45+ Mermaid Flows  |
| [16 Case Studies Grid]   [Prerequisites & Audience]  | • Open Resource Hub  |
+------------------------------------------------------+----------------------+
```

### Responsive Rules
- **Tablet / Mobile (`< 1024px`):** The sticky right card moves directly below the Hero Banner as a compact CTA bar (`Start Learning` + `Download Slides`) before *What You'll Learn*.

---

## 2. Learning Workspace (`/courses/[slug]/learn/[lesson]`)

Designed like Udemy's focused player + documentation tabs so both **YouTube viewers** and **text/diagram learners** have an effortless experience.

```text
+-----------------------------------------------------------------------------+
| [☰ Sidebar]  System Design / Module 0 / 01 · Thinking in Systems   [Presenter] [Theme] |
+--------------------------+--------------------------------------------------+
| SYLLABUS SIDEBAR (280px) | CENTRAL LEARNING STAGE (fluid, centered 72ch)    |
|                          |                                                  |
| Search in course...      | +----------------------------------------------+ |
|                          | | 16:9 VIDEO / INTERACTIVE STAGE               | |
| ▾ Module 0: Foundations  | | (YouTube privacy-enhanced embed when videoId | |
|   ● 01 Thinking in Sys   | |  exists; else clean "Preview Slides / Visual"  | |
|   ○ 02 Requirements      | |  starter banner — never an empty broken box) | |
|   ○ 03 Estimation + Lab  | +----------------------------------------------+ |
|   ○ 04 Bottlenecks       |                                                  |
|                          | [Notes & Diagrams] [Animations] [Slides] [Quiz]  |
| ▸ Module 1: Networking   | ------------------------------------------------ |
| ▸ Module 2: Storage      |                                                  |
| ...                      | ## 1. Start with the problem, not the boxes      |
|                          | Clean prose (68ch max)...                        |
| [Progress: 3 / 40]       | +----------------------------------------------+ |
| [Reset Local Progress]   | | Mermaid / Animated Step Diagram + Caption    | |
|                          | +----------------------------------------------+ |
|                          |                                                  |
|                          | Worked Example · Trade-off Table · Retrieval     |
|                          | ------------------------------------------------ |
|                          | [← Previous Lesson]             [Next Lesson →] |
+--------------------------+--------------------------------------------------+
```

### Tab Bar Behavior (Udemy-Inspired Clarity)
1. **Notes & Diagrams (Default):** Complete written article, Mermaid diagrams, worked math, callouts, and inline interactive widgets.
2. **Visualizations:** Dedicated view of the lesson's interactive simulations/animations with step controls and parameter sliders.
3. **Slides & Downloads:** Embedded HTML slide deck preview + one-click **Open Full-Screen Presenter Mode**, **Download Standalone `.html` Deck**, and **Download `.pptx` / `.pdf`**.
4. **Resources:** Curated RFCs, official docs, research papers, and engineering blog links specific to this lesson.
5. **Lab & Quiz:** Practical assignment checklist + active-recall questions with hint/answer toggles.

---

## 3. Presenter & Screen-Recording Mode (`/present/[slug]/[deck]`)

Built specifically so you can record clean YouTube videos right out of the browser without switching apps:

- **16:9 Centered Slide Stage:** Uses Dark Mode (`#0F141D` + `#A3E635` lime) by default with instant `T` key toggle to Light Mode.
- **Minimal Bottom Control Pill (Auto-hides after 3s idle):**
  `[← 4 / 12 →]  [Step]  [Overview (G)]  [Notes (N)]  [Camera: Off]  [Download .html]`
- **Optional Local Webcam Bubble:**
  - Camera is **OFF by default**; starts only on explicit user click (`getUserMedia({ video: true, audio: false })`).
  - Circular crop (`160px–260px` resizable), draggable to any corner, mirror toggle, show/hide toggle, zero server upload.
  - Sits above the slide stage so OBS / screen capture records the exact composition cleanly.

---

## 4. Catalogue, Search & Glossary Pages

- **Catalogue (`/courses`):** Clean 3-column grid (2-col tablet, 1-col mobile). Filter bar: `Topic`, `Level`, `Status`. Each card displays cover motif, level badge, module/lesson count, honest status (`In Progress` / `Planned`), and `Explore Course →`.
- **Global Search (`Cmd+K` / `/courses/search`):** Instant offline search across lesson titles, headings, glossary terms, case studies, and resource links, grouped by type (`Lesson`, `Diagram`, `Case Study`, `Glossary`).
- **Glossary (`/courses/[slug]/glossary`):** A–Z filterable table with concise working definitions and direct links to the lesson where each term first appears.
