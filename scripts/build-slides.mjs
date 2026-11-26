#!/usr/bin/env node
/**
 * Compiles portable Markdown slide decks (`courses/<slug>/slides/*.md`) into:
 *   1) Standalone single-file animated `.html` decks in `courses/<slug>/downloads/`
 *   2) Offline Course Presentation & Interactive Visuals Hub (`downloads/index.html`)
 *
 * Zero external npm dependencies required. Works completely offline once built.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const WIDGETS_JS = fs.readFileSync(path.join(REPO_ROOT, 'shared/visuals/widgets.js'), 'utf8');

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta = {};
  let currentKey = null;
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (kv) {
      currentKey = kv[1];
      let val = kv[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      meta[currentKey] = val;
    }
  }
  return { meta, body: match[2] };
}

function splitSlides(body) {
  const lines = body.split(/\r?\n/);
  const slides = [];
  let buf = [];
  let inFence = false;
  for (const line of lines) {
    if (line.trim().startsWith('```')) inFence = !inFence;
    if (!inFence && line.trim() === '---') {
      slides.push(buf.join('\n').trim());
      buf = [];
    } else {
      buf.push(line);
    }
  }
  if (buf.join('\n').trim()) slides.push(buf.join('\n').trim());
  return slides;
}

function inlineMd(text) {
  let out = escapeHtml(text);
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return out;
}

function renderMarkdownSlide(rawSlide, slideDir) {
  let notes = [];
  let text = rawSlide.replace(/<!--\s*note:\s*([\s\S]*?)-->/g, (_, n) => {
    notes.push(n.trim());
    return '';
  });

  // Inline external diagrams <!-- diagram: ../diagrams/foo.mmd -->
  text = text.replace(/<!--\s*diagram:\s*([^\s>]+)\s*-->/g, (_, relPath) => {
    const resolved = path.resolve(slideDir, relPath);
    if (fs.existsSync(resolved)) {
      const mmd = fs.readFileSync(resolved, 'utf8').trim();
      return '\n```mermaid\n' + mmd + '\n```\n';
    }
    return `\n> Diagram missing: ${relPath}\n`;
  });

  const lines = text.split(/\r?\n/);
  const html = [];
  let i = 0;
  let stepPending = false;
  const clsAttr = () => {
    if (stepPending) {
      stepPending = false;
      return ' class="ss-step"';
    }
    return '';
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) { i++; continue; }

    if (/^<!--\s*step\s*-->$/.test(trimmed)) {
      stepPending = true;
      i++;
      continue;
    }

    const animMatch = trimmed.match(/^<!--\s*anim:\s*([A-Za-z0-9_-]+)\s*-->$/);
    if (animMatch) {
      html.push(`<div${clsAttr()} data-stackshade-anim="${escapeHtml(animMatch[1])}"></div>`);
      i++;
      continue;
    }

    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      const code = codeLines.join('\n');
      if (lang === 'mermaid') {
        html.push(`<div${clsAttr()}><div class="ss-mermaid-box"><pre class="mermaid">${escapeHtml(code)}</pre></div></div>`);
      } else {
        html.push(`<pre${clsAttr()}><code class="lang-${escapeHtml(lang || 'text')}">${escapeHtml(code)}</code></pre>`);
      }
      continue;
    }

    const hMatch = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (hMatch) {
      const lvl = hMatch[1].length;
      html.push(`<h${lvl}${clsAttr()}>${inlineMd(hMatch[2])}</h${lvl}>`);
      i++;
      continue;
    }

    if (trimmed.startsWith('|')) {
      const tbl = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tbl.push(lines[i].trim());
        i++;
      }
      const rows = tbl.filter((r) => !/^\|[\s:|-]+\|$/.test(r));
      const thead = rows[0]
        ? '<thead><tr>' + rows[0].slice(1, -1).split('|').map((c) => `<th>${inlineMd(c.trim())}</th>`).join('') + '</tr></thead>'
        : '';
      const tbody = '<tbody>' + rows.slice(1).map((r) =>
        '<tr>' + r.slice(1, -1).split('|').map((c) => `<td>${inlineMd(c.trim())}</td>`).join('') + '</tr>'
      ).join('') + '</tbody>';
      html.push(`<table${clsAttr()}>${thead}${tbody}</table>`);
      continue;
    }

    if (/^[-*]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
      const ordered = /^\d+\.\s+/.test(trimmed);
      const tag = ordered ? 'ol' : 'ul';
      const items = [];
      while (i < lines.length) {
        const cur = lines[i].trim();
        if (/^<!--\s*step\s*-->$/.test(cur)) {
          stepPending = true;
          i++;
          continue;
        }
        const m = ordered ? cur.match(/^\d+\.\s+(.*)$/) : cur.match(/^[-*]\s+(.*)$/);
        if (!m) break;
        items.push(`<li${clsAttr()}>${inlineMd(m[1])}</li>`);
        i++;
      }
      html.push(`<${tag}>${items.join('')}</${tag}>`);
      continue;
    }

    if (trimmed.startsWith('>')) {
      const q = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        q.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      html.push(`<blockquote${clsAttr()}>${inlineMd(q.join(' '))}</blockquote>`);
      continue;
    }

    html.push(`<p${clsAttr()}>${inlineMd(trimmed)}</p>`);
    i++;
  }

  return { html: html.join('\n'), notes: notes.join('\n\n') };
}

const ICONS = {
  prev: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
  next: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  grid: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>',
  notes: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8"/><path d="M8 13h6"/></svg>',
  sun: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
  moon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
  camOn: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>',
  camOff: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.66 6H14a2 2 0 0 1 2 2v2.5l5.248-3.062A.5.5 0 0 1 22 7.87v8.196"/><path d="M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2"/><path d="m2 2 20 20"/></svg>',
  fs: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="m21 3-7 7"/><path d="m3 21 7-7"/><path d="M9 21H3v-6"/></svg>',
  fsExit: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14h6v6"/><path d="m3 21 7-7"/><path d="M20 10h-6V4"/><path d="m21 3-7 7"/></svg>',
  lesson: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>',
  decks: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',
};

function buildStandaloneDeckHtml({ title, lessonRel, slidesHtml, notesList, defaultTheme }) {
  const theme = defaultTheme === 'light' ? 'light' : 'dark';
  return `<!doctype html>
<html lang="en" data-theme="${theme}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(title)} · StackShade Slides</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'" />
  <style>
    :root {
      --bg:oklch(98.1% 0.004 124);--surface:oklch(95.4% 0.006 124);--ink:oklch(18.5% 0.015 248);--ink-muted:oklch(44.5% 0.014 248);--border:oklch(88.8% 0.008 242);
      --accent:oklch(44.5% 0.145 142);--accent-ink:oklch(98.5% 0.004 142);--status-ok:oklch(45% 0.14 148);--status-warn:oklch(55% 0.15 70);--status-err:oklch(50% 0.19 25);
      --font-sans:"Figtree",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;--font-mono:ui-monospace,"SF Mono","JetBrains Mono",Menlo,monospace;
      --radius:6px;--ease-out:cubic-bezier(0.22,1,0.36,1);
    }
    [data-theme="dark"] {
      --bg:oklch(16.8% 0.015 252);--surface:oklch(20.6% 0.017 252);--ink:oklch(94.5% 0.006 240);--ink-muted:oklch(69% 0.013 245);--border:oklch(29.5% 0.018 250);
      --accent:oklch(87.2% 0.205 124);--accent-ink:oklch(17% 0.02 124);--status-ok:oklch(75% 0.17 148);--status-warn:oklch(82% 0.15 80);--status-err:oklch(70% 0.18 22);
    }
    *{box-sizing:border-box}
    body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--font-sans);height:100vh;overflow:hidden;display:flex;flex-direction:column}
    .ss-stage{flex:1;display:flex;align-items:center;justify-content:center;padding:24px 28px 76px;overflow:auto;perspective:1200px}
    .ss-slide{display:none;width:100%;max-width:1080px;min-height:min(620px,78vh);padding:40px 48px;border:1px solid var(--border);border-radius:12px;background:var(--bg);flex-direction:column;justify-content:center;box-shadow:0 12px 32px rgba(0,0,0,.08)}
    [data-theme="dark"] .ss-slide{box-shadow:0 16px 40px rgba(0,0,0,.35)}
    .ss-slide.active{display:flex;animation:ssSlideNext 280ms var(--ease-out) both}
    .ss-slide.active.dir-prev{animation:ssSlidePrev 280ms var(--ease-out) both}
    @keyframes ssSlideNext{from{opacity:0;transform:translateX(26px) scale(.988)}to{opacity:1;transform:none}}
    @keyframes ssSlidePrev{from{opacity:0;transform:translateX(-26px) scale(.988)}to{opacity:1;transform:none}}
    @keyframes ssRise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
    .ss-slide.active > :not(.ss-step){animation:ssRise 280ms var(--ease-out) both}
    .ss-slide.active > :not(.ss-step):nth-child(2){animation-delay:45ms}
    .ss-slide.active > :not(.ss-step):nth-child(3){animation-delay:90ms}
    .ss-slide.active > :not(.ss-step):nth-child(4){animation-delay:135ms}
    .ss-slide.active > :not(.ss-step):nth-child(5){animation-delay:180ms}
    .ss-slide.active > ul > li:not(.ss-step),.ss-slide.active > ol > li:not(.ss-step){animation:ssRise 260ms var(--ease-out) both}
    .ss-slide.active > ul > li:nth-child(2),.ss-slide.active > ol > li:nth-child(2){animation-delay:60ms}
    .ss-slide.active > ul > li:nth-child(3),.ss-slide.active > ol > li:nth-child(3){animation-delay:110ms}
    .ss-slide.active > ul > li:nth-child(4),.ss-slide.active > ol > li:nth-child(4){animation-delay:160ms}
    .ss-slide.active > ul > li:nth-child(5),.ss-slide.active > ol > li:nth-child(5){animation-delay:210ms}
    .ss-slide.active > ul > li:nth-child(6),.ss-slide.active > ol > li:nth-child(6){animation-delay:260ms}
    .ss-slide h1{font-size:clamp(26px,3.2vw,40px);line-height:1.15;margin:0 0 12px;color:var(--accent)}
    .ss-slide h2{font-size:clamp(18px,2.1vw,26px);line-height:1.25;margin:0 0 14px;color:var(--ink)}
    .ss-slide h3{font-size:18px;margin:10px 0 8px;color:var(--ink-muted)}
    .ss-slide p,.ss-slide li{font-size:clamp(15px,1.45vw,20px);line-height:1.5;margin:6px 0}
    .ss-slide ul,.ss-slide ol{margin:8px 0 12px 24px;padding:0}
    .ss-slide code{font-family:var(--font-mono);font-size:0.88em;background:var(--surface);border:1px solid var(--border);border-radius:4px;padding:1px 5px}
    .ss-slide pre{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:12px 14px;overflow:auto;font-size:14px}
    .ss-slide pre code{border:none;padding:0;background:none}
    .ss-slide table{width:100%;border-collapse:collapse;margin:10px 0;font-size:15px}
    .ss-slide th,.ss-slide td{border:1px solid var(--border);padding:8px 10px;text-align:left}
    .ss-slide th{background:var(--surface)}
    .ss-slide blockquote{border-left:3px solid var(--accent);margin:10px 0;padding:6px 14px;color:var(--ink-muted);background:var(--surface)}
    .ss-slide a{color:var(--accent)}
    .ss-step{opacity:0;transform:translateY(10px);transition:opacity 240ms var(--ease-out),transform 240ms var(--ease-out);pointer-events:none}
    .ss-step.revealed{opacity:1;transform:none;pointer-events:auto}
    .ss-mermaid-box{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px;margin:10px 0;overflow:auto;text-align:center}
    .ss-mermaid-box svg path.flowchart-link,.ss-mermaid-box svg .edgePath path{stroke-dasharray:6 4;animation:ssFlow 2.4s linear infinite}
    @keyframes ssFlow{to{stroke-dashoffset:-20}}
    pre.mermaid{margin:0;border:none;background:transparent;font-family:var(--font-mono);font-size:13px;text-align:left}
    /* Sleek Icon-First Floating Controller */
    .ss-hud{position:fixed;bottom:16px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:4px;background:color-mix(in srgb,var(--surface) 88%,transparent);backdrop-filter:blur(10px);border:1px solid var(--border);border-radius:999px;padding:5px 8px;z-index:40;box-shadow:0 8px 24px rgba(0,0,0,.14);transition:opacity 240ms ease,transform 240ms ease}
    .ss-hud.idle{opacity:.38}
    .ss-hud:hover,.ss-hud:focus-within{opacity:1}
    .ss-hud-sep{width:1px;height:18px;background:var(--border);margin:0 3px}
    .ss-hud-count{font-family:var(--font-mono);font-size:12px;font-weight:700;padding:0 6px;min-width:52px;text-align:center;color:var(--ink)}
    .ss-hud-steps{display:inline-flex;align-items:center;gap:3px;padding:0 4px}
    .ss-dot{width:5px;height:5px;border-radius:50%;background:var(--border);transition:background 180ms ease,transform 180ms ease}
    .ss-dot.on{background:var(--accent);transform:scale(1.25)}
    .ss-hud button,.ss-hud a{position:relative;display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border:1px solid transparent;background:transparent;color:var(--ink-muted);border-radius:999px;cursor:pointer;text-decoration:none;transition:background 150ms ease,color 150ms ease,border-color 150ms ease,transform 120ms ease}
    .ss-hud button:hover,.ss-hud a:hover{background:var(--bg);color:var(--ink);border-color:var(--border);transform:translateY(-1px)}
    .ss-hud button:active{transform:scale(.94)}
    .ss-hud button[data-on="true"]{background:var(--accent);color:var(--accent-ink);border-color:var(--accent)}
    .ss-hud [data-tip]::after{content:attr(data-tip);position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%) translateY(4px);background:var(--ink);color:var(--bg);font-size:11px;font-weight:600;white-space:nowrap;padding:4px 8px;border-radius:5px;opacity:0;pointer-events:none;transition:opacity 140ms ease,transform 140ms ease}
    .ss-hud [data-tip]:hover::after,.ss-hud [data-tip]:focus-visible::after{opacity:1;transform:translateX(-50%) translateY(0)}
    .ss-progress{position:fixed;top:0;left:0;height:3px;background:var(--accent);transition:width 220ms var(--ease-out);z-index:50}
    .ss-drawer{position:fixed;right:16px;bottom:68px;width:min(380px,90vw);max-height:42vh;overflow:auto;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px 16px;font-size:13px;z-index:45;box-shadow:0 12px 30px rgba(0,0,0,.18)}
    .ss-grid{position:fixed;inset:0;background:var(--bg);z-index:60;overflow:auto;padding:28px;display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}
    .ss-grid[hidden],.ss-drawer[hidden]{display:none}
    .ss-thumb{border:1px solid var(--border);border-radius:8px;padding:14px;background:var(--surface);cursor:pointer;text-align:left;transition:border-color 150ms ease,transform 150ms ease}
    .ss-thumb:hover{border-color:var(--accent);transform:translateY(-2px)}
    .ss-thumb.cur{border-color:var(--accent);border-width:2px}
    .ss-cam{position:fixed;right:24px;bottom:76px;width:168px;height:168px;border-radius:50%;overflow:hidden;border:3px solid var(--accent);background:#000;z-index:55;cursor:grab;display:none;box-shadow:0 10px 28px rgba(0,0,0,.35)}
    .ss-cam video{width:100%;height:100%;object-fit:cover;transform:scaleX(-1)}
    @media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:0.01ms!important;transition-duration:0.01ms!important;animation-delay:0ms!important}}
    @media print{.ss-hud,.ss-progress,.ss-drawer,.ss-cam{display:none!important}.ss-slide{display:flex!important;page-break-after:always;min-height:92vh;border:none;box-shadow:none}.ss-step{opacity:1!important;transform:none!important}}
  </style>
</head>
<body>
  <div class="ss-progress" id="progress"></div>
  <main class="ss-stage" id="stage" aria-live="polite">
${slidesHtml}
  </main>
  <aside class="ss-drawer" id="notes" hidden></aside>
  <section class="ss-grid" id="grid" hidden></section>
  <div class="ss-cam" id="camBox" title="Drag to reposition"><video id="camVid" autoplay playsinline muted></video></div>
  <nav class="ss-hud" id="hud" aria-label="Slide controls">
    <button id="prevBtn" data-tip="Previous (←)" aria-label="Previous slide">${ICONS.prev}</button>
    <span class="ss-hud-count" id="counter">1 / 1</span>
    <span class="ss-hud-steps" id="stepDots" aria-hidden="true"></span>
    <button id="nextBtn" data-tip="Next / Step (→ / Space)" aria-label="Next step or slide">${ICONS.next}</button>
    <span class="ss-hud-sep"></span>
    <button id="gridBtn" data-tip="Overview Grid (G)" aria-label="Toggle slide grid">${ICONS.grid}</button>
    <button id="notesBtn" data-tip="Speaker Notes (N)" aria-label="Toggle speaker notes">${ICONS.notes}</button>
    <button id="themeBtn" data-tip="Switch Theme (T)" aria-label="Toggle light or dark theme">${theme === 'dark' ? ICONS.sun : ICONS.moon}</button>
    <button id="camBtn" data-tip="Webcam Bubble (C)" aria-label="Toggle local webcam bubble">${ICONS.camOff}</button>
    <button id="fsBtn" data-tip="Fullscreen (F)" aria-label="Toggle fullscreen">${ICONS.fs}</button>
    <span class="ss-hud-sep"></span>
    ${lessonRel ? `<a href="${escapeHtml(lessonRel)}" data-tip="Open Lesson" aria-label="Open full lesson">${ICONS.lesson}</a>` : ''}
    <a href="index.html" data-tip="All Slide Decks" aria-label="All slide decks">${ICONS.decks}</a>
  </nav>
  <script>
${WIDGETS_JS}
  </script>
  <script>
    (function(){
      var slides = Array.prototype.slice.call(document.querySelectorAll('.ss-slide'));
      var notesData = ${JSON.stringify(notesList)};
      var idx = Math.max(0, Math.min(slides.length - 1, (parseInt((location.hash || '').replace('#slide-',''), 10) || 1) - 1));
      var counter = document.getElementById('counter');
      var stepDotsEl = document.getElementById('stepDots');
      var progress = document.getElementById('progress');
      var notesEl = document.getElementById('notes');
      var gridEl = document.getElementById('grid');
      var hudEl = document.getElementById('hud');
      var themeBtn = document.getElementById('themeBtn');
      var notesBtn = document.getElementById('notesBtn');
      var gridBtn = document.getElementById('gridBtn');
      var fsBtn = document.getElementById('fsBtn');
      var sunSvg = ${JSON.stringify(ICONS.sun)};
      var moonSvg = ${JSON.stringify(ICONS.moon)};
      var camOnSvg = ${JSON.stringify(ICONS.camOn)};
      var camOffSvg = ${JSON.stringify(ICONS.camOff)};
      var fsSvg = ${JSON.stringify(ICONS.fs)};
      var fsExitSvg = ${JSON.stringify(ICONS.fsExit)};

      function updateDots() {
        var steps = slides[idx].querySelectorAll('.ss-step');
        stepDotsEl.innerHTML = '';
        if (!steps.length) { stepDotsEl.style.display = 'none'; return; }
        stepDotsEl.style.display = 'inline-flex';
        steps.forEach(function(st) {
          var d = document.createElement('span');
          d.className = 'ss-dot' + (st.classList.contains('revealed') ? ' on' : '');
          stepDotsEl.appendChild(d);
        });
      }

      function show(n, revealAll, dir) {
        idx = Math.max(0, Math.min(slides.length - 1, n));
        slides.forEach(function(s, i) {
          s.classList.remove('dir-prev');
          if (i === idx && dir === 'prev') s.classList.add('dir-prev');
          s.classList.toggle('active', i === idx);
          var steps = s.querySelectorAll('.ss-step');
          steps.forEach(function(st) { st.classList.toggle('revealed', !!revealAll && i === idx); });
        });
        counter.textContent = (idx + 1) + ' / ' + slides.length;
        progress.style.width = (((idx + 1) / slides.length) * 100) + '%';
        notesEl.innerHTML = '<strong>Speaker Notes · Slide ' + (idx + 1) + '</strong><p style="margin:6px 0 0">' + (notesData[idx] ? notesData[idx].replace(/</g,'&lt;') : 'No notes for this slide.') + '</p>';
        history.replaceState(null, '', '#slide-' + (idx + 1));
        updateDots();
        if (window.StackShadeVisuals) StackShadeVisuals.mountAll(slides[idx]);
      }
      function next() {
        var unrevealed = slides[idx].querySelector('.ss-step:not(.revealed)');
        if (unrevealed) { unrevealed.classList.add('revealed'); updateDots(); return; }
        if (idx < slides.length - 1) show(idx + 1, false, 'next');
      }
      function prev() {
        var revealed = slides[idx].querySelectorAll('.ss-step.revealed');
        if (revealed.length) { revealed[revealed.length - 1].classList.remove('revealed'); updateDots(); return; }
        if (idx > 0) show(idx - 1, true, 'prev');
      }
      function toggleGrid() {
        if (!gridEl.hidden) { gridEl.hidden = true; gridBtn.removeAttribute('data-on'); return; }
        gridEl.innerHTML = '';
        slides.forEach(function(s, i) {
          var h = s.querySelector('h1,h2,h3');
          var btn = document.createElement('button');
          btn.className = 'ss-thumb' + (i === idx ? ' cur' : '');
          btn.innerHTML = '<div style="font-size:11px;opacity:.7">Slide ' + (i + 1) + '</div><div style="font-weight:700;margin-top:4px">' + (h ? h.textContent : 'Slide') + '</div>';
          btn.onclick = function() { gridEl.hidden = true; gridBtn.removeAttribute('data-on'); show(i, false, i >= idx ? 'next' : 'prev'); };
          gridEl.appendChild(btn);
        });
        gridEl.hidden = false;
        gridBtn.setAttribute('data-on', 'true');
      }

      // Auto-dim HUD on idle for clean recording
      var idleTimer = null;
      function wakeHud() {
        hudEl.classList.remove('idle');
        clearTimeout(idleTimer);
        idleTimer = setTimeout(function(){ hudEl.classList.add('idle'); }, 3500);
      }
      ['mousemove','keydown','click'].forEach(function(ev){ window.addEventListener(ev, wakeHud, { passive: true }); });
      wakeHud();

      // Optional local-only webcam bubble (never uploads or records)
      var camStream = null, camBox = document.getElementById('camBox'), camVid = document.getElementById('camVid'), camBtn = document.getElementById('camBtn');
      function stopCam() {
        if (camStream) { camStream.getTracks().forEach(function(t){ t.stop(); }); camStream = null; }
        camVid.srcObject = null; camBox.style.display = 'none'; camBtn.innerHTML = camOffSvg; camBtn.removeAttribute('data-on');
      }
      function toggleCam() {
        if (camStream) { stopCam(); return; }
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { alert('Camera API unavailable in this browser.'); return; }
        navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(function(stream) {
          camStream = stream; camVid.srcObject = stream; camBox.style.display = 'block'; camBtn.innerHTML = camOnSvg; camBtn.setAttribute('data-on', 'true');
        }).catch(function() { alert('Camera permission denied or device unavailable.'); });
      }
      window.addEventListener('beforeunload', stopCam);

      // Drag webcam bubble
      var drag = null;
      camBox.addEventListener('pointerdown', function(e) { drag = { x: e.clientX - camBox.offsetLeft, y: e.clientY - camBox.offsetTop }; camBox.setPointerCapture(e.pointerId); });
      camBox.addEventListener('pointermove', function(e) { if (!drag) return; camBox.style.left = (e.clientX - drag.x) + 'px'; camBox.style.top = (e.clientY - drag.y) + 'px'; camBox.style.right = 'auto'; camBox.style.bottom = 'auto'; });
      camBox.addEventListener('pointerup', function() { drag = null; });

      document.getElementById('nextBtn').onclick = next;
      document.getElementById('prevBtn').onclick = prev;
      gridBtn.onclick = toggleGrid;
      notesBtn.onclick = function(){
        notesEl.hidden = !notesEl.hidden;
        if (notesEl.hidden) notesBtn.removeAttribute('data-on');
        else notesBtn.setAttribute('data-on', 'true');
      };
      themeBtn.onclick = function(){
        var root = document.documentElement;
        var nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', nextTheme);
        themeBtn.innerHTML = nextTheme === 'dark' ? sunSvg : moonSvg;
      };
      camBtn.onclick = toggleCam;
      fsBtn.onclick = function(){
        if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(function(){});
        else document.exitFullscreen();
      };
      document.addEventListener('fullscreenchange', function(){
        fsBtn.innerHTML = document.fullscreenElement ? fsExitSvg : fsSvg;
      });
      document.addEventListener('keydown', function(e) {
        if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
        if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
        else if (e.key === 'ArrowLeft' || e.key === 'Backspace') { e.preventDefault(); prev(); }
        else if (e.key.toLowerCase() === 'g') toggleGrid();
        else if (e.key.toLowerCase() === 'n') notesBtn.click();
        else if (e.key.toLowerCase() === 't') themeBtn.click();
        else if (e.key.toLowerCase() === 'c') toggleCam();
        else if (e.key.toLowerCase() === 'f') fsBtn.click();
        else if (e.key === 'Escape') { gridEl.hidden = true; gridBtn.removeAttribute('data-on'); notesEl.hidden = true; notesBtn.removeAttribute('data-on'); }
      });

      show(idx, false, 'next');
    })();
  </script>
  <script type="module">
    try {
      const m = await import('https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs');
      m.default.initialize({ startOnLoad: false, theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'neutral' });
      await m.default.run({ querySelector: 'pre.mermaid' });
    } catch (_) {
      // Offline graceful fallback: crisp monospace Mermaid source stays readable inside .ss-mermaid-box
    }
  </script>
</body>
</html>`;
}

function buildCourseHubHtml(courseTitle, decks, animIds) {
  const deckRows = decks.map((d) =>
    `<a class="hub-card" href="${escapeHtml(d.fileName)}"><div class="hub-k">${escapeHtml(d.slug)}</div><div class="hub-t">${escapeHtml(d.title)}</div><div class="hub-m">${d.slideCount} slides · Standalone animated HTML</div></a>`
  ).join('\n');
  const animCards = animIds.map((id) =>
    `<div class="hub-sim" data-stackshade-anim="${escapeHtml(id)}"></div>`
  ).join('\n');

  return `<!doctype html>
<html lang="en" data-theme="light">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(courseTitle)} · Offline Teaching & Visuals Hub</title>
  <style>
    :root{--bg:oklch(98.1% 0.004 124);--surface:oklch(95.4% 0.006 124);--ink:oklch(18.5% 0.015 248);--ink-muted:oklch(44.5% 0.014 248);--border:oklch(88.8% 0.008 242);--accent:oklch(44.5% 0.145 142);--accent-ink:oklch(98.5% 0.004 142);--font-sans:"Figtree",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;--font-mono:ui-monospace,"SF Mono","JetBrains Mono",Menlo,monospace}
    [data-theme="dark"]{--bg:oklch(16.8% 0.015 252);--surface:oklch(20.6% 0.017 252);--ink:oklch(94.5% 0.006 240);--ink-muted:oklch(69% 0.013 245);--border:oklch(29.5% 0.018 250);--accent:oklch(87.2% 0.205 124);--accent-ink:oklch(17% 0.02 124)}
    *{box-sizing:border-box}
    body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--font-sans);line-height:1.5}
    header{border-bottom:1px solid var(--border);padding:16px 24px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
    main{max-width:1120px;margin:0 auto;padding:28px 20px 64px}
    .hub-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;margin:16px 0 36px}
    .hub-card{display:block;border:1px solid var(--border);border-radius:8px;padding:14px;background:var(--surface);text-decoration:none;color:var(--ink)}
    .hub-card:hover{border-color:var(--accent)}
    .hub-k{font-family:var(--font-mono);font-size:11px;color:var(--accent)}
    .hub-t{font-weight:700;font-size:15px;margin:4px 0}
    .hub-m{font-size:12px;color:var(--ink-muted)}
    button{border:1px solid var(--border);background:var(--surface);color:var(--ink);border-radius:6px;padding:6px 12px;font-weight:600;cursor:pointer}
  </style>
</head>
<body>
  <header>
    <div><strong>StackShade Courses</strong> · ${escapeHtml(courseTitle)} (Offline Slides & Interactive Lab Hub)</div>
    <button onclick="var r=document.documentElement;r.setAttribute('data-theme',r.getAttribute('data-theme')==='dark'?'light':'dark')">Toggle Light/Dark</button>
  </header>
  <main>
    <h1>Downloadable Animated HTML Slide Decks (${decks.length})</h1>
    <p style="color:var(--ink-muted)">Click any deck to present full-screen with step animations (<code>→</code>), speaker notes (<code>N</code>), overview grid (<code>G</code>), and optional local webcam bubble (<code>C</code>).</p>
    <div class="hub-grid">${deckRows}</div>
    <h2>All ${animIds.length} Interactive Visualizations & Simulations</h2>
    <p style="color:var(--ink-muted)">Test every algorithm, sizing formula, and distributed systems failure mode live below.</p>
    ${animCards}
  </main>
  <script>${WIDGETS_JS}</script>
  <script>StackShadeVisuals.mountAll();</script>
</body>
</html>`;
}

function buildCourse(courseDir) {
  const slidesDir = path.join(courseDir, 'slides');
  const downloadsDir = path.join(courseDir, 'downloads');
  if (!fs.existsSync(slidesDir)) return 0;
  fs.mkdirSync(downloadsDir, { recursive: true });

  const courseMeta = fs.existsSync(path.join(courseDir, 'course.json'))
    ? JSON.parse(fs.readFileSync(path.join(courseDir, 'course.json'), 'utf8'))
    : { title: path.basename(courseDir) };

  const files = fs.readdirSync(slidesDir).filter((f) => f.endsWith('.md')).sort();
  const builtDecks = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(slidesDir, file), 'utf8');
    const { meta, body } = parseFrontmatter(raw);
    const rawSlides = splitSlides(body);
    const notesList = [];
    const slidesHtml = rawSlides.map((s, idx) => {
      const rendered = renderMarkdownSlide(s, slidesDir);
      notesList.push(rendered.notes);
      return `    <section class="ss-slide${idx === 0 ? ' active' : ''}">\n${rendered.html}\n    </section>`;
    }).join('\n');

    const slug = file.replace(/\.md$/, '');
    const outName = `${slug}.html`;
    const courseSlug = path.basename(courseDir);
    const lessonSlug = meta.lesson ? path.basename(meta.lesson, '.md') : '';
    const lessonRel = lessonSlug
      ? `../../courses/${courseSlug}/learn/${lessonSlug}/`
      : `../../courses/${courseSlug}/`;
    const html = buildStandaloneDeckHtml({
      title: meta.title || slug,
      lessonRel,
      slidesHtml,
      notesList,
      defaultTheme: meta.theme || 'dark',
    });
    fs.writeFileSync(path.join(downloadsDir, outName), html, 'utf8');
    builtDecks.push({ slug, fileName: outName, title: meta.title || slug, slideCount: rawSlides.length });
  }

  // Match all 20 registered IDs from widgets.js
  const animMatches = [...WIDGETS_JS.matchAll(/WIDGETS\['([^']+)'\]/g)].map((m) => m[1]);
  fs.writeFileSync(path.join(downloadsDir, 'index.html'), buildCourseHubHtml(courseMeta.title, builtDecks, animMatches), 'utf8');
  return builtDecks.length;
}

const coursesRoot = path.join(REPO_ROOT, 'courses');
let total = 0;
for (const entry of fs.readdirSync(coursesRoot, { withFileTypes: true })) {
  if (entry.isDirectory()) {
    const count = buildCourse(path.join(coursesRoot, entry.name));
    if (count > 0) console.log(`Built ${count} standalone HTML slide decks + interactive hub for courses/${entry.name}/downloads/`);
    total += count;
  }
}
if (total === 0) console.log('No slide markdown files found.');
