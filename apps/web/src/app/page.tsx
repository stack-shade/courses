import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Download, Layers, PlayCircle, Youtube } from 'lucide-react';
import { getCatalog, getCourseData } from '@/lib/courses';
import { withBasePath } from '@/lib/paths';

export default function HomePage() {
  const catalog = getCatalog();
  const featured = catalog.courses[0];
  const courseData = featured ? getCourseData(featured.slug) : null;

  return (
    <main>
      {/* Hero */}
      <section className="border-b border-[var(--border)] bg-[var(--surface)] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-xs font-medium text-[var(--ink-muted)]">
              <span>StackShade Courses</span>
              <span>·</span>
              <span>First-Principles Engineering</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Learn software architecture visually, from first principles to production scale.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[var(--ink-muted)] sm:text-lg">
              Every StackShade course pairs structured written notes, Mermaid diagrams, live interactive simulations, standalone downloadable animated HTML slides, labs, and YouTube lessons.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={featured ? `/courses/${featured.slug}/` : '/courses/'}
                className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-ink)]"
              >
                <span>Start System Design</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={withBasePath('/downloads/system-design/index.html')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] px-5 py-2.5 text-sm font-semibold text-[var(--ink)] hover:border-[var(--accent)]"
              >
                <Download className="h-4 w-4" />
                <span>All 40 HTML Slide Decks</span>
              </a>
              <a
                href={catalog.channel.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] px-5 py-2.5 text-sm font-semibold text-[var(--ink)] hover:border-[var(--accent)]"
              >
                <Youtube className="h-4 w-4" />
                <span>@StackShade</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Course Card */}
      {featured && courseData && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Featured Course</h2>
            <Link href="/courses/" className="text-sm font-semibold text-[var(--accent)] hover:underline">
              View catalogue →
            </Link>
          </div>

          <div className="grid gap-6 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] p-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 font-semibold">
                  {featured.level}
                </span>
                <span className="rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 font-mono uppercase">
                  {featured.status}
                </span>
                <span className="text-[var(--ink-muted)]">~{featured.estimatedHours ?? 60} hours</span>
              </div>
              <h3 className="text-2xl font-bold">{featured.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
                {featured.description}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-3">
                  <div className="font-mono text-lg font-bold">{courseData.lessons.length}</div>
                  <div className="text-[var(--ink-muted)]">Written Lessons</div>
                </div>
                <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-3">
                  <div className="font-mono text-lg font-bold">{courseData.labs.length}</div>
                  <div className="text-[var(--ink-muted)]">Hands-On Labs</div>
                </div>
                <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-3">
                  <div className="font-mono text-lg font-bold">{courseData.caseStudies.length}</div>
                  <div className="text-[var(--ink-muted)]">Case Studies</div>
                </div>
                <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-3">
                  <div className="font-mono text-lg font-bold">{courseData.slides.length}</div>
                  <div className="text-[var(--ink-muted)]">HTML Slide Decks</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                  Start At Your Level
                </div>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>
                    <Link href={`/courses/${featured.slug}/learn/01-thinking-in-systems/`} className="hover:text-[var(--accent)]">
                      Beginner: 01 · Thinking in Systems →
                    </Link>
                  </li>
                  <li>
                    <Link href={`/courses/${featured.slug}/learn/15-caching-patterns/`} className="hover:text-[var(--accent)]">
                      Intermediate: 15 · Caching Patterns →
                    </Link>
                  </li>
                  <li>
                    <Link href={`/courses/${featured.slug}/learn/28-partial-failure/`} className="hover:text-[var(--accent)]">
                      Advanced: 28 · Partial Failure & Retries →
                    </Link>
                  </li>
                  <li>
                    <Link href={`/courses/${featured.slug}/case-studies/01-url-shortener/`} className="hover:text-[var(--accent)]">
                      Case Studies: 01 · URL Shortener →
                    </Link>
                  </li>
                </ul>
              </div>

              <Link
                href={`/courses/${featured.slug}/`}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-ink)]"
              >
                <span>Open Full Curriculum</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Teaching Loop */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-xl font-bold tracking-tight">How Every Lesson Works</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: BookOpen,
                title: '1. First-Principles Notes',
                desc: 'Problem statement and mental model before vendor tools, backed by RFCs and primary docs.',
              },
              {
                icon: Layers,
                title: '2. Diagrams & Live Visuals',
                desc: 'Mermaid flows paired with 40 interactive SVG/JS simulations you can tweak live.',
              },
              {
                icon: Download,
                title: '3. Offline HTML Slides',
                desc: 'Download standalone animated .html slide decks with speaker notes and presenter webcam mode.',
              },
              {
                icon: PlayCircle,
                title: '4. Labs, Cases & Videos',
                desc: '14 practical labs, 16 real-world case studies, 5 checkpoints, and YouTube walkthroughs.',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] p-5"
              >
                <card.icon className="h-5 w-5 text-[var(--accent)]" />
                <h3 className="mt-3 text-sm font-bold">{card.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--ink-muted)]">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
