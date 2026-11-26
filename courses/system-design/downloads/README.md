# Presentation Downloads & Slide Bundles

All course slides are authored once in Markdown under [`../slides/`](../slides/) and compiled into multiple learner-friendly formats without maintaining duplicate slide content.

See [Downloadable Animated HTML Slides Spec](../../../shared/guides/downloadable-html-slides.md) for the full technical architecture.

---

## Available Formats

1. **Standalone Animated HTML Deck (`.html`) — Recommended**
   - Single self-contained file per lesson that works completely offline in any browser.
   - Preserves smooth step-by-step animations (`<!-- step -->`), Mermaid diagrams, interactive Tier-2 micro-simulations, speaker notes (`N`), overview grid (`G`), and light/dark switching (`T`).
2. **All-Slides Offline Bundle (`system-design-html-slides.zip`)**
   - Packages every published module's standalone `.html` deck into a single download for offline study.
3. **PDF & PPTX Exports (`.pdf` / `.pptx`)**
   - Static snapshot exports for printing, tablet annotation, or classroom PowerPoint reuse. Interactive sliders and step animations are flattened in PDF/PPTX.

---

## Deck Status

| Episode | Markdown Source | HTML Deck (`downloads/`) | PPTX / PDF | Status |
|---|---|---|---|---|
| **EP01** | [01-course-kickoff.md](../slides/01-course-kickoff.md) | `01-course-kickoff.html` | `01-course-kickoff.pptx` / `.pdf` | Source ready (built on CI deploy) |
| **EP02** | [02-requirements-and-estimation.md](../slides/02-requirements-and-estimation.md) | `02-requirements-and-estimation.html` | `02-requirements-and-estimation.pptx` / `.pdf` | Source ready (built on CI deploy) |
| **EP03–40** | See [YouTube & Slides Plan](../youtube-and-slides-plan.md) | Planned | Planned | Planned |

> Generated `.html`, `.pdf`, and `.pptx` artifacts are produced during build/CI deployment rather than committed as binary blobs in Git. Meanwhile, you can open any Markdown source in [`../slides/`](../slides/) directly.
