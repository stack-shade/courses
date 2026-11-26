#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(WEB_ROOT, '../..');
const PUBLIC_DIR = path.join(WEB_ROOT, 'public');

// 1. Ensure standalone HTML slides are freshly built
execSync('node scripts/build-slides.mjs', { cwd: REPO_ROOT, stdio: 'inherit' });

// 2. Copy shared interactive visualizations engine into public/visuals/widgets.js
const visualsOut = path.join(PUBLIC_DIR, 'visuals');
fs.mkdirSync(visualsOut, { recursive: true });
fs.copyFileSync(
  path.join(REPO_ROOT, 'shared/visuals/widgets.js'),
  path.join(visualsOut, 'widgets.js')
);

// 3. Copy every course's downloadable HTML decks into public/downloads/<slug>/ and build offline search-index.json
const coursesDir = path.join(REPO_ROOT, 'courses');
const searchItems = [];

function stripMd(text) {
  return text
    .replace(/^---[\s\S]*?---\r?\n/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`|\[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractHeading(raw, fallback) {
  const m = raw.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : fallback;
}

for (const entry of fs.readdirSync(coursesDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const slug = entry.name;
  const cDir = path.join(coursesDir, slug);

  const dlSrc = path.join(cDir, 'downloads');
  if (fs.existsSync(dlSrc)) {
    const dlOut = path.join(PUBLIC_DIR, 'downloads', slug);
    fs.mkdirSync(dlOut, { recursive: true });
    for (const file of fs.readdirSync(dlSrc)) {
      if (file.endsWith('.html')) {
        fs.copyFileSync(path.join(dlSrc, file), path.join(dlOut, file));
      }
    }
  }

  const courseJsonPath = path.join(cDir, 'course.json');
  if (fs.existsSync(courseJsonPath)) {
    const meta = JSON.parse(fs.readFileSync(courseJsonPath, 'utf8'));
    searchItems.push({
      type: 'Course',
      course: slug,
      title: meta.title,
      url: `/courses/${slug}/`,
      snippet: meta.description,
    });
  }

  const addDir = (sub, type, routeSub) => {
    const d = path.join(cDir, sub);
    if (!fs.existsSync(d)) return;
    for (const file of fs.readdirSync(d).filter((f) => f.endsWith('.md') && f !== 'README.md').sort()) {
      const raw = fs.readFileSync(path.join(d, file), 'utf8');
      const fmTitle = raw.match(/^title:\s*"?([^"\n]+)"?/m);
      const title = fmTitle ? fmTitle[1].trim() : extractHeading(raw, file.replace(/\.md$/, ''));
      const itemSlug = file.replace(/\.md$/, '');
      searchItems.push({
        type,
        course: slug,
        title,
        url: `/courses/${slug}/${routeSub}/${itemSlug}/`,
        snippet: stripMd(raw).slice(0, 200),
      });
    }
  };

  addDir('lessons', 'Lesson', 'learn');
  addDir('labs', 'Lab', 'labs');
  addDir('case-studies', 'Case Study', 'case-studies');
  addDir('assessments', 'Checkpoint', 'assessments');

  const glossaryPath = path.join(cDir, 'glossary.md');
  if (fs.existsSync(glossaryPath)) {
    for (const line of fs.readFileSync(glossaryPath, 'utf8').split(/\r?\n/)) {
      if (!line.startsWith('|') || line.includes('---|---') || line.includes('| Term |')) continue;
      const cells = line.slice(1, -1).split('|').map((c) => c.trim());
      if (cells.length >= 2) {
        searchItems.push({
          type: 'Glossary',
          course: slug,
          title: cells[0].replace(/\*\*/g, ''),
          url: `/courses/${slug}/glossary/`,
          snippet: cells[1],
        });
      }
    }
  }
}

fs.writeFileSync(path.join(PUBLIC_DIR, 'search-index.json'), JSON.stringify(searchItems));
console.log(`Synced assets + ${searchItems.length} search items into apps/web/public/`);
