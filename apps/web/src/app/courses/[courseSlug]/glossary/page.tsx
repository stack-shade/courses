import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAllCourseSlugs, getCourseData } from '@/lib/courses';
import { GlossaryClient } from '@/components/GlossaryClient';

export function generateStaticParams() {
  return getAllCourseSlugs().map((courseSlug) => ({ courseSlug }));
}

export default async function GlossaryPage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const data = getCourseData(courseSlug);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link
        href={`/courses/${courseSlug}/`}
        className="mb-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to {data.meta.title}</span>
      </Link>
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Glossary</h1>
      <p className="mb-6 text-sm text-[var(--ink-muted)]">
        Concise working definitions mapped across all {data.meta.modules.length} modules.
      </p>
      <GlossaryClient entries={data.glossary} />
    </main>
  );
}
