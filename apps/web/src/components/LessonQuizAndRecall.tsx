'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Play, Pause, RotateCcw, Sparkles, XCircle } from 'lucide-react';
import { Button, Card, Heading, Text } from '@astryxdesign/core';
import type { QuizQuestion } from '@/lib/courses';
import Link from 'next/link';

export function LessonQuizAndRecall({
  courseSlug,
  lessonSlug,
  lessonTitle,
  questions,
}: {
  courseSlug: string;
  lessonSlug: string;
  lessonTitle: string;
  questions: QuizQuestion[];
}) {
  const feynmanKey = `ss-feynman-${courseSlug}-${lessonSlug}`;
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [feynmanText, setFeynmanText] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  // Optional neuroscience focus/consolidation timer (25m sprint / 5m recall break)
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<'focus' | 'rest'>('focus');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(feynmanKey);
      if (saved) setFeynmanText(saved);
    } catch {
      // ignore storage errors
    }
  }, [feynmanKey]);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          const nextPhase = phase === 'focus' ? 'rest' : 'focus';
          setPhase(nextPhase);
          return nextPhase === 'focus' ? 25 * 60 : 5 * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running, phase]);

  const saveFeynman = (val: string) => {
    setFeynmanText(val);
    try {
      localStorage.setItem(feynmanKey, val);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 1200);
    } catch {
      // ignore
    }
  };

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');

  return (
    <div className="max-w-3xl space-y-8">
      {/* Neuroscience Focus & Consolidation Sprint Timer */}
      <Card variant="muted" padding={4} className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-[var(--accent)]" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
              {phase === 'focus' ? 'Deep Focus Sprint (25m)' : 'Consolidation Rest Break (5m)'}
            </div>
            <div className="font-mono text-lg font-bold tabular-nums">
              {mins}:{secs}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            label={running ? 'Pause' : 'Start Sprint'}
            icon={running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            onClick={() => setRunning((r) => !r)}
          />
          <Button
            variant="secondary"
            size="sm"
            isIconOnly
            label="Reset focus timer"
            icon={<RotateCcw className="h-3.5 w-3.5" />}
            onClick={() => {
              setRunning(false);
              setPhase('focus');
              setSecondsLeft(25 * 60);
            }}
          />
          <Button
            variant="secondary"
            size="sm"
            label="Full Practice Arena →"
            href={`/courses/${courseSlug}/practice/`}
          />
        </div>
      </Card>

      {/* Active Recall Diagnostic Quiz */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <Heading level={2}>Active Recall Diagnostic Quiz</Heading>
          <Text type="supporting" color="secondary">
            Testing Effect: retrieve before re-reading
          </Text>
        </div>

        {questions.length === 0 ? (
          <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--ink-muted)]">
            No lesson-specific MCQ yet — try the{' '}
            <Link href={`/courses/${courseSlug}/practice/`} className="text-[var(--accent)] underline">
              Interleaved Mixed Quiz
            </Link>
            .
          </div>
        ) : (
          questions.map((q, qIdx) => {
            const chosen = answers[q.id];
            const answered = chosen !== undefined;
            const correct = chosen === q.correctIndex;
            return (
              <div
                key={q.id}
                className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] p-5"
              >
                <div className="text-sm font-semibold">
                  Q{qIdx + 1}. {q.question}
                </div>
                <div className="mt-3 space-y-2">
                  {q.options.map((opt, idx) => {
                    const isPicked = chosen === idx;
                    const isRight = q.correctIndex === idx;
                    let cls =
                      'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]';
                    if (answered) {
                      if (isRight) cls = 'border-[var(--status-ok)] bg-[var(--status-ok)]/10';
                      else if (isPicked) cls = 'border-[var(--status-err)] bg-[var(--status-err)]/10';
                    }
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAnswers((p) => ({ ...p, [q.id]: idx }))}
                        className={`flex w-full items-center justify-between gap-3 rounded-[var(--radius)] border px-3.5 py-2.5 text-left text-xs sm:text-sm ${cls}`}
                      >
                        <span>{opt}</span>
                        {answered && isRight && (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--status-ok)]" />
                        )}
                        {answered && isPicked && !isRight && (
                          <XCircle className="h-4 w-4 shrink-0 text-[var(--status-err)]" />
                        )}
                      </button>
                    );
                  })}
                </div>
                {answered && (
                  <div
                    className={`mt-3 rounded-[var(--radius)] border px-3.5 py-2.5 text-xs leading-relaxed ${
                      correct
                        ? 'border-[var(--status-ok)]/40 bg-[var(--surface)]'
                        : 'border-[var(--status-warn)]/40 bg-[var(--surface)]'
                    }`}
                  >
                    <strong>{correct ? 'Correct: ' : 'Why: '}</strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* Feynman Teach-Back From Memory */}
      <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[var(--accent)]" />
            <h2 className="text-base font-bold">Feynman Explain-It-Back (From Memory)</h2>
          </div>
          {savedNotice && <span className="text-xs font-medium text-[var(--status-ok)]">Saved locally</span>}
        </div>
        <p className="mt-1.5 text-xs text-[var(--ink-muted)]">
          Without looking at <strong>{lessonTitle}</strong>, explain in plain words: (1) What problem does it solve? (2) What is the main trade-off? (3) What fails first at 10× scale?
        </p>
        <textarea
          rows={5}
          value={feynmanText}
          onChange={(e) => saveFeynman(e.target.value)}
          placeholder="Write your mental model from memory (saved automatically in browser localStorage)..."
          className="mt-3 w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] p-3 text-sm outline-none focus:border-[var(--accent)]"
        />
      </section>
    </div>
  );
}
