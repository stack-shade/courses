import React from 'react';
import { getAllCourseSlugs, getCourseData } from '@/lib/courses';
import { renderMarkdown } from '@/lib/markdown';
import { DocumentPageShell } from '@/components/DocumentPageShell';

export function generateStaticParams() {
  const out: Array<{ courseSlug: string; assessmentSlug: string }> = [];
  for (const courseSlug of getAllCourseSlugs()) {
    for (const a of getCourseData(courseSlug).assessments) {
      out.push({ courseSlug, assessmentSlug: a.slug });
    }
  }
  return out;
}

export default async function AssessmentPage({
  params,
}: {
  params: Promise<{ courseSlug: string; assessmentSlug: string }>;
}) {
  const { courseSlug, assessmentSlug } = await params;
  const data = getCourseData(courseSlug);
  const item = data.assessments.find((x) => x.slug === assessmentSlug) ?? data.assessments[0];
  const { html, toc } = renderMarkdown(item.body, courseSlug, 'assessments');

  return (
    <DocumentPageShell
      courseSlug={courseSlug}
      courseTitle={data.meta.title}
      sectionLabel="Assessment"
      title={item.title}
      badge="Checkpoint"
      html={html}
      toc={toc}
    />
  );
}
