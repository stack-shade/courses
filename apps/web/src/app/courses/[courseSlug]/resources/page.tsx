import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAllCourseSlugs, getCourseData } from '@/lib/courses';
import { renderMarkdown } from '@/lib/markdown';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

export function generateStaticParams() {
  return getAllCourseSlugs().map((courseSlug) => ({ courseSlug }));
}

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const data = getCourseData(courseSlug);
  const combinedMd = [data.resourcesMarkdown, data.topicIndexMarkdown, data.blogsMarkdown]
    .filter(Boolean)
    .join('\n\n---\n\n');
  const { html } = renderMarkdown(combinedMd, courseSlug, 'resources');

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link
        href={`/courses/${courseSlug}/`}
        className="mb-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to {data.meta.title}</span>
      </Link>
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Curated Primary Resource Library</h1>
      <MarkdownRenderer html={html} />
    </main>
  );
}
