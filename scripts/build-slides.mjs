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

function buildStandaloneDeckHtml({ title, lessonRel, slidesHtml, notesList, defaultTheme }) {
  const theme = defaultTheme === 'light' ? 'light' : 'dark';
  return `<!doctype html>
<html lang="en" data-theme="${theme}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(title)} · StackShade Slides</title>
  <style>
    :root {
      --bg:#ffffff;--surface:#f8fafc;--ink:#0f172a;--ink-muted:#475569;--border:#e2e8f0;
      --accent:#4f46e5;--accent-ink:#ffffff;--status-ok:#15803d;--status-warn:#b45309;--status-err:#b91c1c;
      --font-sans:"Inter",system-ui,-apple-system,sans-serif;--font-mono:"JetBrains Mono",ui-monospace,monospace;
      --radius:6px;--ease-out:cubic-bezier(0.2,0.8,0.2,1);
    }
    [data-theme="dark"] {
      --bg:#0f141d;--surface:#161c28;--ink:#f1f5f9;--ink-muted:#94a3b8;--border:#252f42;
      --accent:#a3e635;--accent-ink:#0f141d;--status-ok:#4ade80;--status-warn:#fbbf24;--status-err:#f87171;
    }
    *{box-sizing:border-box}
    body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--font-sans);height:100vh;overflow:hidden;display:flex;flex-direction:column}
    .ss-stage{flex:1;display:flex;align-items:center;justify-content:center;padding:24px 28px 68px;overflow:auto}
    .ss-slide{display:none;width:100%;max-width:1080px;min-height:min(620px,78vh);padding:40px 48px;border:1px solid var(--border);border-radius:10px;background:var(--bg);flex-direction:column;justify-content:center;animation:ssIn 180ms var(--ease-out)}
    .ss-slide.active{display:flex}
    @keyframes ssIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
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
    .ss-step{opacity:0;transform:translateY(6px);transition:opacity 160ms var(--ease-out),transform 160ms var(--ease-out);pointer-events:none}
    .ss-step.revealed{opacity:1;transform:none;pointer-events:auto}
    .ss-mermaid-box{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:12px;margin:10px 0;overflow:auto;text-align:center}
    pre.mermaid{margin:0;border:none;background:transparent;font-family:var(--font-mono);font-size:13px;text-align:left}
    .ss-hud{position:fixed;bottom:14px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:6px;background:var(--surface);border:1px solid var(--border);border-radius:999px;padding:6px 12px;font-size:12px;z-index:40}
    .ss-hud button,.ss-hud a{border:1px solid var(--border);background:var(--bg);color:var(--ink);border-radius:999px;padding:4px 10px;font-size:12px;font-weight:600;cursor:pointer;text-decoration:none}
    .ss-hud button:hover{border-color:var(--accent)}
    .ss-progress{position:fixed;top:0;left:0;height:3px;background:var(--accent);transition:width 180ms var(--ease-out);z-index:50}
    .ss-drawer{position:fixed;right:16px;bottom:64px;width:min(380px,90vw);max-height:42vh;overflow:auto;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:12px 14px;font-size:13px;z-index:45}
    .ss-grid{position:fixed;inset:0;background:var(--bg);z-index:60;overflow:auto;padding:28px;display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}
    .ss-grid[hidden],.ss-drawer[hidden]{display:none}
    .ss-thumb{border:1px solid var(--border);border-radius:8px;padding:14px;background:var(--surface);cursor:pointer;text-align:left}
    .ss-thumb.cur{border-color:var(--accent);border-width:2px}
    .ss-cam{position:fixed;right:24px;bottom:72px;width:168px;height:168px;border-radius:50%;overflow:hidden;border:3px solid var(--accent);background:#000;z-index:55;cursor:grab;display:none}
    .ss-cam video{width:100%;height:100%;object-fit:cover;transform:scaleX(-1)}
    @media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:0.01ms!important;transition-duration:0.01ms!important}}
    @media print{.ss-hud,.ss-progress,.ss-drawer,.ss-cam{display:none!important}.ss-slide{display:flex!important;page-break-after:always;min-height:92vh;border:none}.ss-step{opacity:1!important;transform:none!important}}
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
  <nav class="ss-hud" aria-label="Slide controls">
    <button id="prevBtn" title="Previous (←)">←</button>
    <span id="counter">1 / 1</span>
    <button id="nextBtn" title="Next (→ / Space)">→</button>
    <button id="gridBtn" title="Overview Grid (G)">Grid</button>
    <button id="notesBtn" title="Speaker Notes (N)">Notes</button>
    <button id="themeBtn" title="Toggle Theme (T)">Theme</button>
    <button id="camBtn" title="Toggle Local Webcam Bubble (C)">Camera: Off</button>
    <button id="fsBtn" title="Fullscreen (F)">Fullscreen</button>
    ${lessonRel ? `<a href="${escapeHtml(lessonRel)}">Lesson</a>` : ''}
    <a href="index.html">All Decks</a>
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
      var progress = document.getElementById('progress');
      var notesEl = document.getElementById('notes');
      var gridEl = document.getElementById('grid');

      function show(n, revealAll) {
        idx = Math.max(0, Math.min(slides.length - 1, n));
        slides.forEach(function(s, i) {
          s.classList.toggle('active', i === idx);
          var steps = s.querySelectorAll('.ss-step');
          steps.forEach(function(st) { st.classList.toggle('revealed', !!revealAll && i === idx); });
        });
        counter.textContent = (idx + 1) + ' / ' + slides.length;
        progress.style.width = (((idx + 1) / slides.length) * 100) + '%';
        notesEl.innerHTML = '<strong>Speaker Notes · Slide ' + (idx + 1) + '</strong><p style="margin:6px 0 0">' + (notesData[idx] ? notesData[idx].replace(/</g,'&lt;') : 'No notes for this slide.') + '</p>';
        history.replaceState(null, '', '#slide-' + (idx + 1));
        if (window.StackShadeVisuals) StackShadeVisuals.mountAll(slides[idx]);
      }
      function next() {
        var unrevealed = slides[idx].querySelector('.ss-step:not(.revealed)');
        if (unrevealed) { unrevealed.classList.add('revealed'); return; }
        if (idx < slides.length - 1) show(idx + 1, false);
      }
      function prev() {
        var revealed = slides[idx].querySelectorAll('.ss-step.revealed');
        if (revealed.length) { revealed[revealed.length - 1].classList.remove('revealed'); return; }
        if (idx > 0) show(idx - 1, true);
      }
      function toggleGrid() {
        if (!gridEl.hidden) { gridEl.hidden = true; return; }
        gridEl.innerHTML = '';
        slides.forEach(function(s, i) {
          var h = s.querySelector('h1,h2,h3');
          var btn = document.createElement('button');
          btn.className = 'ss-thumb' + (i === idx ? ' cur' : '');
          btn.innerHTML = '<div style="font-size:11px;opacity:.7">Slide ' + (i + 1) + '</div><div style="font-weight:700;margin-top:4px">' + (h ? h.textContent : 'Slide') + '</div>';
          btn.onclick = function() { gridEl.hidden = true; show(i, false); };
          gridEl.appendChild(btn);
        });
        gridEl.hidden = false;
      }

      // Optional local-only webcam bubble (never uploads or records)
      var camStream = null, camBox = document.getElementById('camBox'), camVid = document.getElementById('camVid'), camBtn = document.getElementById('camBtn');
      function stopCam() {
        if (camStream) { camStream.getTracks().forEach(function(t){ t.stop(); }); camStream = null; }
        camVid.srcObject = null; camBox.style.display = 'none'; camBtn.textContent = 'Camera: Off';
      }
      function toggleCam() {
        if (camStream) { stopCam(); return; }
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { alert('Camera API unavailable in this browser.'); return; }
        navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(function(stream) {
          camStream = stream; camVid.srcObject = stream; camBox.style.display = 'block'; camBtn.textContent = 'Camera: On';
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
      document.getElementById('gridBtn').onclick = toggleGrid;
      document.getElementById('notesBtn').onclick = function(){ notesEl.hidden = !notesEl.hidden; };
      document.getElementById('themeBtn').onclick = function(){
        var root = document.documentElement;
        root.setAttribute('data-theme', root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
      };
      document.getElementById('camBtn').onclick = toggleCam;
      document.getElementById('fsBtn').onclick = function(){
        if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(function(){});
        else document.exitFullscreen();
      };
      document.addEventListener('keydown', function(e) {
        if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
        if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
        else if (e.key === 'ArrowLeft' || e.key === 'Backspace') { e.preventDefault(); prev(); }
        else if (e.key.toLowerCase() === 'g') toggleGrid();
        else if (e.key.toLowerCase() === 'n') notesEl.hidden = !notesEl.hidden;
        else if (e.key.toLowerCase() === 't') document.getElementById('themeBtn').click();
        else if (e.key.toLowerCase() === 'c') toggleCam();
        else if (e.key.toLowerCase() === 'f') document.getElementById('fsBtn').click();
        else if (e.key === 'Escape') { gridEl.hidden = true; notesEl.hidden = true; }
      });

      show(idx, false);
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
    :root{--bg:#ffffff;--surface:#f8fafc;--ink:#0f172a;--ink-muted:#475569;--border:#e2e8f0;--accent:#4f46e5;--accent-ink:#fff;--font-sans:system-ui,-apple-system,sans-serif;--font-mono:ui-monospace,monospace}
    [data-theme="dark"]{--bg:#0f141d;--surface:#161c28;--ink:#f1f5f9;--ink-muted:#94a3b8;--border:#252f42;--accent:#a3e635;--accent-ink:#0f141d}
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
    const lessonRel = meta.lesson ? path.posix.join('..', meta.lesson.replace(/^\.\.\//, '')) : '../README.md';
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
