import React from 'react';
import Link from 'next/link';
import { withBasePath } from '@/lib/paths';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-10 text-sm text-[var(--ink-muted)]">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6">
        <div>
          <div className="font-bold text-[var(--ink)]">StackShade Courses</div>
          <p className="mt-1 text-xs">
            Learn → Understand → Visualize → Build → Experiment → Explain.
          </p>
        </div>
        <div className="flex flex-wrap gap-5 text-xs font-medium">
          <Link href="/courses/" className="hover:text-[var(--ink)]">
            Courses
          </Link>
          <Link href="/courses/system-design/" className="hover:text-[var(--ink)]">
            System Design
          </Link>
          <a
            href={withBasePath('/downloads/system-design/index.html')}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--ink)]"
          >
            HTML Slides Hub
          </a>
          <Link href="/about/" className="hover:text-[var(--ink)]">
            About
          </Link>
          <a
            href="https://www.youtube.com/@StackShade"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--ink)]"
          >
            YouTube
          </a>
          <a
            href="https://github.com/stack-shade/courses"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--ink)]"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
