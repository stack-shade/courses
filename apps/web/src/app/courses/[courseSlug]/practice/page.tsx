import React from 'react';
import { getAllCourseSlugs, getCourseData } from '@/lib/courses';
import { PracticeArena } from '@/components/PracticeArena';

export function generateStaticParams() {
  return getAllCourseSlugs().map((courseSlug) => ({ courseSlug }));
}

export default async function CoursePracticePage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const data = getCourseData(courseSlug);

  return (
    <PracticeArena
      courseSlug={courseSlug}
      courseTitle={data.meta.title}
      quizzes={data.practice.quizzes}
      flashcards={data.practice.flashcards}
      interviewPrompts={data.practice.interviewPrompts}
      externalPractice={data.practice.externalPractice}
    />
  );
}
