'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Menu, Moon, Search, Sun, X, Youtube } from 'lucide-react';
import { SearchModal } from './SearchModal';
import { withBasePath } from '@/lib/paths';

export function TopNav() {
  const [dark, setDark] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ss-theme');
    const isDark = saved === 'dark';
    setDark(isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === '/' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('ss-theme', next ? 'dark' : 'light');
  };

  return (
    <>
      <header className="sticky top-0 z-40 h-14 border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-[var(--ink)] no-underline">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius)] bg-[var(--accent)] text-xs font-extrabold text-[var(--accent-ink)]">
                SS
              </span>
              <span>StackShade</span>
              <span className="hidden text-xs font-medium text-[var(--ink-muted)] sm:inline">Courses</span>
            </Link>

            <nav className="hidden items-center gap-5 text-sm font-medium text-[var(--ink-muted)] md:flex">
              <Link href="/courses/" className="hover:text-[var(--ink)]">
                Courses
              </Link>
              <Link href="/courses/system-design/" className="hover:text-[var(--ink)]">
                System Design
              </Link>
              <Link href="/courses/system-design/practice/" className="hover:text-[var(--ink)]">
                Practice & Quizzes
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
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--ink-muted)] hover:border-[var(--accent)] hover:text-[var(--ink)]"
              aria-label="Open global search"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Search lessons, glossary...</span>
              <kbd className="hidden rounded border border-[var(--border)] bg-[var(--bg)] px-1.5 py-0.5 font-mono text-[10px] sm:inline">
                Cmd+K
              </kbd>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--accent)]"
              aria-label="Toggle light or dark theme"
              title="Toggle theme"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <a
              href="https://www.youtube.com/@StackShade"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-[var(--radius)] bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-ink)] sm:inline-flex"
            >
              <Youtube className="h-3.5 w-3.5" />
              <span>YouTube</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] md:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-b border-[var(--border)] bg-[var(--bg)] px-4 py-3 md:hidden">
            <div className="flex flex-col gap-2 text-sm font-medium">
              <Link href="/courses/" onClick={() => setMobileOpen(false)} className="py-1">
                All Courses
              </Link>
              <Link href="/courses/system-design/" onClick={() => setMobileOpen(false)} className="py-1 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" /> System Design
              </Link>
              <a
                href={withBasePath('/downloads/system-design/index.html')}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1"
              >
                HTML Slides & Visuals Hub
              </a>
              <Link href="/about/" onClick={() => setMobileOpen(false)} className="py-1">
                About StackShade
              </Link>
            </div>
          </div>
        )}
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
