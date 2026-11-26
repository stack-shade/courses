import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import type { TocItem } from '@/lib/markdown';

export function DocumentPageShell({
  courseSlug,
  courseTitle,
  sectionLabel,
  title,
  badge,
  html,
  toc,
}: {
  courseSlug: string;
  courseTitle: string;
  sectionLabel: string;
  title: string;
  badge?: string;
  html: string;
  toc: TocItem[];
}) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-4 flex items-center gap-2 text-xs text-[var(--ink-muted)]">
        <Link
          href={`/courses/${courseSlug}/`}
          className="inline-flex items-center gap-1 font-semibold text-[var(--accent)] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{courseTitle}</span>
        </Link>
        <span>/</span>
        <span>{sectionLabel}</span>
      </div>

      <header className="mb-8 border-b border-[var(--border)] pb-5">
        {badge && (
          <span className="mb-2 inline-block rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 font-mono text-[11px] uppercase text-[var(--ink-muted)]">
            {badge}
          </span>
        )}
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      </header>

      <div className="flex gap-10">
        <div className="min-w-0 flex-1">
          <MarkdownRenderer html={html} />
        </div>

        {toc.length > 0 && (
          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-20 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                On this page
              </div>
              <ul className="space-y-1.5 border-l border-[var(--border)] pl-3 text-xs">
                {toc.map((t) => (
                  <li key={t.id} className={t.level === 3 ? 'pl-2' : ''}>
                    <a href={`#${t.id}`} className="block text-[var(--ink-muted)] hover:text-[var(--ink)]">
                      {t.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}
