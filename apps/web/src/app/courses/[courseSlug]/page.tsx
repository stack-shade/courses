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
      {/* Udemy-Inspired Clean Hero Band */}
      <section className="border-b border-[var(--border)] bg-[#0f141d] text-[#f1f5f9] py-10 sm:py-14">
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
            <p className="mt-3 text-base text-[#cbd5e1]">
              {meta.subtitle ?? meta.description}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-[#cbd5e1]">
              <span className="rounded bg-[#161c28] border border-[#252f42] px-2.5 py-1 font-semibold text-[#a3e635]">
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

      {/* Main Content + Sticky Right Course Card */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Left Main Column */}
          <div className="space-y-10 lg:col-span-2">
            {/* What You'll Learn */}
            {meta.outcomes && meta.outcomes.length > 0 && (
              <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-6">
                <h2 className="text-lg font-bold">What you&apos;ll learn</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {meta.outcomes.map((item) => (
                    <div key={item} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Collapsible Course Content Accordion */}
            <div id="curriculum">
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-xl font-bold">Course Content</h2>
                <span className="text-xs text-[var(--ink-muted)]">
                  {meta.modules.length} modules · {lessons.length} lessons · {slides.length} animated HTML decks
                </span>
              </div>
              <CurriculumAccordion courseSlug={courseSlug} modules={groupedModules} />
            </div>

            {/* Hands-on Labs */}
            {labs.length > 0 && (
              <div>
                <h2 className="mb-3 flex items-center gap-2 text-xl font-bold">
                  <FlaskConical className="h-5 w-5 text-[var(--accent)]" />
                  <span>Hands-On Labs ({labs.length})</span>
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {labs.map((lab) => (
                    <Link
                      key={lab.slug}
                      href={`/courses/${courseSlug}/labs/${lab.slug}/`}
                      className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] p-3.5 text-sm font-medium hover:border-[var(--accent)]"
                    >
                      {lab.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 16 Case Studies */}
            {caseStudies.length > 0 && (
              <div>
                <h2 className="mb-3 flex items-center gap-2 text-xl font-bold">
                  <Layers className="h-5 w-5 text-[var(--accent)]" />
                  <span>Real-World Case Studies ({caseStudies.length})</span>
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {caseStudies.map((cs) => (
                    <Link
                      key={cs.slug}
                      href={`/courses/${courseSlug}/case-studies/${cs.slug}/`}
                      className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] p-3.5 text-sm font-medium hover:border-[var(--accent)]"
                    >
                      {cs.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Stage Projects & Assessments */}
            <div className="grid gap-6 sm:grid-cols-2">
              {projects.length > 0 && (
                <div>
                  <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
                    <FolderKanban className="h-5 w-5 text-[var(--accent)]" />
                    <span>Stage Projects & Capstone</span>
                  </h2>
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
                  <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
                    <CheckSquare className="h-5 w-5 text-[var(--accent)]" />
                    <span>Checkpoints ({assessments.length})</span>
                  </h2>
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

          {/* Sticky Right Course Action Card */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20 space-y-5 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                  Free Open Learning Path
                </div>
                <div className="mt-1 text-xl font-bold">Start or Teach From This Course</div>
              </div>

              <div className="space-y-2.5">
                {firstLesson && (
                  <Link
                    href={`/courses/${courseSlug}/learn/${firstLesson.slug}/`}
                    className="flex w-full items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-ink)]"
                  >
                    <span>Start Lesson 01</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}

                <a
                  href={withBasePath(`/downloads/${courseSlug}/index.html`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm font-semibold hover:border-[var(--accent)]"
                >
                  <Download className="h-4 w-4" />
                  <span>All {slides.length} HTML Slides & Visuals</span>
                </a>

                {slides[0] && (
                  <Link
                    href={`/present/${courseSlug}/${slides[0].slug}/`}
                    className="flex w-full items-center justify-center gap-2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm font-semibold hover:border-[var(--accent)]"
                  >
                    <Presentation className="h-4 w-4" />
                    <span>Open Presenter Mode</span>
                  </Link>
                )}

                <Link
                  href={`/courses/${courseSlug}/practice/`}
                  className="flex w-full items-center justify-center gap-2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm font-semibold hover:border-[var(--accent)]"
                >
                  <Brain className="h-4 w-4" />
                  <span>Practice, Quizzes & SRS ({data.practice.quizzes.length})</span>
                </Link>

                <a
                  href={meta.youtube?.channel ?? 'https://www.youtube.com/@StackShade'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm font-semibold hover:border-[var(--accent)]"
                >
                  <Youtube className="h-4 w-4" />
                  <span>Watch on @StackShade</span>
                </a>
              </div>

              <div className="border-t border-[var(--border)] pt-4 text-xs text-[var(--ink-muted)] space-y-2">
                <div className="font-semibold text-[var(--ink)]">This course includes:</div>
                <div>• {lessons.length} full lessons + Mermaid diagrams</div>
                <div>• 40 live interactive SVG/JS simulations</div>
                <div>• {slides.length} downloadable animated .html slide decks</div>
                <div>• {labs.length} labs + {caseStudies.length} case studies + {assessments.length} checkpoints</div>
              </div>

              <div className="flex flex-wrap gap-3 border-t border-[var(--border)] pt-4 text-xs font-semibold">
                <Link
                  href={`/courses/${courseSlug}/glossary/`}
                  className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline"
                >
                  <BookMarked className="h-3.5 w-3.5" />
                  <span>Glossary ({data.glossary.length})</span>
                </Link>
                <Link
                  href={`/courses/${courseSlug}/resources/`}
                  className="text-[var(--accent)] hover:underline"
                >
                  Primary Resources →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
