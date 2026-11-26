import React from 'react';
import Link from 'next/link';
import { Youtube } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">About StackShade Courses</h1>
      <p className="mt-4 text-base leading-relaxed text-[var(--ink-muted)]">
        StackShade Courses is the open companion classroom and visual reference library for the{' '}
        <a
          href="https://www.youtube.com/@StackShade"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent)] underline"
        >
          StackShade YouTube channel
        </a>
        .
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed">
        <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="text-base font-bold">Teaching Philosophy</h2>
          <p className="mt-2 text-[var(--ink-muted)]">
            <strong>Learn → Understand → Visualize → Build → Experiment → Explain.</strong>{' '}
            Every lesson explains the problem, constraints, and failure modes before introducing specific vendor products.
          </p>
        </section>

        <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="text-base font-bold">Presenter & Screen-Recording Ready</h2>
          <p className="mt-2 text-[var(--ink-muted)]">
            Every lesson has a matching slide deck that runs in browser Presenter Mode with an optional, local-only circular webcam bubble (camera never leaves your device), plus standalone downloadable <code>.html</code> decks for offline study.
          </p>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/courses/system-design/"
            className="rounded-[var(--radius)] bg-[var(--accent)] px-4 py-2 font-semibold text-[var(--accent-ink)]"
          >
            Explore System Design →
          </Link>
          <a
            href="https://www.youtube.com/@StackShade"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2 font-semibold"
          >
            <Youtube className="h-4 w-4" />
            <span>Visit YouTube</span>
          </a>
        </div>
      </div>
    </main>
  );
}
