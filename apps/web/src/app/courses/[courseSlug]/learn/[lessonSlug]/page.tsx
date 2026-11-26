import React from 'react';
import { getAllCourseSlugs, getCourseData } from '@/lib/courses';
import { renderMarkdown } from '@/lib/markdown';
import { LearningWorkspace } from '@/components/LearningWorkspace';

export function generateStaticParams() {
  const params: Array<{ courseSlug: string; lessonSlug: string }> = [];
  for (const courseSlug of getAllCourseSlugs()) {
    const data = getCourseData(courseSlug);
    for (const lesson of data.lessons) {
      params.push({ courseSlug, lessonSlug: lesson.slug });
    }
  }
  return params;
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, lessonSlug } = await params;
  const data = getCourseData(courseSlug);
  const idx = data.lessons.findIndex((l) => l.slug === lessonSlug);
  const lesson = data.lessons[idx] ?? data.lessons[0];

  const modules = data.meta.modules.map((mod) => {
    const [startStr, endStr] = mod.lessonRange.split('-');
    const start = parseInt(startStr, 10);
    const end = parseInt(endStr, 10);
    return {
      id: mod.id,
      title: mod.title,
      lessons: data.lessons
        .filter((l) => {
          const n = parseInt(l.id, 10);
          return n >= start && n <= end;
        })
        .map((l) => ({
          slug: l.slug,
          id: l.id,
          title: l.title,
          moduleId: l.moduleId,
          durationMinutes: l.durationMinutes,
        })),
    };
  });

  const { html, toc } = renderMarkdown(lesson.body, courseSlug, 'lessons');
  const lessonQuestions = data.practice.quizzes.filter(
    (q) => q.lessonSlug === lesson.slug || q.moduleId === lesson.moduleId
  );
  const prev = idx > 0 ? { slug: data.lessons[idx - 1].slug, title: data.lessons[idx - 1].title } : null;
  const next =
    idx >= 0 && idx < data.lessons.length - 1
      ? { slug: data.lessons[idx + 1].slug, title: data.lessons[idx + 1].title }
      : null;

  return (
    <LearningWorkspace
      courseSlug={courseSlug}
      courseTitle={data.meta.title}
      modules={modules}
      current={{
        slug: lesson.slug,
        id: lesson.id,
        moduleId: lesson.moduleId,
        title: lesson.title,
        level: lesson.level,
        status: lesson.status,
        durationMinutes: lesson.durationMinutes,
        slidesSlug: lesson.slidesSlug,
        downloadHtmlPath: lesson.downloadHtmlPath,
        animations: lesson.animations,
        youtubeVideoId: lesson.youtubeVideoId,
        chapters: lesson.chapters,
      }}
      html={html}
      toc={toc}
      questions={lessonQuestions}
      prev={prev}
      next={next}
    />
  );
}
