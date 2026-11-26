import React from 'react';
import { getAllCourseSlugs, getCourseData } from '@/lib/courses';
import { renderMarkdown } from '@/lib/markdown';
import { DocumentPageShell } from '@/components/DocumentPageShell';

export function generateStaticParams() {
  const out: Array<{ courseSlug: string; labSlug: string }> = [];
  for (const courseSlug of getAllCourseSlugs()) {
    for (const lab of getCourseData(courseSlug).labs) {
      out.push({ courseSlug, labSlug: lab.slug });
    }
  }
  return out;
}

export default async function LabPage({
  params,
}: {
  params: Promise<{ courseSlug: string; labSlug: string }>;
}) {
  const { courseSlug, labSlug } = await params;
  const data = getCourseData(courseSlug);
  const lab = data.labs.find((x) => x.slug === labSlug) ?? data.labs[0];
  const { html, toc } = renderMarkdown(lab.body, courseSlug, 'labs');

  return (
    <DocumentPageShell
      courseSlug={courseSlug}
      courseTitle={data.meta.title}
      sectionLabel="Hands-On Lab"
      title={lab.title}
      badge="Practical Lab"
      html={html}
      toc={toc}
    />
  );
}
