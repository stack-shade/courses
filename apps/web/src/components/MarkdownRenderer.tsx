'use client';

import React, { useEffect, useRef } from 'react';
import { withBasePath } from '@/lib/paths';

declare global {
  interface Window {
    StackShadeVisuals?: {
      mountAll: (scope?: HTMLElement | Document) => void;
    };
  }
}

function ensureWidgetsLoaded(cb: () => void) {
  if (typeof window === 'undefined') return;
  if (window.StackShadeVisuals) {
    cb();
    return;
  }
  const existing = document.getElementById('ss-widgets-script');
  if (existing) {
    existing.addEventListener('load', cb, { once: true });
    return;
  }
  const s = document.createElement('script');
  s.id = 'ss-widgets-script';
  s.src = withBasePath('/visuals/widgets.js');
  s.onload = cb;
  document.body.appendChild(s);
}

export function MarkdownRenderer({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    // 1. Mount interactive visualizations
    ensureWidgetsLoaded(() => {
      window.StackShadeVisuals?.mountAll(container);
    });

    // 2. Render Mermaid diagrams cleanly
    const mermaidNodes = container.querySelectorAll<HTMLElement>('pre.mermaid');
    if (mermaidNodes.length > 0) {
      import('mermaid').then((m) => {
        const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'neutral';
        m.default.initialize({ startOnLoad: false, theme });
        m.default.run({ nodes: Array.from(mermaidNodes) }).catch(() => {});
      });
    }

    // 3. Add copy buttons on code blocks
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

  return <div ref={ref} className="ss-prose" dangerouslySetInnerHTML={{ __html: html }} />;
}
