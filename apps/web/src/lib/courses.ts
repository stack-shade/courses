import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';

const REPO_ROOT = path.resolve(process.cwd(), '../..');
const COURSES_ROOT = path.join(REPO_ROOT, 'courses');

const CatalogSchema = z.object({
  schemaVersion: z.number(),
  channel: z.object({
    name: z.string(),
    youtube: z.string().url(),
  }),
  courses: z.array(
    z.object({
      slug: z.string(),
      title: z.string(),
      description: z.string(),
      level: z.string(),
      status: z.string(),
      category: z.string(),
      estimatedHours: z.number().optional(),
      featured: z.boolean().optional(),
      path: z.string(),
      topics: z.array(z.string()),
    })
  ),
});

const ModuleSchema = z.object({
  id: z.string(),
  title: z.string(),
  level: z.string(),
  status: z.string(),
  lessonRange: z.string(),
  lessonCount: z.number(),
  estimatedHours: z.number(),
});

const CourseSchema = z.object({
  slug: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string(),
  level: z.string(),
  status: z.string(),
  featured: z.boolean().optional(),
  category: z.string().optional(),
  estimatedHours: z.number().optional(),
  audience: z.array(z.string()).optional(),
  prerequisites: z.array(z.string()).default([]),
  outcomes: z.array(z.string()).optional(),
  topics: z.array(z.string()).default([]),
  counts: z
    .object({
      modules: z.number(),
      lessons: z.number(),
      labs: z.number(),
      caseStudies: z.number(),
      projects: z.number(),
      assessments: z.number(),
    })
    .optional(),
  modules: z.array(ModuleSchema).default([]),
  youtube: z
    .object({
      channel: z.string(),
      playlist: z.string().nullable().optional(),
      videos: z.array(z.any()).optional(),
    })
    .optional(),
  entrypoint: z.string().default('README.md'),
});

export type CatalogData = z.infer<typeof CatalogSchema>;
export type CourseMeta = z.infer<typeof CourseSchema>;
export type ModuleMeta = z.infer<typeof ModuleSchema>;

export interface ContentDoc {
  slug: string;
  id: string;
  moduleId: string;
  title: string;
  level: string;
  status: string;
  durationMinutes: number;
  objectives: string[];
  slidesSlug: string | null;
  downloadHtmlPath: string | null;
  animations: string[];
  youtubeVideoId: string | null;
  chapters: Array<{ time: string; title: string }>;
  body: string;
  excerpt: string;
}

export interface SlideDeckInfo {
  slug: string;
  title: string;
  lessonSlug: string | null;
  slideCount: number;
  downloadHtmlPath: string;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
  moduleRef: string;
}

const QuizQuestionSchema = z.object({
  id: z.string(),
  moduleId: z.string(),
  lessonSlug: z.string(),
  question: z.string(),
  options: z.array(z.string()),
  correctIndex: z.number(),
  explanation: z.string(),
});

const FlashcardSchema = z.object({
  id: z.string(),
  moduleId: z.string(),
  lessonSlug: z.string(),
  front: z.string(),
  back: z.string(),
  hook: z.string(),
});

const InterviewPromptSchema = z.object({
  id: z.string(),
  level: z.string(),
  moduleId: z.string(),
  title: z.string(),
  prompt: z.string(),
  caseStudySlug: z.string(),
  clarifications: z.array(z.string()),
  bottlenecks: z.array(z.string()),
});

const ExternalPracticeSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  category: z.string(),
  access: z.string(),
  note: z.string(),
});

const PracticeDataSchema = z.object({
  schemaVersion: z.number(),
  courseSlug: z.string(),
  quizzes: z.array(QuizQuestionSchema),
  flashcards: z.array(FlashcardSchema),
  interviewPrompts: z.array(InterviewPromptSchema),
  externalPractice: z.array(ExternalPracticeSchema),
});

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
export type FlashcardItem = z.infer<typeof FlashcardSchema>;
export type InterviewPromptItem = z.infer<typeof InterviewPromptSchema>;
export type ExternalPracticeItem = z.infer<typeof ExternalPracticeSchema>;
export type PracticeData = z.infer<typeof PracticeDataSchema>;

function extractTitle(content: string, fallbackSlug: string): string {
  const m = content.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : fallbackSlug;
}

function readMdDir(dir: string, courseSlug: string): ContentDoc[] {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'README.md').sort();
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const parsed = matter(raw);
    const fm = parsed.data as Record<string, unknown>;
    const slug = file.replace(/\.md$/, '');
    const idStr = typeof fm.id === 'string' ? fm.id : slug.slice(0, 2);
    const title =
      typeof fm.title === 'string'
        ? fm.title
        : extractTitle(parsed.content, slug).replace(/^\d+\s*·\s*/, '');
    const slidesRaw = typeof fm.slides === 'string' ? fm.slides : '';
    const slidesSlug = slidesRaw ? path.basename(slidesRaw, '.md') : null;
    const yt = (fm.youtube as Record<string, unknown> | undefined) ?? {};
    const anims = Array.isArray(fm.animations) ? (fm.animations as string[]) : [];

    // Also pick up inline <!-- anim: id --> inside body
    const inlineAnims = [...parsed.content.matchAll(/<!--\s*anim:\s*([A-Za-z0-9_-]+)\s*-->/g)].map((m) => m[1]);
    const allAnims = Array.from(new Set([...anims, ...inlineAnims]));

    const plainExcerpt = parsed.content
      .replace(/^#.*$/gm, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/[#>*_`|\[\]()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 180);

    return {
      slug,
      id: idStr,
      moduleId: typeof fm.module === 'string' ? fm.module : '00',
      title,
      level: typeof fm.level === 'string' ? fm.level : 'Intermediate',
      status: typeof fm.status === 'string' ? fm.status : 'draft',
      durationMinutes: typeof fm.durationMinutes === 'number' ? fm.durationMinutes : 15,
      objectives: Array.isArray(fm.objectives) ? (fm.objectives as string[]) : [],
      slidesSlug,
      downloadHtmlPath: slidesSlug ? `/downloads/${courseSlug}/${slidesSlug}.html` : null,
      animations: allAnims,
      youtubeVideoId: typeof yt.videoId === 'string' ? yt.videoId : null,
      chapters: Array.isArray(yt.chapters) ? (yt.chapters as Array<{ time: string; title: string }>) : [],
      body: parsed.content,
      excerpt: plainExcerpt,
    };
  });
}

export function getCatalog(): CatalogData {
  const raw = JSON.parse(fs.readFileSync(path.join(COURSES_ROOT, 'catalog.json'), 'utf8'));
  return CatalogSchema.parse(raw);
}

export function getAllCourseSlugs(): string[] {
  return getCatalog().courses.map((c) => c.slug);
}

export interface FullCourseData {
  meta: CourseMeta;
  readmeBody: string;
  lessons: ContentDoc[];
  labs: ContentDoc[];
  caseStudies: ContentDoc[];
  assessments: ContentDoc[];
  projects: ContentDoc[];
  slides: SlideDeckInfo[];
  glossary: GlossaryEntry[];
  resourcesMarkdown: string;
  topicIndexMarkdown: string;
  blogsMarkdown: string;
  practice: PracticeData;
}

export function getCourseData(slug: string): FullCourseData {
  const cDir = path.join(COURSES_ROOT, slug);
  const rawMeta = JSON.parse(fs.readFileSync(path.join(cDir, 'course.json'), 'utf8'));
  const meta = CourseSchema.parse(rawMeta);

  const readmeRaw = fs.existsSync(path.join(cDir, 'README.md'))
    ? fs.readFileSync(path.join(cDir, 'README.md'), 'utf8')
    : '';

  const lessons = readMdDir(path.join(cDir, 'lessons'), slug).sort(
    (a, b) => (parseInt(a.id, 10) || 999) - (parseInt(b.id, 10) || 999)
  );
  const labs = readMdDir(path.join(cDir, 'labs'), slug);
  const caseStudies = readMdDir(path.join(cDir, 'case-studies'), slug);
  const assessments = readMdDir(path.join(cDir, 'assessments'), slug);

  // Projects live in projects/<slug>/README.md
  const projectsDir = path.join(cDir, 'projects');
  const projects: ContentDoc[] = [];
  if (fs.existsSync(projectsDir)) {
    for (const pEntry of fs.readdirSync(projectsDir, { withFileTypes: true })) {
      if (!pEntry.isDirectory()) continue;
      const pFile = path.join(projectsDir, pEntry.name, 'README.md');
      if (!fs.existsSync(pFile)) continue;
      const parsed = matter(fs.readFileSync(pFile, 'utf8'));
      const title = extractTitle(parsed.content, pEntry.name);
      projects.push({
        slug: pEntry.name,
        id: pEntry.name.slice(0, 2),
        moduleId: '08',
        title,
        level: 'Project',
        status: 'draft',
        durationMinutes: 120,
        objectives: [],
        slidesSlug: null,
        downloadHtmlPath: null,
        animations: [],
        youtubeVideoId: null,
        chapters: [],
        body: parsed.content,
        excerpt: title,
      });
    }
    projects.sort((a, b) => a.slug.localeCompare(b.slug));
  }

  // Slide decks
  const slidesDir = path.join(cDir, 'slides');
  const slides: SlideDeckInfo[] = [];
  if (fs.existsSync(slidesDir)) {
    for (const file of fs.readdirSync(slidesDir).filter((f) => f.endsWith('.md')).sort()) {
      const raw = fs.readFileSync(path.join(slidesDir, file), 'utf8');
      const parsed = matter(raw);
      const fm = parsed.data as Record<string, unknown>;
      const deckSlug = file.replace(/\.md$/, '');
      const lessonRaw = typeof fm.lesson === 'string' ? path.basename(fm.lesson, '.md') : null;
      const slideCount = parsed.content.split(/\r?\n---\r?\n/).length;
      slides.push({
        slug: deckSlug,
        title: typeof fm.title === 'string' ? fm.title : deckSlug,
        lessonSlug: lessonRaw,
        slideCount,
        downloadHtmlPath: `/downloads/${slug}/${deckSlug}.html`,
      });
    }
  }

  // Glossary
  const glossary: GlossaryEntry[] = [];
  const glossaryPath = path.join(cDir, 'glossary.md');
  if (fs.existsSync(glossaryPath)) {
    for (const line of fs.readFileSync(glossaryPath, 'utf8').split(/\r?\n/)) {
      if (!line.startsWith('|') || line.includes('---|---') || line.includes('| Term |')) continue;
      const cells = line.slice(1, -1).split('|').map((c) => c.trim());
      if (cells.length >= 2) {
        glossary.push({
          term: cells[0].replace(/\*\*/g, ''),
          definition: cells[1],
          moduleRef: cells[2] ?? '',
        });
      }
    }
  }

  const readIf = (rel: string) =>
    fs.existsSync(path.join(cDir, rel)) ? fs.readFileSync(path.join(cDir, rel), 'utf8') : '';

  const practicePath = path.join(cDir, 'practice-and-quizzes.json');
  const practice: PracticeData = fs.existsSync(practicePath)
    ? PracticeDataSchema.parse(JSON.parse(fs.readFileSync(practicePath, 'utf8')))
    : { schemaVersion: 1, courseSlug: slug, quizzes: [], flashcards: [], interviewPrompts: [], externalPractice: [] };

  return {
    meta,
    readmeBody: readmeRaw,
    lessons,
    labs,
    caseStudies,
    assessments,
    projects,
    slides,
    glossary,
    resourcesMarkdown: readIf('resources/README.md'),
    topicIndexMarkdown: readIf('resources/topic-index.md'),
    blogsMarkdown: readIf('resources/engineering-blogs.md'),
    practice,
  };
}
