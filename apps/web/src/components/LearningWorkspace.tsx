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

  // Mount animation widgets when switching to Visuals tab
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
      {/* Collapsible Left Syllabus Sidebar */}
      {sidebarOpen && (
        <aside className="hidden w-72 shrink-0 border-r border-[var(--border)] bg-[var(--surface)] lg:flex lg:flex-col">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
            <div>
              <Link
                href={`/courses/${courseSlug}/`}
                className="text-xs font-semibold text-[var(--accent)] hover:underline"
              >
                ← {courseTitle}
              </Link>
              <div className="mt-1 text-xs text-[var(--ink-muted)]">
                Progress: {completed.length} / {totalLessons} lessons
              </div>
            </div>
            <button
              type="button"
              onClick={resetProgress}
              title="Reset local progress"
              className="rounded p-1 text-[var(--ink-muted)] hover:bg-[var(--bg)] hover:text-[var(--ink)]"
              aria-label="Reset progress"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
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

      {/* Main Learning Stage */}
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[var(--ink-muted)]">
            <button
              type="button"
              onClick={() => setSidebarOpen((v) => !v)}
              className="hidden items-center gap-1 rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-[var(--ink)] lg:inline-flex"
            >
              {sidebarOpen ? <PanelLeftClose className="h-3.5 w-3.5" /> : <PanelLeftOpen className="h-3.5 w-3.5" />}
              <span>{sidebarOpen ? 'Hide' : 'Syllabus'}</span>
            </button>
            <Link href={`/courses/${courseSlug}/`} className="hover:text-[var(--ink)]">
              Module {current.moduleId}
            </Link>
            <span>/</span>
            <span className="font-medium text-[var(--ink)]">Lesson {current.id}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {current.slidesSlug && (
              <Link
                href={`/present/${courseSlug}/${current.slidesSlug}/`}
                className="inline-flex items-center gap-1.5 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)] hover:border-[var(--accent)]"
              >
                <Presentation className="h-3.5 w-3.5" />
                <span>Presenter Mode</span>
              </Link>
            )}
            {current.downloadHtmlPath && (
              <a
                href={withBasePath(current.downloadHtmlPath)}
                download
                className="inline-flex items-center gap-1.5 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)] hover:border-[var(--accent)]"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download HTML Slides</span>
              </a>
            )}
            <button
              type="button"
              onClick={() => toggleDone(current.slug)}
              className={`inline-flex items-center gap-1.5 rounded-[var(--radius)] px-3 py-1.5 text-xs font-semibold ${
                isDone
                  ? 'bg-[var(--status-ok)] text-white'
                  : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--accent)]'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{isDone ? 'Completed' : 'Mark Complete'}</span>
            </button>
          </div>
        </div>

        {/* Title & Metadata Header */}
        <header className="mb-6 border-b border-[var(--border)] pb-5">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded bg-[var(--surface)] border border-[var(--border)] px-2 py-0.5 font-medium">
              {current.level}
            </span>
            <span className="rounded bg-[var(--surface)] border border-[var(--border)] px-2 py-0.5 font-mono uppercase">
              {current.status}
            </span>
            <span className="text-[var(--ink-muted)]">~{current.durationMinutes} min read</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {current.id} · {current.title}
          </h1>
        </header>

        {/* YouTube Video Stage (Honest state if recording is upcoming) */}
        <section className="mb-6 overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)]">
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
                  <div className="text-xs text-[var(--ink-muted)]">
                    Use the interactive lesson article, animated HTML slide deck, and live visualizations below while recording is scheduled.
                  </div>
                </div>
              </div>
              {current.slidesSlug && (
                <Link
                  href={`/present/${courseSlug}/${current.slidesSlug}/`}
                  className="rounded-[var(--radius)] bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-ink)]"
                >
                  Open Slide Deck →
                </Link>
              )}
            </div>
          )}
        </section>

        {/* Udemy-Inspired Content Tabs */}
        <div className="mb-6 flex flex-wrap gap-1 border-b border-[var(--border)]">
          {[
            ['notes', 'Article & Diagrams'],
            ['visuals', `Interactive Visuals (${current.animations.length})`],
            ['slides', 'Slides & Downloads'],
            ['quiz', `Quiz & Recall (${questions.length})`],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key as typeof tab)}
              className={`border-b-2 px-4 py-2 text-sm font-semibold transition-colors ${
                tab === key
                  ? 'border-[var(--accent)] text-[var(--ink)]'
                  : 'border-transparent text-[var(--ink-muted)] hover:text-[var(--ink)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab Body + Desktop TOC */}
        <div className="flex gap-10">
          <div className="min-w-0 flex-1">
            {tab === 'notes' && <MarkdownRenderer html={html} />}

            {tab === 'visuals' && (
              <div className="max-w-3xl space-y-4">
                {current.animations.length === 0 ? (
                  <p className="text-sm text-[var(--ink-muted)]">
                    No interactive widget mapped to this lesson yet. Check the Diagrams in the Article tab.
                  </p>
                ) : (
                  current.animations.map((id) => <div key={id} data-stackshade-anim={id} />)
                )}
              </div>
            )}

            {tab === 'slides' && (
              <div className="max-w-3xl space-y-4">
                {current.downloadHtmlPath ? (
                  <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5">
                    <h2 className="text-lg font-bold">Animated HTML Slide Deck</h2>
                    <p className="mt-1 text-sm text-[var(--ink-muted)]">
                      Works offline in any browser with step-by-step animations (<code>→</code>), speaker notes (<code>N</code>), overview grid (<code>G</code>), light/dark toggle (<code>T</code>), and interactive simulations.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {current.slidesSlug && (
                        <Link
                          href={`/present/${courseSlug}/${current.slidesSlug}/`}
                          className="inline-flex items-center gap-1.5 rounded-[var(--radius)] bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-[var(--accent-ink)]"
                        >
                          <Presentation className="h-4 w-4" />
                          <span>Launch Presenter Mode (with Optional Webcam)</span>
                        </Link>
                      )}
                      <a
                        href={withBasePath(current.downloadHtmlPath)}
                        download
                        className="inline-flex items-center gap-1.5 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-xs font-semibold text-[var(--ink)] hover:border-[var(--accent)]"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download Standalone .html Deck</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[var(--ink-muted)]">Slide deck not linked for this page.</p>
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

            {/* Prev / Next Footer */}
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

          {/* Right-Rail Table of Contents */}
          {tab === 'notes' && toc.length > 0 && (
            <aside className="hidden w-56 shrink-0 xl:block">
              <div className="sticky top-20 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                  On this page
                </div>
                <ul className="space-y-1.5 border-l border-[var(--border)] pl-3 text-xs">
                  {toc.map((t) => (
                    <li key={t.id} className={t.level === 3 ? 'pl-2' : ''}>
                      <a
                        href={`#${t.id}`}
                        className="block text-[var(--ink-muted)] hover:text-[var(--ink)]"
                      >
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
