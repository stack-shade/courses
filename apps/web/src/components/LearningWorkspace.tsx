'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Download,
  PanelLeftClose,
  PanelLeftOpen,
  PlayCircle,
  Presentation,
  RotateCcw,
} from 'lucide-react';
import { Badge, Button, Card, Heading, ProgressBar, Tab, TabList, Text } from '@astryxdesign/core';
import { MarkdownRenderer } from './MarkdownRenderer';
import { LessonQuizAndRecall } from './LessonQuizAndRecall';
import { withBasePath } from '@/lib/paths';
import type { TocItem } from '@/lib/markdown';
import type { QuizQuestion } from '@/lib/courses';

interface SidebarLesson {
  slug: string;
  id: string;
  title: string;
  moduleId: string;
  durationMinutes: number;
}

interface LearningWorkspaceProps {
  courseSlug: string;
  courseTitle: string;
  modules: Array<{ id: string; title: string; lessons: SidebarLesson[] }>;
  current: {
    slug: string;
    id: string;
    moduleId: string;
    title: string;
    level: string;
    status: string;
    durationMinutes: number;
    slidesSlug: string | null;
    downloadHtmlPath: string | null;
    animations: string[];
    youtubeVideoId: string | null;
    chapters: Array<{ time: string; title: string }>;
  };
  html: string;
  toc: TocItem[];
  questions: QuizQuestion[];
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}

export function LearningWorkspace({
  courseSlug,
  courseTitle,
  modules,
  current,
  html,
  toc,
  questions,
  prev,
  next,
}: LearningWorkspaceProps) {
  const storageKey = `ss-progress-${courseSlug}`;
  const [completed, setCompleted] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tab, setTab] = useState<'notes' | 'visuals' | 'slides' | 'quiz'>('notes');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setCompleted(JSON.parse(raw));
    } catch {
      setCompleted([]);
    }
  }, [storageKey]);

  useEffect(() => {
    if (tab === 'visuals' && typeof window !== 'undefined' && window.StackShadeVisuals) {
      window.StackShadeVisuals.mountAll();
    }
  }, [tab]);

  const toggleDone = (slug: string) => {
    const nextList = completed.includes(slug)
      ? completed.filter((s) => s !== slug)
      : [...completed, slug];
    setCompleted(nextList);
    localStorage.setItem(storageKey, JSON.stringify(nextList));
  };

  const resetProgress = () => {
    setCompleted([]);
    localStorage.removeItem(storageKey);
  };

  const isDone = completed.includes(current.slug);
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div className="mx-auto flex max-w-[1440px] min-h-[calc(100vh-3.5rem)]">
      {sidebarOpen && (
        <aside className="hidden w-72 shrink-0 border-r border-[var(--border)] bg-[var(--surface)] lg:flex lg:flex-col">
          <div className="border-b border-[var(--border)] px-4 py-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Link
                href={`/courses/${courseSlug}/`}
                className="text-xs font-semibold text-[var(--accent)] hover:underline"
              >
                ← {courseTitle}
              </Link>
              <Button
                variant="ghost"
                size="sm"
                isIconOnly
                label="Reset local progress"
                icon={<RotateCcw className="h-3.5 w-3.5" />}
                onClick={resetProgress}
              />
            </div>
            <ProgressBar
              label={`Progress (${completed.length}/${totalLessons})`}
              value={completed.length}
              max={Math.max(1, totalLessons)}
              hasValueLabel
              variant="accent"
            />
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-3">
            {modules.map((mod) => (
              <div key={mod.id}>
                <div className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                  M{mod.id} · {mod.title}
                </div>
                <div className="space-y-0.5">
                  {mod.lessons.map((l) => {
                    const active = l.slug === current.slug;
                    const done = completed.includes(l.slug);
                    return (
                      <Link
                        key={l.slug}
                        href={`/courses/${courseSlug}/learn/${l.slug}/`}
                        className={`flex items-center gap-2 rounded-[var(--radius)] px-2 py-1.5 text-xs ${
                          active
                            ? 'bg-[var(--accent)] font-semibold text-[var(--accent-ink)]'
                            : 'text-[var(--ink)] hover:bg-[var(--bg)]'
                        }`}
                      >
                        {done ? (
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 opacity-90" />
                        ) : (
                          <Circle className="h-3.5 w-3.5 shrink-0 opacity-45" />
                        )}
                        <span className="truncate">
                          {l.id} · {l.title}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
      )}

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[var(--ink-muted)]">
            <Button
              variant="secondary"
              size="sm"
              label={sidebarOpen ? 'Hide' : 'Syllabus'}
              icon={sidebarOpen ? <PanelLeftClose className="h-3.5 w-3.5" /> : <PanelLeftOpen className="h-3.5 w-3.5" />}
              onClick={() => setSidebarOpen((v) => !v)}
              className="hidden lg:inline-flex"
            />
            <Link href={`/courses/${courseSlug}/`} className="hover:text-[var(--ink)]">
              Module {current.moduleId}
            </Link>
            <span>/</span>
            <span className="font-medium text-[var(--ink)]">Lesson {current.id}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {current.slidesSlug && (
              <Button
                variant="secondary"
                size="sm"
                label="Presenter Mode"
                icon={<Presentation className="h-3.5 w-3.5" />}
                href={`/present/${courseSlug}/${current.slidesSlug}/`}
              />
            )}
            {current.downloadHtmlPath && (
              <Button
                as="a"
                variant="secondary"
                size="sm"
                label="Download .html Slides"
                icon={<Download className="h-3.5 w-3.5" />}
                href={withBasePath(current.downloadHtmlPath)}
              />
            )}
            <Button
              variant={isDone ? 'primary' : 'secondary'}
              size="sm"
              label={isDone ? 'Completed' : 'Mark Complete'}
              icon={<CheckCircle2 className="h-3.5 w-3.5" />}
              onClick={() => toggleDone(current.slug)}
            />
          </div>
        </div>

        <header className="mb-6 border-b border-[var(--border)] pb-5">
          <div className="mb-2.5 flex flex-wrap items-center gap-2">
            <Badge variant="neutral" label={current.level} />
            <Badge variant="info" label={current.status.toUpperCase()} />
            <Text type="supporting" color="secondary" className="tabular-nums">
              ~{current.durationMinutes} min read
            </Text>
          </div>
          <Heading level={1} type="display-3">
            {current.id} · {current.title}
          </Heading>
        </header>

        {/* YouTube Video Stage */}
        <Card variant="muted" padding={0} className="mb-6 overflow-hidden">
          {current.youtubeVideoId ? (
            <div className="aspect-video w-full bg-black">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${current.youtubeVideoId}`}
                title={current.title}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
              <div className="flex items-center gap-3">
                <PlayCircle className="h-6 w-6 shrink-0 text-[var(--accent)]" />
                <div>
                  <div className="text-sm font-semibold">Video lecture upcoming on @StackShade</div>
                  <Text type="supporting" color="secondary">
                    Study with the article, animated HTML slide deck, live simulations, and Recall Quiz below.
                  </Text>
                </div>
              </div>
              {current.slidesSlug && (
                <Button
                  variant="primary"
                  size="sm"
                  label="Open Slide Deck →"
                  href={`/present/${courseSlug}/${current.slidesSlug}/`}
                />
              )}
            </div>
          )}
        </Card>

        {/* Astryx TabList */}
        <div className="mb-6">
          <TabList
            value={tab}
            onChange={(v) => setTab(v as typeof tab)}
            role="tablist"
            hasDivider
          >
            <Tab value="notes" label="Article & Diagrams" />
            <Tab value="visuals" label={`Interactive Visuals (${current.animations.length})`} />
            <Tab value="slides" label="Slides & Downloads" />
            <Tab value="quiz" label={`Quiz & Recall (${questions.length})`} />
          </TabList>
        </div>

        <div className="flex gap-10">
          <div className="min-w-0 flex-1">
            {tab === 'notes' && <MarkdownRenderer html={html} />}

            {tab === 'visuals' && (
              <div className="max-w-3xl space-y-4">
                {current.animations.length === 0 ? (
                  <Text color="secondary">
                    No interactive widget mapped to this lesson yet. Check the Diagrams in the Article tab.
                  </Text>
                ) : (
                  current.animations.map((id) => <div key={id} data-stackshade-anim={id} />)
                )}
              </div>
            )}

            {tab === 'slides' && (
              <div className="max-w-3xl">
                {current.downloadHtmlPath ? (
                  <Card variant="default" padding={5}>
                    <Heading level={2}>Animated HTML Slide Deck</Heading>
                    <Text type="supporting" color="secondary" className="mt-1 block">
                      Works offline in any browser with step-by-step animations (→), speaker notes (N), overview grid (G), light/dark toggle (T), and interactive simulations.
                    </Text>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {current.slidesSlug && (
                        <Button
                          variant="primary"
                          label="Launch Presenter Mode (Optional Webcam)"
                          icon={<Presentation className="h-4 w-4" />}
                          href={`/present/${courseSlug}/${current.slidesSlug}/`}
                        />
                      )}
                      <Button
                        as="a"
                        variant="secondary"
                        label="Download Standalone .html Deck"
                        icon={<Download className="h-4 w-4" />}
                        href={withBasePath(current.downloadHtmlPath)}
                      />
                    </div>
                  </Card>
                ) : (
                  <Text color="secondary">Slide deck not linked for this page.</Text>
                )}
              </div>
            )}

            {tab === 'quiz' && (
              <LessonQuizAndRecall
                courseSlug={courseSlug}
                lessonSlug={current.slug}
                lessonTitle={current.title}
                questions={questions}
              />
            )}

            <nav className="mt-12 grid grid-cols-1 gap-4 border-t border-[var(--border)] pt-6 sm:grid-cols-2">
              {prev ? (
                <Link
                  href={`/courses/${courseSlug}/learn/${prev.slug}/`}
                  className="flex items-center gap-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-[var(--accent)]"
                >
                  <ArrowLeft className="h-4 w-4 shrink-0 text-[var(--ink-muted)]" />
                  <div className="min-w-0">
                    <div className="text-xs text-[var(--ink-muted)]">Previous</div>
                    <div className="truncate text-sm font-semibold">{prev.title}</div>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {next && (
                <Link
                  href={`/courses/${courseSlug}/learn/${next.slug}/`}
                  className="flex items-center justify-between gap-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 text-right hover:border-[var(--accent)]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-[var(--ink-muted)]">Next Lesson</div>
                    <div className="truncate text-sm font-semibold">{next.title}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[var(--ink-muted)]" />
                </Link>
              )}
            </nav>
          </div>

          {tab === 'notes' && toc.length > 0 && (
            <aside className="hidden w-56 shrink-0 xl:block">
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
    </div>
  );
}
