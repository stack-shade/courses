import React from 'react';
import { getAllCourseSlugs, getCourseData } from '@/lib/courses';
import { renderMarkdown } from '@/lib/markdown';
import { DocumentPageShell } from '@/components/DocumentPageShell';

export function generateStaticParams() {
  const out: Array<{ courseSlug: string; caseSlug: string }> = [];
  for (const courseSlug of getAllCourseSlugs()) {
    for (const cs of getCourseData(courseSlug).caseStudies) {
      out.push({ courseSlug, caseSlug: cs.slug });
    }
  }
  return out;
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ courseSlug: string; caseSlug: string }>;
}) {
  const { courseSlug, caseSlug } = await params;
  const data = getCourseData(courseSlug);
  const cs = data.caseStudies.find((x) => x.slug === caseSlug) ?? data.caseStudies[0];
  const { html, toc } = renderMarkdown(cs.body, courseSlug, 'case-studies');

  return (
    <DocumentPageShell
      courseSlug={courseSlug}
      courseTitle={data.meta.title}
      sectionLabel="Case Study"
      title={cs.title}
      badge="Architecture Case Study"
      html={html}
      toc={toc}
    />
  );
}
