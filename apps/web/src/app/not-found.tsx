import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-20 text-center">
      <div className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--accent)]">404</div>
      <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-sm text-[var(--ink-muted)]">
        This lesson, lab, or deck path does not exist. Jump back to the course overview or search with Cmd+K.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/"
          className="rounded-[var(--radius)] bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-ink)]"
        >
          Go Home
        </Link>
        <Link
          href="/courses/system-design/"
          className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold"
        >
          System Design Course
        </Link>
      </div>
    </main>
  );
}
