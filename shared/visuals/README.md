# Shared Interactive Visualizations & Animations (`shared/visuals/`)

Zero-dependency SVG + HTML/JS micro-simulations (`Tier 2` & `Tier 1` steppers) styled exclusively with the 12 core CSS tokens from [`shared/design-system/README.md`](../design-system/README.md).

Because [`widgets.js`](widgets.js) has zero external dependencies, the exact same interactive widgets run inside:
- Standalone downloaded `.html` slide decks (`courses/*/downloads/*.html`)
- Offline interactive playgrounds (`courses/*/downloads/index.html`)
- The future Next.js web application (`apps/web/`)

## Usage

Include `widgets.js` and mount any widget via `data-stackshade-anim="<widget-id>"`:

```html
<div class="ss-widget" data-stackshade-anim="sim-capacity-calculator"></div>
<script>StackShadeVisuals.mountAll();</script>
```
