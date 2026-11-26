import React from 'react';
import { getAllCourseSlugs, getCourseData } from '@/lib/courses';
import { renderMarkdown } from '@/lib/markdown';
import { DocumentPageShell } from '@/components/DocumentPageShell';

export function generateStaticParams() {
  const out: Array<{ courseSlug: string; projectSlug: string }> = [];
  for (const courseSlug of getAllCourseSlugs()) {
    for (const proj of getCourseData(courseSlug).projects) {
      out.push({ courseSlug, projectSlug: proj.slug });
    }
  }
  return out;
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ courseSlug: string; projectSlug: string }>;
}) {
  const { courseSlug, projectSlug } = await params;
  const data = getCourseData(courseSlug);
  const proj = data.projects.find((x) => x.slug === projectSlug) ?? data.projects[0];
  const { html, toc } = renderMarkdown(proj.body, courseSlug, 'projects');

  return (
    <DocumentPageShell
      courseSlug={courseSlug}
      courseTitle={data.meta.title}
      sectionLabel="Stage Project"
      title={proj.title}
      badge="Project Brief"
      html={html}
      toc={toc}
    />
  );
}
