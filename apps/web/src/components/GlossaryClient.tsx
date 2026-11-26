'use client';

import React, { useMemo, useState } from 'react';
import type { GlossaryEntry } from '@/lib/courses';

export function GlossaryClient({ entries }: { entries: GlossaryEntry[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (e) =>
        e.term.toLowerCase().includes(q) ||
        e.definition.toLowerCase().includes(q) ||
        e.moduleRef.toLowerCase().includes(q)
    );
  }, [entries, query]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter glossary terms..."
        className="mb-6 w-full max-w-md rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
      />

      <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--border)]">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-[var(--surface)]">
            <tr>
              <th className="border-b border-[var(--border)] px-4 py-2.5 text-left font-semibold">Term</th>
              <th className="border-b border-[var(--border)] px-4 py-2.5 text-left font-semibold">Definition</th>
              <th className="border-b border-[var(--border)] px-4 py-2.5 text-left font-semibold">Module</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filtered.map((item) => (
              <tr key={item.term}>
                <td className="px-4 py-3 font-semibold align-top">{item.term}</td>
                <td className="px-4 py-3 text-[var(--ink-muted)]">{item.definition}</td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--ink-muted)] whitespace-nowrap align-top">
                  {item.moduleRef}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
