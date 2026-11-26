import { Marked } from 'marked';
import { withBasePath } from './paths';

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function rewriteCourseLink(href: string, courseSlug: string, currentSection: string): string {
  if (!href || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('#') || href.startsWith('mailto:')) {
    return href;
  }

  const [rawPath, hashPart] = href.split('#');
  const hash = hashPart ? `#${hashPart}` : '';

  if (rawPath.endsWith('.html')) {
    const clean = rawPath.replace(/^(\.\.\/)+/, '').replace(/^\.\//, '');
    if (clean.startsWith('downloads/')) {
      return withBasePath(`/${clean.replace(/^downloads\//, `downloads/${courseSlug}/`)}`) + hash;
    }
    return withBasePath(`/downloads/${courseSlug}/${clean}`) + hash;
  }

  // Map relative markdown links to web routes
  const normalized = rawPath.replace(/^\.\//, '');
  const parts = normalized.split('/');
  const file = parts[parts.length - 1] ?? '';
  const slug = file.replace(/\.md$/, '');

  // Same-folder lesson links
  if (!normalized.includes('/') && rawPath.endsWith('.md')) {
    if (currentSection === 'lessons') return withBasePath(`/courses/${courseSlug}/learn/${slug}/`) + hash;
    if (currentSection === 'labs') return withBasePath(`/courses/${courseSlug}/labs/${slug}/`) + hash;
    if (currentSection === 'case-studies') return withBasePath(`/courses/${courseSlug}/case-studies/${slug}/`) + hash;
    if (currentSection === 'assessments') return withBasePath(`/courses/${courseSlug}/assessments/${slug}/`) + hash;
  }

  if (normalized.includes('lessons/')) return withBasePath(`/courses/${courseSlug}/learn/${slug}/`) + hash;
  if (normalized.includes('labs/')) return withBasePath(`/courses/${courseSlug}/labs/${slug}/`) + hash;
  if (normalized.includes('case-studies/')) return withBasePath(`/courses/${courseSlug}/case-studies/${slug}/`) + hash;
  if (normalized.includes('assessments/')) return withBasePath(`/courses/${courseSlug}/assessments/${slug}/`) + hash;
  if (normalized.includes('slides/')) {
    if (!slug) return withBasePath(`/downloads/${courseSlug}/index.html`) + hash;
    return withBasePath(`/present/${courseSlug}/${slug}/`) + hash;
  }
  if (normalized.includes('projects/')) {
    const projIdx = parts.indexOf('projects');
    const projSlug = parts[projIdx + 1] ?? slug;
    return withBasePath(`/courses/${courseSlug}/projects/${projSlug}/`) + hash;
  }
  if (file === 'glossary.md') return withBasePath(`/courses/${courseSlug}/glossary/`) + hash;
  if (file === 'roadmap.md') return withBasePath(`/courses/${courseSlug}/#roadmap`) + hash;
  if (file === 'curriculum.md') return withBasePath(`/courses/${courseSlug}/#curriculum`) + hash;
  if (normalized.includes('resources')) return withBasePath(`/courses/${courseSlug}/resources/`) + hash;
  if (file === 'README.md' && !normalized.includes('projects')) return withBasePath(`/courses/${courseSlug}/`) + hash;

  return `https://github.com/stack-shade/courses/blob/main/courses/${courseSlug}/${normalized.replace(/^(\.\.\/)+/, '')}${hash}`;
}

export function renderMarkdown(
  rawBody: string,
  courseSlug: string,
  currentSection = 'lessons'
): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const seenIds = new Map<string, number>();

  // Replace <!-- anim: widget-id --> with live widget mount container
  let preprocessed = rawBody.replace(
    /<!--\s*anim:\s*([A-Za-z0-9_-]+)\s*-->/g,
    (_, id: string) => `\n<div data-stackshade-anim="${id}"></div>\n`
  );

  // Strip leading H1 if present since the page header renders the title cleanly
  preprocessed = preprocessed.replace(/^#\s+[^\n]+\r?\n/, '');

  const marked = new Marked({
    gfm: true,
    breaks: false,
  });

  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const rendered = this.parser.parseInline(tokens);
        const cleanText = rendered.replace(/<[^>]+>/g, '');
        let id = slugify(cleanText) || 'section';
        const count = seenIds.get(id) ?? 0;
        seenIds.set(id, count + 1);
        if (count > 0) id = `${id}-${count}`;

        if (depth === 2 || depth === 3) {
          toc.push({ id, text: cleanText, level: depth });
        }
        return `<h${depth} id="${id}">${rendered}</h${depth}>\n`;
      },
      code({ text, lang }) {
        if (lang === 'mermaid') {
          const escaped = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
          return `<div class="ss-mermaid-wrap"><pre class="mermaid">${escaped}</pre></div>\n`;
        }
        const escaped = text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        const label = lang ? `<div class="text-[11px] font-mono uppercase tracking-wider text-[var(--ink-muted)] mb-2">${lang}</div>` : '';
        return `<pre data-code-block="true">${label}<code class="language-${lang || 'text'}">${escaped}</code></pre>\n`;
      },
      link({ href, title, tokens }) {
        const rewritten = rewriteCourseLink(href, courseSlug, currentSection);
        const text = this.parser.parseInline(tokens);
        const isExternal = rewritten.startsWith('http://') || rewritten.startsWith('https://');
        const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
        const titleAttr = title ? ` title="${title}"` : '';
        return `<a href="${rewritten}"${titleAttr}${target}>${text}</a>`;
      },
    },
  });

  const html = marked.parse(preprocessed) as string;
  return { html, toc };
}
