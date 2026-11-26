'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Download, FileText, PlayCircle, Presentation } from 'lucide-react';
import { withBasePath } from '@/lib/paths';

interface LessonRow {
  slug: string;
  id: string;
  title: string;
  durationMinutes: number;
  status: string;
  slidesSlug: string | null;
  downloadHtmlPath: string | null;
  youtubeVideoId: string | null;
}

interface ModuleGroup {
  id: string;
  title: string;
  level: string;
  estimatedHours: number;
  lessons: LessonRow[];
}

export function CurriculumAccordion({
  courseSlug,
  modules,
}: {
  courseSlug: string;
  modules: ModuleGroup[];
}) {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({ '00': true, '01': true });

  const toggle = (id: string) => setOpenMap((p) => ({ ...p, [id]: !p[id] }));

  return (
    <div className="divide-y divide-[var(--border)] overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)]">
      {modules.map((mod) => {
        const isOpen = !!openMap[mod.id];
        return (
          <div key={mod.id}>
            <button
              type="button"
              onClick={() => toggle(mod.id)}
              className="flex w-full items-center justify-between gap-4 bg-[var(--surface)] px-4 py-3.5 text-left hover:bg-[var(--bg)]"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-2.5">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 shrink-0 text-[var(--ink-muted)]" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0 text-[var(--ink-muted)]" />
                )}
                <div>
                  <span className="font-mono text-xs font-semibold text-[var(--accent)]">
                    Module {mod.id}
                  </span>
                  <div className="text-sm font-semibold text-[var(--ink)]">{mod.title}</div>
                </div>
              </div>
              <div className="shrink-0 text-right text-xs text-[var(--ink-muted)]">
                <span>{mod.lessons.length} lessons</span>
                <span className="mx-1.5">·</span>
                <span>~{mod.estimatedHours}h</span>
              </div>
            </button>

            {isOpen && (
              <div className="divide-y divide-[var(--border)] bg-[var(--bg)]">
                {mod.lessons.map((lesson) => (
                  <div
                    key={lesson.slug}
                    className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-sm hover:bg-[var(--surface)]/60"
                  >
                    <Link
                      href={`/courses/${courseSlug}/learn/${lesson.slug}/`}
                      className="flex min-w-0 flex-1 items-center gap-2.5 font-medium text-[var(--ink)] hover:text-[var(--accent)]"
                    >
                      {lesson.youtubeVideoId ? (
                        <PlayCircle className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                      ) : (
                        <FileText className="h-4 w-4 shrink-0 text-[var(--ink-muted)]" />
                      )}
                      <span className="truncate">
                        {lesson.id} · {lesson.title}
                      </span>
                    </Link>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[var(--ink-muted)]">{lesson.durationMinutes}m</span>
                      {lesson.slidesSlug && (
                        <Link
                          href={`/present/${courseSlug}/${lesson.slidesSlug}/`}
                          className="inline-flex items-center gap-1 rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 font-medium text-[var(--ink)] hover:border-[var(--accent)]"
                          title="Open Presenter Mode"
                        >
                          <Presentation className="h-3 w-3" />
                          <span className="hidden sm:inline">Slides</span>
                        </Link>
                      )}
                      {lesson.downloadHtmlPath && (
                        <a
                          href={withBasePath(lesson.downloadHtmlPath)}
                          download
                          className="inline-flex items-center gap-1 rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 font-medium text-[var(--ink)] hover:border-[var(--accent)]"
                          title="Download standalone animated HTML slide deck"
                        >
                          <Download className="h-3 w-3" />
                          <span>.html</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
