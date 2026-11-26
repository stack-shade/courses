import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookMarked,
  Brain,
  Check,
  CheckSquare,
  Download,
  FlaskConical,
  FolderKanban,
  Layers,
  Presentation,
  Youtube,
} from 'lucide-react';
import { Badge, Button, Card, Divider, Heading, Text } from '@astryxdesign/core';
import { getAllCourseSlugs, getCourseData } from '@/lib/courses';
import { CurriculumAccordion } from '@/components/CurriculumAccordion';
import { withBasePath } from '@/lib/paths';

export function generateStaticParams() {
  return getAllCourseSlugs().map((courseSlug) => ({ courseSlug }));
}

export default async function CourseOverviewPage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const data = getCourseData(courseSlug);
  const { meta, lessons, labs, caseStudies, assessments, projects, slides } = data;

  const groupedModules = meta.modules.map((mod) => {
    const [startStr, endStr] = mod.lessonRange.split('-');
    const start = parseInt(startStr, 10);
    const end = parseInt(endStr, 10);
    const modLessons = lessons.filter((l) => {
      const n = parseInt(l.id, 10);
      return n >= start && n <= end;
    });
    return {
      ...mod,
      lessons: modLessons,
    };
  });

  const firstLesson = lessons[0];

  return (
    <main>
      {/* Editorial Dark Hero Band */}
      <section className="border-b border-[var(--border)] bg-[#141820] py-10 text-[#f1f5f9] sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-[#94a3b8]">
              <Link href="/courses/" className="hover:text-white">
                Courses
              </Link>
              <span>/</span>
              <span className="text-[#a3e635]">{meta.category ?? 'Software Engineering'}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{meta.title}</h1>
            <p className="mt-3 text-base text-[#cbd5e1]">{meta.subtitle ?? meta.description}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs tabular-nums text-[#cbd5e1]">
              <span className="rounded border border-[#2b3446] bg-[#1b2230] px-2.5 py-1 font-semibold text-[#a3e635]">
                {meta.level}
              </span>
              <span>{meta.modules.length} Modules</span>
              <span>·</span>
              <span>{lessons.length} Lessons</span>
              <span>·</span>
              <span>{labs.length} Labs</span>
              <span>·</span>
              <span>{caseStudies.length} Case Studies</span>
              <span>·</span>
              <span>~{meta.estimatedHours ?? 60} hours</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            {meta.outcomes && meta.outcomes.length > 0 && (
              <Card variant="muted" padding={6}>
                <Heading level={2}>What you&apos;ll learn</Heading>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {meta.outcomes.map((item) => (
                    <div key={item} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <div id="curriculum">
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <Heading level={2}>Course Content</Heading>
                <Text type="supporting" color="secondary" className="tabular-nums">
                  {meta.modules.length} modules · {lessons.length} lessons · {slides.length} HTML decks
                </Text>
              </div>
              <CurriculumAccordion courseSlug={courseSlug} modules={groupedModules} />
            </div>

            {labs.length > 0 && (
              <div>
                <Heading level={2} className="mb-3 flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-[var(--accent)]" />
                  <span>Hands-On Labs ({labs.length})</span>
                </Heading>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {labs.map((lab) => (
                    <Link
                      key={lab.slug}
                      href={`/courses/${courseSlug}/labs/${lab.slug}/`}
                      className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card-bg)] p-3.5 text-sm font-medium hover:border-[var(--accent)]"
                    >
                      {lab.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {caseStudies.length > 0 && (
              <div>
                <Heading level={2} className="mb-3 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-[var(--accent)]" />
                  <span>Real-World Case Studies ({caseStudies.length})</span>
                </Heading>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {caseStudies.map((cs) => (
                    <Link
                      key={cs.slug}
                      href={`/courses/${courseSlug}/case-studies/${cs.slug}/`}
                      className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card-bg)] p-3.5 text-sm font-medium hover:border-[var(--accent)]"
                    >
                      {cs.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              {projects.length > 0 && (
                <div>
                  <Heading level={3} className="mb-3 flex items-center gap-2">
                    <FolderKanban className="h-5 w-5 text-[var(--accent)]" />
                    <span>Stage Projects & Capstone</span>
                  </Heading>
                  <div className="space-y-2">
                    {projects.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/courses/${courseSlug}/projects/${p.slug}/`}
                        className="block rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm font-medium hover:border-[var(--accent)]"
                      >
                        {p.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {assessments.length > 0 && (
                <div>
                  <Heading level={3} className="mb-3 flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-[var(--accent)]" />
                    <span>Checkpoints ({assessments.length})</span>
                  </Heading>
                  <div className="space-y-2">
                    {assessments.map((a) => (
                      <Link
                        key={a.slug}
                        href={`/courses/${courseSlug}/assessments/${a.slug}/`}
                        className="block rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm font-medium hover:border-[var(--accent)]"
                      >
                        {a.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside className="lg:col-span-1">
            <Card variant="default" padding={6} className="sticky top-20 space-y-5">
              <div>
                <Badge variant="success" label="Free Open Curriculum" />
                <Heading level={3} className="mt-2">
                  Start or Teach From This Course
                </Heading>
              </div>

              <div className="space-y-2.5">
                {firstLesson && (
                  <Button
                    variant="primary"
                    width="100%"
                    label="Start Lesson 01"
                    endContent={<ArrowRight className="h-4 w-4" />}
                    href={`/courses/${courseSlug}/learn/${firstLesson.slug}/`}
                  />
                )}

                <Button
                  variant="secondary"
                  width="100%"
                  label={`Practice, Quizzes & SRS (${data.practice.quizzes.length})`}
                  icon={<Brain className="h-4 w-4" />}
                  href={`/courses/${courseSlug}/practice/`}
                />

                <Button
                  as="a"
                  variant="secondary"
                  width="100%"
                  label={`All ${slides.length} HTML Slides & Visuals`}
                  icon={<Download className="h-4 w-4" />}
                  href={withBasePath(`/downloads/${courseSlug}/index.html`)}
                  target="_blank"
                  rel="noopener noreferrer"
                />

                {slides[0] && (
                  <Button
                    variant="secondary"
                    width="100%"
                    label="Open Presenter Mode"
                    icon={<Presentation className="h-4 w-4" />}
                    href={`/present/${courseSlug}/${slides[0].slug}/`}
                  />
                )}

                <Button
                  as="a"
                  variant="ghost"
                  width="100%"
                  label="Watch on @StackShade"
                  icon={<Youtube className="h-4 w-4" />}
                  href={meta.youtube?.channel ?? 'https://www.youtube.com/@StackShade'}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              </div>

              <Divider />

              <div className="space-y-1.5 text-xs text-[var(--ink-muted)]">
                <div className="font-semibold text-[var(--ink)]">This course includes:</div>
                <div>• {lessons.length} lessons + Mermaid diagrams</div>
                <div>• 40 live interactive SVG/JS simulations</div>
                <div>• {slides.length} downloadable animated .html decks</div>
                <div>• {data.practice.quizzes.length} MCQs + {data.practice.flashcards.length} SRS flashcards</div>
              </div>

              <Divider />

              <div className="flex flex-wrap gap-4 text-xs font-semibold">
                <Link
                  href={`/courses/${courseSlug}/glossary/`}
                  className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline"
                >
                  <BookMarked className="h-3.5 w-3.5" />
                  <span>Glossary ({data.glossary.length})</span>
                </Link>
                <Link href={`/courses/${courseSlug}/resources/`} className="text-[var(--accent)] hover:underline">
                  Primary Resources →
                </Link>
              </div>
            </Card>
          </aside>
        </div>
      </section>
    </main>
  );
}
