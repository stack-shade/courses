# Downloadable Animated HTML Slides & PPT Export Spec

Learners can view every deck live in browser **Presenter Mode** or **download a standalone, single-file `.html` presentation** that works completely offline with clean step animations, dark/light theme switching, keyboard controls, and interactive visualizations.

---

## 1. Why Standalone `.html` Decks First?

| Format | Offline Portable? | Step Animations? | Interactive Visualizations? | Editable Text? | Primary Use |
|---|---|---|---|---|---|
| **Standalone `.html` Deck** | Yes (1 file, double-click) | Yes (smooth CSS/JS) | Yes (inline SVG + micro-sims) | Source is Markdown | **Primary download** for learners & offline review |
| **Web Presenter Mode** | Online / static site | Yes | Yes + Webcam overlay | Source is Markdown | YouTube teaching & live workshops |
| **PDF Export** | Yes | No (flattened frames) | Static snapshots | No | Printing, tablet markup, archiving |
| **PPTX Export** | Yes | Basic / static frames | Static snapshots | Optional (`editable` mode) | Classroom reuse in PowerPoint/Keynote |

---

## 2. Authoring Syntax in `slides/NN-topic.md`

Write slides once in clean Markdown under `courses/<slug>/slides/`. Use portable HTML comments so every file stays readable on GitHub, compatible with Marp/Slidev tooling, and cleanly compilable to single-file HTML:

```markdown
---
title: "03 · Back-of-the-Envelope Capacity Estimation"
slug: "03-capacity-estimation"
lesson: "../lessons/02-requirements-and-capacity.md"
theme: "dark"
aspect: "16:9"
---

# Capacity Estimation
## Turn vague product prompts into defensible numbers

StackShade · System Design · Module 0

<!-- note: Start by explaining why estimation prevents over-engineering on day 1. -->

---

# 1. Average vs. Peak QPS

Suppose **5M DAU**, **20 requests/user/day**, **5× peak burst**:

<!-- step -->
- Daily requests = `5,000,000 × 20 = 100M / day`
<!-- step -->
- Average QPS = `100,000,000 ÷ 86,400 ≈ 1,157 QPS`
<!-- step -->
- Peak QPS = `1,157 × 5 ≈ 5,785 QPS`

<!-- note: Emphasize that 86,400 seconds/day is the one constant worth memorizing. -->

---

# 2. Interactive Capacity Explorer

<!-- anim: qps-storage-calculator -->

Tweak DAU, peak multiplier, and payload size to inspect QPS & egress live.
```

### Supported Directives
- `---` — Slide separator.
- `<!-- step -->` — Incremental animation reveal (reveals next block/bullet on `→` or `Space`).
- `<!-- note: ... -->` — Instructor speaker note (hidden on stage; visible in Notes drawer via `N`).
- `<!-- anim: <widget-id> -->` — Injects a portable Tier-2 interactive SVG/JS simulation inline on the slide.
- `<!-- diagram: ../diagrams/<file>.mmd -->` — Embeds a course `.mmd` diagram directly without duplicating Mermaid code.

---

## 3. Single-File HTML Export Architecture

When exported to `downloads/<deck-slug>.html`, each compiled HTML file is completely self-contained (zero external CDN calls required at runtime once built):

```html
<!doctype html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>StackShade · 03 Capacity Estimation</title>
  <style>
    /* 1. Embedded 12 Design System tokens (Light + Dark) */
    /* 2. 16:9 responsive stage scaling + clean typography */
    /* 3. Fragment step transitions (160ms cubic-bezier) + reduced-motion guard */
  </style>
</head>
<body>
  <main id="deck" aria-live="polite">
    <!-- Pre-rendered slide sections, inline SVGs, and Tier-2 interactive widgets -->
  </main>
  <aside id="notes-drawer" hidden><!-- Speaker notes per slide --></aside>
  <nav id="deck-hud">
    <!-- Prev · Slide 1/12 · Next · Theme (T) · Grid (G) · Notes (N) · Back to Lesson -->
  </nav>
  <script>
    /* ~3 KB keyboard/touch deck controller + SVG/widget initializers */
  </script>
</body>
</html>
```

### Built-In Offline Deck Controls
| Key | Action |
|---|---|
| `→` / `Space` / `Click` | Advance next animation step or next slide |
| `←` / `Backspace` | Step back / previous slide |
| `G` | Toggle **Slide Overview Grid** (jump to any slide) |
| `N` | Toggle **Speaker Notes Drawer** |
| `T` | Toggle **Dark (`#0F141D` + `#A3E635`) ↔ Light (`#FFFFFF`)** |
| `F` | Toggle Browser Fullscreen (screen recording ready) |
| `Esc` | Exit grid / fullscreen / drawer |

---

## 4. Packaging & Distribution Policy

- **Source of truth:** Only Markdown slide sources (`courses/<slug>/slides/*.md`) and shared widget definitions live in Git.
- **Generated downloads:** Single-file `.html` decks, `.zip` slide bundles (`system-design-html-slides.zip`), `.pdf`, and `.pptx` artifacts are generated during CI / export build into `downloads/` or `/public/downloads/` so Git history never bloats with generated binary files.
- **Honest labeling:** Every download card states clearly:
  - *"HTML Deck (.html) — Full step animations & interactive visuals, works offline"*
  - *"PDF / PPTX — Static/printable snapshot (interactive sliders disabled)"*
