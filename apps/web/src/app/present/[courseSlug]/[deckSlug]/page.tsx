import React from 'react';
import { getAllCourseSlugs, getCourseData } from '@/lib/courses';
import { PresenterShell } from '@/components/PresenterShell';

export function generateStaticParams() {
  const out: Array<{ courseSlug: string; deckSlug: string }> = [];
  for (const courseSlug of getAllCourseSlugs()) {
    for (const slide of getCourseData(courseSlug).slides) {
      out.push({ courseSlug, deckSlug: slide.slug });
    }
  }
  return out;
}

export default async function PresenterPage({
  params,
}: {
  params: Promise<{ courseSlug: string; deckSlug: string }>;
}) {
  const { courseSlug, deckSlug } = await params;
  const data = getCourseData(courseSlug);
  const deck = data.slides.find((s) => s.slug === deckSlug) ?? data.slides[0];

  return (
    <PresenterShell
      courseSlug={courseSlug}
      deckSlug={deck.slug}
      deckTitle={deck.title}
      lessonSlug={deck.lessonSlug}
      downloadHtmlPath={deck.downloadHtmlPath}
    />
  );
}
