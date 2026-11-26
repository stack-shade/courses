'use client';

import React from 'react';
import Link from 'next/link';
import { Download, FileText, PlayCircle, Presentation } from 'lucide-react';
import { Badge, Button, Collapsible, CollapsibleGroup, Text } from '@astryxdesign/core';
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
  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card-bg)]">
      <CollapsibleGroup type="multiple" defaultValue={['00', '01']} hasDividers density="balanced">
        {modules.map((mod) => (
          <Collapsible
            key={mod.id}
            value={mod.id}
            trigger={
              <div className="flex w-full items-center justify-between gap-4 pr-2 text-left">
                <div>
                  <Badge variant="neutral" label={`Module ${mod.id}`} />
                  <div className="mt-1 text-sm font-semibold text-[var(--ink)]">{mod.title}</div>
                </div>
                <Text type="supporting" color="secondary" className="tabular-nums shrink-0">
                  {mod.lessons.length} lessons · ~{mod.estimatedHours}h
                </Text>
              </div>
            }
          >
            <div className="divide-y divide-[var(--border)] border-t border-[var(--border)] bg-[var(--bg)]">
              {mod.lessons.map((lesson) => (
                <div
                  key={lesson.slug}
                  className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-sm hover:bg-[var(--surface)]/70"
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
                    <span className="tabular-nums text-[var(--ink-muted)]">{lesson.durationMinutes}m</span>
                    {lesson.slidesSlug && (
                      <Button
                        variant="ghost"
                        size="sm"
                        label="Slides"
                        icon={<Presentation className="h-3 w-3" />}
                        href={`/present/${courseSlug}/${lesson.slidesSlug}/`}
                      />
                    )}
                    {lesson.downloadHtmlPath && (
                      <Button
                        as="a"
                        variant="secondary"
                        size="sm"
                        label=".html"
                        icon={<Download className="h-3 w-3" />}
                        href={withBasePath(lesson.downloadHtmlPath)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Collapsible>
        ))}
      </CollapsibleGroup>
    </div>
  );
}
