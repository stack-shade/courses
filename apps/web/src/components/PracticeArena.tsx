'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Brain,
  CheckCircle2,
  Clock,
  ExternalLink,
  FlipHorizontal2,
  Shuffle,
  Timer,
  XCircle,
} from 'lucide-react';
import { Badge, Button, Heading, Tab, TabList, Text } from '@astryxdesign/core';
import type {
  ExternalPracticeItem,
  FlashcardItem,
  InterviewPromptItem,
  QuizQuestion,
} from '@/lib/courses';

interface SrsRecord {
  dueAt: number;
  intervalDays: number;
  reps: number;
}

export function PracticeArena({
  courseSlug,
  courseTitle,
  quizzes,
  flashcards,
  interviewPrompts,
  externalPractice,
}: {
  courseSlug: string;
  courseTitle: string;
  quizzes: QuizQuestion[];
  flashcards: FlashcardItem[];
  interviewPrompts: InterviewPromptItem[];
  externalPractice: ExternalPracticeItem[];
}) {
  const srsKey = `ss-srs-${courseSlug}`;
  const [tab, setTab] = useState<'srs' | 'quiz' | 'interview' | 'external'>('srs');

  // --- 1. Spaced Repetition State ---
  const [srsMap, setSrsMap] = useState<Record<string, SrsRecord>>({});
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(srsKey);
      if (raw) setSrsMap(JSON.parse(raw));
    } catch {
      setSrsMap({});
    }
  }, [srsKey]);

  const now = Date.now();
  const dueCards = useMemo(() => {
    const due = flashcards.filter((c) => !srsMap[c.id] || srsMap[c.id].dueAt <= now);
    return due.length > 0 ? due : flashcards;
  }, [flashcards, srsMap, now]);

  const activeCard = dueCards[cardIndex % Math.max(1, dueCards.length)];
  const dueCount = flashcards.filter((c) => !srsMap[c.id] || srsMap[c.id].dueAt <= now).length;

  const gradeCard = (grade: 'again' | 'hard' | 'good' | 'easy') => {
    if (!activeCard) return;
    const prev = srsMap[activeCard.id] ?? { dueAt: 0, intervalDays: 0, reps: 0 };
    let nextDays = 1;
    if (grade === 'again') nextDays = 0;
    else if (grade === 'hard') nextDays = Math.max(1, prev.intervalDays || 1);
    else if (grade === 'good') nextDays = prev.reps === 0 ? 3 : Math.round((prev.intervalDays || 2) * 2.1);
    else nextDays = prev.reps === 0 ? 7 : Math.round((prev.intervalDays || 3) * 2.8);

    const nextMap: Record<string, SrsRecord> = {
      ...srsMap,
      [activeCard.id]: {
        dueAt: grade === 'again' ? Date.now() + 60 * 1000 : Date.now() + nextDays * 86400 * 1000,
        intervalDays: nextDays,
        reps: grade === 'again' ? 0 : prev.reps + 1,
      },
    };
    setSrsMap(nextMap);
    localStorage.setItem(srsKey, JSON.stringify(nextMap));
    setFlipped(false);
    setCardIndex((i) => i + 1);
  };

  // --- 2. Interleaved Quiz State ---
  const [quizModule, setQuizModule] = useState('interleaved');
  const [seed, setSeed] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  const visibleQuestions = useMemo(() => {
    if (quizModule === 'interleaved') {
      const copy = [...quizzes];
      // Deterministic lightweight shuffle driven by seed
      copy.sort((a, b) => ((a.id.charCodeAt(2) + seed * 7) % 19) - ((b.id.charCodeAt(2) + seed * 11) % 19));
      return copy.slice(0, 8);
    }
    return quizzes.filter((q) => q.moduleId === quizModule);
  }, [quizzes, quizModule, seed]);

  const quizScore = visibleQuestions.filter((q) => quizAnswers[q.id] === q.correctIndex).length;

  // --- 3. Timed 45m Interview Simulator ---
  const [selectedPromptId, setSelectedPromptId] = useState(interviewPrompts[0]?.id ?? '');
  const [showRubric, setShowRubric] = useState(false);
  const [interviewSec, setInterviewSec] = useState(45 * 60);
  const [interviewRunning, setInterviewRunning] = useState(false);
  const [scratchpad, setScratchpad] = useState('');

  useEffect(() => {
    if (!interviewRunning) return;
    const t = setInterval(() => {
      setInterviewSec((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [interviewRunning]);

  const selectedPrompt =
    interviewPrompts.find((p) => p.id === selectedPromptId) ?? interviewPrompts[0];

  const intMins = String(Math.floor(interviewSec / 60)).padStart(2, '0');
  const intSecs = String(interviewSec % 60).padStart(2, '0');

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-6 border-b border-[var(--border)] pb-5">
        <Link
          href={`/courses/${courseSlug}/`}
          className="text-xs font-semibold text-[var(--accent)] hover:underline"
        >
          ← Back to {courseTitle}
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Heading level={1} type="display-3">
              Neuroscience Practice &amp; Interview Arena
            </Heading>
            <Text type="supporting" color="secondary" className="mt-1 block">
              Spaced repetition, interleaved quizzes, timed architecture drills, and curated hands-on practice links.
            </Text>
          </div>
          <Badge variant="info" label={`${dueCount} cards due for review`} />
        </div>
      </header>

      <div className="mb-6">
        <TabList value={tab} onChange={(v) => setTab(v as typeof tab)} role="tablist" hasDivider>
          <Tab value="srs" label={`Spaced Repetition (${dueCount} due)`} />
          <Tab value="quiz" label={`Interleaved Quiz (${quizzes.length})`} />
          <Tab value="interview" label={`45-Min Interview Drill (${interviewPrompts.length})`} />
          <Tab value="external" label={`External Practice Links (${externalPractice.length})`} />
        </TabList>
      </div>

      {/* TAB 1: Spaced Repetition Flashcards */}
      {tab === 'srs' && activeCard && (
        <section className="mx-auto max-w-2xl space-y-4">
          <div className="flex items-center justify-between text-xs text-[var(--ink-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <Brain className="h-4 w-4 text-[var(--accent)]" />
              Module {activeCard.moduleId} · Active Recall Card
            </span>
            <button
              type="button"
              onClick={() => {
                setSrsMap({});
                localStorage.removeItem(srsKey);
                setCardIndex(0);
              }}
              className="hover:underline"
            >
              Reset SRS schedule
            </button>
          </div>

          <div
            onClick={() => setFlipped((f) => !f)}
            className="min-h-[240px] cursor-pointer rounded-[8px] border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col justify-between hover:border-[var(--accent)]"
          >
            <div>
              <div className="font-mono text-xs uppercase text-[var(--ink-muted)]">
                {flipped ? 'Answer & Memory Hook' : 'Recall Prompt (Click to flip)'}
              </div>
              <h2 className="mt-3 text-xl font-bold">{activeCard.front}</h2>
              {flipped && (
                <div className="mt-4 space-y-3 border-t border-[var(--border)] pt-4 text-sm leading-relaxed">
                  <p>{activeCard.back}</p>
                  <p className="text-xs text-[var(--ink-muted)]">
                    <strong>Memory hook:</strong> {activeCard.hook}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between text-xs text-[var(--ink-muted)]">
              <span className="inline-flex items-center gap-1">
                <FlipHorizontal2 className="h-3.5 w-3.5" />
                {flipped ? 'Rate your recall below' : 'Try retrieving from memory first'}
              </span>
              <Link
                href={`/courses/${courseSlug}/learn/${activeCard.lessonSlug}/`}
                onClick={(e) => e.stopPropagation()}
                className="text-[var(--accent)] hover:underline"
              >
                Open Lesson →
              </Link>
            </div>
          </div>

          {flipped ? (
            <div className="grid grid-cols-4 gap-2">
              {[
                ['again', 'Again (<1m)', 'border-[var(--status-err)]'],
                ['hard', 'Hard (1d)', 'border-[var(--status-warn)]'],
                ['good', 'Good (3d+)', 'border-[var(--accent)]'],
                ['easy', 'Easy (7d+)', 'border-[var(--status-ok)]'],
              ].map(([g, label, border]) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => gradeCard(g as 'again' | 'hard' | 'good' | 'easy')}
                  className={`rounded-[var(--radius)] border ${border} bg-[var(--bg)] py-2.5 text-xs font-semibold hover:bg-[var(--surface)]`}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : (
            <Button
              variant="primary"
              width="100%"
              label="Reveal Answer"
              onClick={() => setFlipped(true)}
            />
          )}
        </section>
      )}

      {/* TAB 2: Interleaved Diagnostic Quiz */}
      {tab === 'quiz' && (
        <section className="max-w-3xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={quizModule}
                onChange={(e) => {
                  setQuizModule(e.target.value);
                  setQuizAnswers({});
                }}
                className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-xs font-semibold"
              >
                <option value="interleaved">Interleaved Mixed Drill (8 Random Across Modules)</option>
                {['00', '01', '02', '03', '04', '05', '06', '07', '08'].map((m) => (
                  <option key={m} value={m}>
                    Module {m} Questions
                  </option>
                ))}
              </select>
              {quizModule === 'interleaved' && (
                <button
                  type="button"
                  onClick={() => {
                    setSeed((s) => s + 1);
                    setQuizAnswers({});
                  }}
                  className="inline-flex items-center gap-1 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-xs font-semibold hover:border-[var(--accent)]"
                >
                  <Shuffle className="h-3.5 w-3.5" />
                  <span>New Mix</span>
                </button>
              )}
            </div>
            <div className="font-mono text-xs font-bold">
              Score: {quizScore} / {visibleQuestions.length}
            </div>
          </div>

          {visibleQuestions.map((q, idx) => {
            const chosen = quizAnswers[q.id];
            const answered = chosen !== undefined;
            return (
              <div
                key={q.id}
                className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] p-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-semibold">
                    {idx + 1}. {q.question}
                  </div>
                  <Link
                    href={`/courses/${courseSlug}/learn/${q.lessonSlug}/`}
                    className="shrink-0 font-mono text-[11px] text-[var(--accent)] hover:underline"
                  >
                    M{q.moduleId}
                  </Link>
                </div>
                <div className="mt-3 space-y-2">
                  {q.options.map((opt, oIdx) => {
                    const isPicked = chosen === oIdx;
                    const isRight = q.correctIndex === oIdx;
                    let cls = 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]';
                    if (answered) {
                      if (isRight) cls = 'border-[var(--status-ok)] bg-[var(--status-ok)]/10';
                      else if (isPicked) cls = 'border-[var(--status-err)] bg-[var(--status-err)]/10';
                    }
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => setQuizAnswers((p) => ({ ...p, [q.id]: oIdx }))}
                        className={`flex w-full items-center justify-between gap-3 rounded-[var(--radius)] border px-3 py-2 text-left text-xs sm:text-sm ${cls}`}
                      >
                        <span>{opt}</span>
                        {answered && isRight && <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--status-ok)]" />}
                        {answered && isPicked && !isRight && <XCircle className="h-4 w-4 shrink-0 text-[var(--status-err)]" />}
                      </button>
                    );
                  })}
                </div>
                {answered && (
                  <p className="mt-3 rounded bg-[var(--surface)] p-3 text-xs text-[var(--ink-muted)]">
                    <strong>Explanation:</strong> {q.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* TAB 3: Timed 45-Minute Interview Simulator */}
      {tab === 'interview' && selectedPrompt && (
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-2 lg:col-span-1">
            {interviewPrompts.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelectedPromptId(p.id);
                  setShowRubric(false);
                }}
                className={`block w-full rounded-[var(--radius)] border p-3.5 text-left ${
                  p.id === selectedPrompt.id
                    ? 'border-[var(--accent)] bg-[var(--surface)]'
                    : 'border-[var(--border)] bg-[var(--bg)] hover:border-[var(--accent)]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-[var(--ink-muted)]">
                  <span>{p.level}</span>
                  <span>M{p.moduleId}</span>
                </div>
                <div className="mt-1 text-sm font-semibold">{p.title}</div>
              </button>
            ))}
          </div>

          <div className="space-y-4 lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4">
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-[var(--accent)]" />
                <span className="font-mono text-xl font-bold">
                  {intMins}:{intSecs}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setInterviewRunning((r) => !r)}
                  className="rounded-[var(--radius)] bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-ink)]"
                >
                  {interviewRunning ? 'Pause Timer' : 'Start 45m Drill'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInterviewRunning(false);
                    setInterviewSec(45 * 60);
                  }}
                  className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-xs font-semibold"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] p-5">
              <span className="rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 font-mono text-[11px]">
                {selectedPrompt.level}
              </span>
              <h2 className="mt-2 text-xl font-bold">{selectedPrompt.title}</h2>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">{selectedPrompt.prompt}</p>

              <textarea
                rows={7}
                value={scratchpad}
                onChange={(e) => setScratchpad(e.target.value)}
                placeholder="Write your clarifying questions, QPS/storage estimates, API contract, and bottleneck defenses here before checking the rubric..."
                className="mt-4 w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-3 text-sm outline-none focus:border-[var(--accent)]"
              />

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setShowRubric((s) => !s)}
                  className="rounded-[var(--radius)] bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-[var(--accent-ink)]"
                >
                  {showRubric ? 'Hide Evaluation Rubric' : 'Reveal Clarifications & Bottleneck Rubric'}
                </button>
                <Link
                  href={`/courses/${courseSlug}/case-studies/${selectedPrompt.caseStudySlug}/`}
                  className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold hover:border-[var(--accent)]"
                >
                  Open Full Case Study Brief →
                </Link>
              </div>

              {showRubric && (
                <div className="mt-5 grid gap-4 border-t border-[var(--border)] pt-4 sm:grid-cols-2 text-xs">
                  <div>
                    <div className="font-bold text-[var(--ink)]">Key Clarifications to Ask</div>
                    <ul className="mt-2 list-disc pl-4 space-y-1 text-[var(--ink-muted)]">
                      {selectedPrompt.clarifications.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-bold text-[var(--ink)]">Core Bottlenecks to Defend</div>
                    <ul className="mt-2 list-disc pl-4 space-y-1 text-[var(--ink-muted)]">
                      {selectedPrompt.bottlenecks.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* TAB 4: Verified External Practice Links */}
      {tab === 'external' && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {externalPractice.map((ext) => (
            <a
              key={ext.url}
              href={ext.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col justify-between rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] p-5 hover:border-[var(--accent)]"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="font-mono text-[var(--accent)]">{ext.category}</span>
                  <span className="rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-[var(--ink-muted)]">
                    {ext.access}
                  </span>
                </div>
                <h2 className="mt-2 text-base font-bold flex items-center gap-1.5">
                  <span>{ext.name}</span>
                  <ExternalLink className="h-3.5 w-3.5 text-[var(--ink-muted)]" />
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--ink-muted)]">{ext.note}</p>
              </div>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)]">
                <Clock className="h-3.5 w-3.5" />
                <span>Practice externally →</span>
              </div>
            </a>
          ))}
        </section>
      )}
    </main>
  );
}
