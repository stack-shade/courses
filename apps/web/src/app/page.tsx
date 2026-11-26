import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Brain, Download, Layers, PlayCircle, Youtube } from 'lucide-react';
import { Badge, Button, Card, Divider, Heading, Text } from '@astryxdesign/core';
import { getCatalog, getCourseData } from '@/lib/courses';
import { withBasePath } from '@/lib/paths';
import { LiveVisual } from '@/components/LiveVisual';

export default function HomePage() {
  const catalog = getCatalog();
  const featured = catalog.courses[0];
  const courseData = featured ? getCourseData(featured.slug) : null;

  return (
    <main>
      {/* Editorial Hero */}
      <section className="border-b border-[var(--border)] bg-[var(--surface)] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 ss-reveal">
          <div className="max-w-3xl">
            <Badge variant="neutral" label="StackShade Courses · First-Principles Engineering" />
            <Heading level={1} type="display-2" className="mt-4">
              Learn software architecture visually, from first principles to production scale.
            </Heading>
            <Text type="large" color="secondary" className="mt-4 block max-w-2xl">
              Structured written lessons, Mermaid diagrams, 40 live simulations, standalone downloadable animated HTML slides, neuroscience quizzes, and YouTube walkthroughs.
            </Text>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                variant="primary"
                size="lg"
                label="Start System Design"
                endContent={<ArrowRight className="h-4 w-4" />}
                href={featured ? `/courses/${featured.slug}/` : '/courses/'}
              />
              <Button
                variant="secondary"
                size="lg"
                label="Practice, Quizzes & SRS"
                icon={<Brain className="h-4 w-4" />}
                href={featured ? `/courses/${featured.slug}/practice/` : '/courses/'}
              />
              <Button
                as="a"
                variant="secondary"
                size="lg"
                label="All 40 HTML Slide Decks"
                icon={<Download className="h-4 w-4" />}
                href={withBasePath('/downloads/system-design/index.html')}
                target="_blank"
                rel="noopener noreferrer"
              />
              <Button
                as="a"
                variant="ghost"
                size="lg"
                label="@StackShade"
                icon={<Youtube className="h-4 w-4" />}
                href={catalog.channel.youtube}
                target="_blank"
                rel="noopener noreferrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Live Interactive Visual Preview */}
      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 ss-reveal ss-reveal-d1">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Heading level={2}>Live Architecture Simulation</Heading>
            <Text type="supporting" color="secondary" className="mt-0.5 block">
              Every lesson &amp; standalone HTML slide deck pairs diagrams with live animated simulations like this.
            </Text>
          </div>
          <a
            href={withBasePath('/downloads/system-design/index.html')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-[var(--accent)] hover:underline"
          >
            Explore all 40 live simulations →
          </a>
        </div>
        <LiveVisual animIds={['anim-request-layers']} />
      </section>

      {/* Featured Course (Clean Flat Astryx Card — Zero Nested Card Clutter) */}
      {featured && courseData && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 ss-reveal ss-reveal-d2">
          <div className="mb-6 flex items-center justify-between">
            <Heading level={2}>Featured Course</Heading>
            <Link href="/courses/" className="text-sm font-semibold text-[var(--accent)] hover:underline">
              View catalogue →
            </Link>
          </div>

          <Card variant="default" padding={6}>
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge variant="neutral" label={featured.level} />
                  <Badge variant="info" label={featured.status.toUpperCase()} />
                  <Text type="supporting" color="secondary" className="tabular-nums">
                    ~{featured.estimatedHours ?? 60} hours
                  </Text>
                </div>
                <Heading level={3}>
                  {featured.title}
                </Heading>
                <Text color="secondary" className="mt-2 block max-w-[65ch]">
                  {featured.description}
                </Text>

                <dl className="mt-6 grid grid-cols-2 gap-6 border-t border-[var(--border)] pt-5 sm:grid-cols-4">
                  {[
                    [courseData.lessons.length, 'Written Lessons'],
                    [courseData.labs.length, 'Hands-On Labs'],
                    [courseData.caseStudies.length, 'Case Studies'],
                    [courseData.slides.length, 'Animated HTML Decks'],
                  ].map(([num, label]) => (
                    <div key={String(label)}>
                      <dt className="text-xs text-[var(--ink-muted)]">{label}</dt>
                      <dd className="mt-0.5 font-mono text-2xl font-bold tabular-nums">{num}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="flex flex-col justify-between border-t border-[var(--border)] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                    Direct Entry Points
                  </div>
                  <ul className="mt-3 space-y-2.5 text-sm">
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
                      <Link href={`/courses/${featured.slug}/practice/`} className="hover:text-[var(--accent)]">
                        Practice: Quizzes, SRS & Interviews →
                      </Link>
                    </li>
                  </ul>
                </div>

                <Button
                  variant="primary"
                  width="100%"
                  label="Open Full Curriculum"
                  endContent={<ArrowRight className="h-4 w-4" />}
                  href={`/courses/${featured.slug}/`}
                  className="mt-6"
                />
              </div>
            </div>
          </Card>
        </section>
      )}

      <Divider />

      {/* Teaching Loop */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Heading level={2}>How Every Lesson Works</Heading>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
              title: '4. Labs, Quizzes & Recall',
              desc: 'Neuroscience-backed SM-2 flashcards, interleaved MCQs, 14 labs, and 16 case studies.',
            },
          ].map((item) => (
            <div key={item.title} className="border-t-2 border-[var(--border)] pt-4">
              <item.icon className="h-5 w-5 text-[var(--accent)]" />
              <Heading level={3} className="mt-3">
                {item.title}
              </Heading>
              <Text type="supporting" color="secondary" className="mt-1.5 block">
                {item.desc}
              </Text>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
