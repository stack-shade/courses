'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { withBasePath } from '@/lib/paths';

interface SearchItem {
  type: string;
  course: string;
  title: string;
  url: string;
  snippet: string;
}

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!open || loaded) return;
    fetch(withBasePath('/search-index.json'))
      .then((r) => r.json())
      .then((data: SearchItem[]) => {
        setItems(data);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [open, loaded]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 12);
    return items
      .filter(
        (it) =>
          it.title.toLowerCase().includes(q) ||
          it.snippet.toLowerCase().includes(q) ||
          it.type.toLowerCase().includes(q)
      )
      .slice(0, 20);
  }, [query, items]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-16 backdrop-blur-[1px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Global course search"
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-[8px] border border-[var(--border)] bg-[var(--bg)] shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3">
          <Search className="h-4 w-4 text-[var(--ink-muted)]" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 40 lessons, 14 labs, 16 case studies, glossary..."
            className="w-full bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-muted)]"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-[var(--ink-muted)] hover:bg-[var(--surface)]"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto divide-y divide-[var(--border)]">
          {results.length === 0 ? (
            <div className="p-6 text-center text-sm text-[var(--ink-muted)]">
              No matches found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            results.map((item, idx) => (
              <a
                key={`${item.url}-${idx}`}
                href={withBasePath(item.url)}
                onClick={onClose}
                className="block px-4 py-3 hover:bg-[var(--surface)]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[var(--ink)]">{item.title}</span>
                  <span className="shrink-0 rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 font-mono text-[11px] text-[var(--ink-muted)]">
                    {item.type}
                  </span>
                </div>
                <p className="mt-1 line-clamp-1 text-xs text-[var(--ink-muted)]">{item.snippet}</p>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
