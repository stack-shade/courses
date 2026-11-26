'use client';

import React, { useEffect, useRef } from 'react';
import { ensureWidgetsLoaded } from '@/lib/visuals';
import { getMermaidInitConfig } from '@/lib/mermaidTheme';
import { useStackShadeTheme } from './AstryxProvider';

let mmdRenderCounter = 0;

export function MarkdownRenderer({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { mode } = useStackShadeTheme();

  // Mount interactive widgets and copy buttons whenever HTML updates
  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    ensureWidgetsLoaded(() => {
      const w = window as Window & {
        StackShadeVisuals?: { mountAll: (scope?: HTMLElement | Document) => void };
      };
      w.StackShadeVisuals?.mountAll(container);
    });

    const codeBlocks = container.querySelectorAll<HTMLElement>('pre[data-code-block="true"]');
    codeBlocks.forEach((pre) => {
      if (pre.querySelector('.ss-copy-btn')) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className =
        'ss-copy-btn absolute right-2.5 top-2.5 rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-0.5 text-[11px] font-medium text-[var(--ink-muted)] hover:text-[var(--ink)]';
      btn.textContent = 'Copy';
      btn.onclick = () => {
        const code = pre.querySelector('code')?.textContent ?? '';
        navigator.clipboard?.writeText(code).then(() => {
          btn.textContent = 'Copied';
          setTimeout(() => {
            btn.textContent = 'Copy';
          }, 1500);
        });
      };
      pre.appendChild(btn);
    });
  }, [html]);

  // Render & re-render Mermaid diagrams with custom OKLCH palette whenever HTML or Light/Dark mode changes
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    let cancelled = false;

    const wraps = container.querySelectorAll<HTMLElement>('.ss-mermaid-wrap');
    if (wraps.length === 0) return;

    // Cache raw Mermaid text before first SVG replacement so theme toggles re-render cleanly
    wraps.forEach((wrap) => {
      if (!wrap.dataset.mermaidSrc) {
        const pre = wrap.querySelector<HTMLElement>('pre.mermaid');
        if (pre) {
          wrap.dataset.mermaidSrc = pre.textContent ?? '';
        }
      }
      if (!wrap.querySelector('.ss-mermaid-toolbar')) {
        const bar = document.createElement('div');
        bar.className = 'ss-mermaid-toolbar';
        bar.innerHTML =
          '<span class="ss-mermaid-label"><span class="ss-live-dot" aria-hidden="true"></span>Architecture Diagram</span>';
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'ss-mermaid-expand';
        toggleBtn.textContent = 'Expand';
        toggleBtn.onclick = () => {
          const expanded = wrap.classList.toggle('is-expanded');
          toggleBtn.textContent = expanded ? 'Close' : 'Expand';
        };
        bar.appendChild(toggleBtn);
        wrap.prepend(bar);
      }
      if (!wrap.querySelector('.ss-mermaid-canvas')) {
        const canvas = document.createElement('div');
        canvas.className = 'ss-mermaid-canvas';
        const pre = wrap.querySelector('pre.mermaid');
        if (pre) canvas.appendChild(pre);
        wrap.appendChild(canvas);
      }
    });

    import('mermaid').then(async (m) => {
      if (cancelled) return;
      m.default.initialize(getMermaidInitConfig(mode));
      for (const wrap of Array.from(wraps)) {
        if (cancelled) return;
        const src = wrap.dataset.mermaidSrc?.trim();
        const canvas = wrap.querySelector<HTMLElement>('.ss-mermaid-canvas');
        if (!src || !canvas) continue;
        try {
          const id = `ss-mmd-${++mmdRenderCounter}`;
          const { svg } = await m.default.render(id, src);
          if (cancelled) return;
          canvas.innerHTML = svg;
          const svgEl = canvas.querySelector('svg');
          if (svgEl) {
            svgEl.removeAttribute('height');
            svgEl.style.maxWidth = '100%';
            svgEl.style.height = 'auto';
          }
        } catch {
          // Leave fallback readable text if syntax fails
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [html, mode]);

  return <div ref={ref} className="ss-prose" dangerouslySetInnerHTML={{ __html: html }} />;
}
