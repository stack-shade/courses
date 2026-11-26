# StackShade Design System (Astryx + Impeccable OKLCH Spec)

> **Foundation:** Built on **Meta Astryx (`@astryxdesign/core` + `@astryxdesign/theme-neutral`)** and audited against **[`impeccable.style`](https://impeccable.style/)** craft standards: perceptual OKLCH tokens, zero pure `#fff`/`#000` clichés, **Figtree** geometric typography paired with tabular monospace, and flat editorial hierarchy.

---

## 1. Design Principles (Impeccable + Astryx + Udemy Clarity)

1. **Zero AI-slop defaults:** No generic `Inter` font, no `#4f46e5` indigo-purple clichés, no nested cards-inside-cards, and no pure `#ffffff` / `#000000`.
2. **Perceptual OKLCH harmony:** Light and dark modes share calibrated hue/chroma relationships—warm paper light reading surface tinted gently toward StackShade lime (`124°`), and deep slate-midnight dark surface for presentations and screen recording.
3. **Typography discipline (`/impeccable typeset`):**
   - **Display & Body:** **Figtree** (vendored locally via `@astryxdesign/theme-neutral/fonts.css`, weights `400, 500, 600, 700`).
   - **Code, QPS Math & Badges:** `ui-monospace` / `JetBrains Mono` with `font-variant-numeric: tabular-nums`.
   - **Optimal measure:** Prose articles strictly capped at `65ch` (`line-height: 1.66` light / `1.70` dark).
4. **Astryx Component Architecture:** Accessible primitives from `@astryxdesign/core` (`Theme`, `LinkProvider`, `Button`, `Card`, `Badge`, `Heading`, `Text`, `CollapsibleGroup`, `Collapsible`, `TabList`, `Tab`, `ProgressBar`, `Divider`, `Kbd`).

---

## 2. Calibrated OKLCH Design Tokens

```css
:root {
  /* Surfaces & Ink (Tinted toward StackShade 124deg / 248deg, zero pure #fff/#000) */
  --bg: oklch(98.1% 0.004 124);
  --surface: oklch(95.4% 0.006 124);
  --card-bg: oklch(99.3% 0.002 124);
  --ink: oklch(18.5% 0.015 248);
  --ink-muted: oklch(44.5% 0.014 248);
  --border: oklch(88.8% 0.008 242);

  /* Brand Accent (Emerald-forest on light for >6:1 AA; chartreuse-lime on dark) */
  --accent: oklch(44.5% 0.145 142);
  --accent-ink: oklch(98.5% 0.004 142);

  /* Semantic Statuses */
  --status-ok: oklch(45% 0.14 148);
  --status-warn: oklch(55% 0.15 70);
  --status-err: oklch(50% 0.19 25);

  /* Typography */
  --font-sans: "Figtree", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, monospace;
  --radius: 6px;
}

[data-theme="dark"] {
  --bg: oklch(16.8% 0.015 252);
  --surface: oklch(20.6% 0.017 252);
  --card-bg: oklch(22.5% 0.018 252);
  --ink: oklch(94.5% 0.006 240);
  --ink-muted: oklch(69% 0.013 245);
  --border: oklch(29.5% 0.018 250);
  --accent: oklch(87.2% 0.205 124);
  --accent-ink: oklch(17% 0.02 124);
  --status-ok: oklch(75% 0.17 148);
  --status-warn: oklch(82% 0.15 80);
  --status-err: oklch(70% 0.18 22);
}
```

---

## 3. Component Mapping (`@astryxdesign/core`)

| UI Role | Astryx Component | Where Used |
|---|---|---|
| Theme & Router Context | `Theme`, `LinkProvider`, `neutralTheme` | `AstryxProvider.tsx` (`apps/web`) |
| Actions & CTAs | `Button`, `Kbd` | `TopNav`, Hero, Course Sticky Card, Slide HUD |
| Containers | `Card`, `Divider` | Featured Course, Overview Outcomes, Practice Cards |
| Typography | `Heading`, `Text`, `Badge` | All pages, metadata, status & level tags |
| Course Syllabus | `CollapsibleGroup`, `Collapsible` | `CurriculumAccordion.tsx` |
| Workspace & Arena Tabs | `TabList`, `Tab` | `LearningWorkspace.tsx`, `PracticeArena.tsx` |
| Progress | `ProgressBar` | Lesson Sidebar completion meter |

---

## Related Docs

- [Page Layouts & Udemy-Inspired Wireframes](page-layouts.md)
- [Slide Grid, Mermaid Grammar & Animation Spec](slide-and-animation-spec.md)
- [Content Authoring Playbook](../guides/content-authoring-playbook.md)
- [Downloadable Animated HTML Slides Spec](../guides/downloadable-html-slides.md)
