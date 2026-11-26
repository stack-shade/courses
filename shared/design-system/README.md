# StackShade Minimal Design System

> **Goal:** The simplest possible, high-clarity educational design system inspired by Udemy's clean course structure and technical reading precision. Zero visual bloat, 12 core CSS tokens, 9 UI primitives, and built-in dark presentation mode.

---

## 1. Design Philosophy

1. **Content over chrome:** Every pixel serves comprehension—clear hierarchy, generous whitespace, hairline dividers, and zero decorative shadows or glassmorphism.
2. **Udemy-grade scanability:** A learner should immediately understand *what they will learn*, *how long it takes*, *what comes next*, and *what artifacts are downloadable* (notes, interactive visuals, HTML slides, code labs).
3. **Dual-surface discipline:**
   - **Study Mode (Light-first default):** Crisp white canvas (`#FFFFFF`) and soft slate surface (`#F8FAFC`) for sustained reading without eye fatigue.
   - **Dark / Teaching Mode:** Deep midnight ink (`#0F141D`) with StackShade lime (`#A3E635`) accent—engineered for screen recording, YouTube tutorials, and full-screen HTML slide decks.
4. **Minimal token budget:** Twelve core CSS variables drive every component, diagram, and downloadable HTML slide deck.

---

## 2. Core Design Tokens (`12 Tokens`)

```css
:root {
  /* 1–5: Neutral Surfaces, Ink & Hairlines (Udemy-clean light default) */
  --bg: #ffffff;
  --surface: #f8fafc;
  --ink: #0f172a;
  --ink-muted: #475569;
  --border: #e2e8f0;

  /* 6–7: Single Brand Accent */
  --accent: #4f46e5;
  --accent-ink: #ffffff;

  /* 8–10: Honest Semantic Statuses (max 3) */
  --status-ok: #15803d;     /* Published / Passed / Healthy */
  --status-warn: #b45309;   /* Draft / Warning / Degraded */
  --status-err: #b91c1c;    /* Failure / Bottleneck / Error */

  /* 11–12: Typography & Shape */
  --font-sans: "Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  --radius: 6px;
}

[data-theme="dark"] {
  --bg: #0f141d;
  --surface: #161c28;
  --ink: #f1f5f9;
  --ink-muted: #94a3b8;
  --border: #252f42;
  --accent: #a3e635;        /* StackShade teaching lime */
  --accent-ink: #0f141d;
  --status-ok: #4ade80;
  --status-warn: #fbbf24;
  --status-err: #f87171;
}
```

### Usage Rules
- **Never** invent extra background grays or brand colors outside `--bg`, `--surface`, and `--accent`.
- Use `--border` (`1px solid var(--border)`) instead of drop shadows to separate cards, tables, and diagram frames.
- Only one primary filled button (`background: var(--accent); color: var(--accent-ink)`) per viewport section.

---

## 3. Typography & Spacing Scale

### Strict 5-Step Type Scale

| Role | Size / Line-Height | Weight | Notes |
|---|---|---|---|
| **Course / Hero Title** | `32px / 1.15` (`2rem`) | `700` | Tracking `-0.02em` |
| **Section / Lesson H2** | `24px / 1.25` (`1.5rem`) | `600` | `margin-top: 40px` in articles |
| **Subsection H3** | `18px / 1.35` (`1.125rem`) | `600` | Clear scannable breaks |
| **Body / Article Prose** | `16px / 1.65` (`1rem`) | `400` | Max line width `68ch` |
| **Meta / Badges / Captions** | `13px / 1.4` (`0.8125rem`) | `500` | Module counts, durations, status |
| **Code & Equations** | `14px / 1.55` (`0.875rem`) | `400` | `--font-mono`; inline pills use `--surface` |

### 4px Spacing Scale
Use only multiples from this fixed set: `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`.

---

## 4. Minimal Component Inventory (`9 Primitives`)

| # | Component | Purpose | Minimal Spec |
|---|---|---|---|
| 1 | **Top Utility Bar** | Global navigation & quick actions | `56px` height, sticky, brand mark, `Courses`, `Search (Cmd+K)`, theme toggle, YouTube link |
| 2 | **Course Hero + Sticky Action Card** | Udemy-clean landing banner | Left: title, outcomes, metadata; Right (`340px`): progress bar, `Start / Continue`, `Download All HTML Slides` |
| 3 | **Module Curriculum Accordion** | Collapsible syllabus map | Header (`Module N · Title · Lessons · Hours`); rows show type icon, title, duration, `Video` / `HTML Deck` / `Lab` pills |
| 4 | **Split Learning Workspace** | Focused study view | Collapsible `280px` left syllabus + fluid central stage (`72ch` prose or 16:9 video) + desktop TOC |
| 5 | **Video Stage + Chapter Strip** | YouTube lesson integration | Privacy-enhanced `youtube-nocookie.com` 16:9 embed + clickable chapter timestamps; honest "Recording planned" placeholder when unlinked |
| 6 | **Article Prose, Math & Callout** | Deep technical notes | Standard GFM tables, KaTeX formulas, 3 semantic callouts (`Mental Model`, `Trade-Off`, `Pitfall`) using left 3px border |
| 7 | **Diagram & Interactive Sim Frame** | Mermaid + live visualizations | `1px solid var(--border)` frame, concise caption, optional `Step / Reset / Parameter` controls, always includes static fallback |
| 8 | **HTML Slide Deck & Presenter Shell** | Teaching & offline download | 16:9 stage, keyboard hints, speaker notes drawer, **Download `.html`** button, optional local-only circular webcam bubble |
| 9 | **Retrieval Quiz & Lab Checklist** | Active recall & tracking | Expandable hints/answers + interactive checkboxes persisted only in `localStorage` |

---

## 5. Accessibility & Motion Rules

- **Contrast:** Minimum `4.5:1` for body text and `3:1` for large text/borders (WCAG 2.2 AA).
- **Focus rings:** `2px solid var(--accent)` with `2px` offset on all keyboard-focusable controls.
- **Reduced motion:** Wrap all slide/diagram transitions in `@media (prefers-reduced-motion: reduce)` and snap state changes immediately when active.
- **Honest states:** Never show fake student ratings, inflated learner counters, or "Completed" badges on planned/unwritten lessons.

---

## Related Design Docs

- [Page Layouts & Udemy-Inspired Wireframes](page-layouts.md)
- [Slide Grid, Mermaid Grammar & Animation Spec](slide-and-animation-spec.md)
- [Content Authoring Playbook](../guides/content-authoring-playbook.md)
- [Downloadable Animated HTML Slides Spec](../guides/downloadable-html-slides.md)
