'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CourseSummary {
  slug: string;
  title: string;
  description: string;
  level: string;
  status: string;
  category: string;
  estimatedHours?: number;
  topics: string[];
}

export function CatalogueClient({ courses }: { courses: CourseSummary[] }) {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('all');

  const allTopics = useMemo(
    () => Array.from(new Set(courses.flatMap((c) => c.topics))).sort(),
    [courses]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((c) => {
      const matchTopic = topic === 'all' || c.topics.includes(topic);
      const matchQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.topics.some((t) => t.toLowerCase().includes(q));
      return matchTopic && matchQuery;
    });
  }, [courses, query, topic]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter courses by title or topic..."
          className="w-full max-w-sm rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        />
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
          aria-label="Filter by topic"
        >
          <option value="all">All Topics</option>
          {allTopics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-sm text-[var(--ink-muted)]">
          No courses match your filters.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <div
              key={c.slug}
              className="flex flex-col justify-between rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] p-5"
            >
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs">
                  <span className="rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 font-medium">
                    {c.level}
                  </span>
                  <span className="rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 font-mono uppercase">
                    {c.status}
                  </span>
                </div>
                <h2 className="text-lg font-bold">{c.title}</h2>
                <p className="mt-2 text-sm text-[var(--ink-muted)]">{c.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {c.topics.slice(0, 6).map((t) => (
                    <span
                      key={t}
                      className="rounded bg-[var(--surface)] px-2 py-0.5 font-mono text-[11px] text-[var(--ink-muted)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href={`/courses/${c.slug}/`}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] hover:underline"
              >
                <span>Open Course</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
