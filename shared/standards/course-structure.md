# Multi-Course Repository Structure

The repository is a course monorepo: shared design docs, authoring guides, and standards live once in `shared/`, while every course owns its learning content under `courses/<slug>/`.

## Canonical Layout

```text
courses/
  catalog.json
  <course-slug>/
    README.md
    course.json
    roadmap.md
    curriculum.md
    syllabus.md
    glossary.md
    lessons/
    modules/
    slides/
    labs/
    projects/
    case-studies/
    diagrams/
    resources/
    assessments/
    templates/
    downloads/
shared/
  design-system/
  guides/
  standards/
  templates/
  resources/
apps/
  web/              # Future Next.js static site (loaded dynamically from courses/)
scripts/
  new-course.sh
.github/workflows/
```

Not every course needs every subfolder on day one. Create folders when there is real content to put in them, and never create empty placeholder lesson files.

## Ownership Rules

- **`courses/<slug>/`:** course-specific material, syllabus, lessons, labs, case studies, diagrams, slide sources, and references.
- **`shared/design-system/`:** Udemy-inspired minimal UI tokens, page layouts, Mermaid grammar, and slide/animation rules.
- **`shared/guides/`:** authoring workflows for articles, visualizations, animations, standalone HTML slide decks, and YouTube integration.
- **`shared/templates/` & `shared/standards/`:** reusable lesson, lab, project, case-study, assessment, and slide formats plus editorial quality rules.
- **`apps/web/`:** global website shell, static loader, and presenter mode (reads `courses/catalog.json` and `course.json` dynamically).
- **`courses/catalog.json`:** machine-readable index of active and planned courses.

## Add a Course

1. Choose a short lowercase slug, e.g. `backend-engineering`.
2. Run `bash scripts/new-course.sh <slug> "Course Title" "One-line description"`.
3. Fill out `course.json`, `README.md`, `roadmap.md`, `curriculum.md`, and `syllabus.md`.
4. Add one matching entry to `courses/catalog.json`.
5. Add slide Markdown sources under `courses/<slug>/slides/*.md` following [Downloadable Animated HTML Slides](../guides/downloadable-html-slides.md).
6. Use links relative to each course folder for internal content, and relative paths from `courses/<slug>/` to `../../shared/` for platform standards.
7. Keep statuses honest: `planned`, `in-progress`, `review`, or `published`.

## Naming Conventions

- Lessons: `lessons/NN-topic-name.md` or `modules/NN-topic-name/README.md`
- Labs: `labs/NN-topic-name.md`
- Projects: `projects/project-name/README.md`
- Case studies: `case-studies/NN-system-name.md`
- Slides: `slides/NN-topic-name.md` (portable Markdown compiling to standalone `.html` + optional `.pptx`/`.pdf`)
- Diagrams: `diagrams/topic-name.mmd` or SVG/editable sources alongside exports
- Assessments: `assessments/checkpoint-NN.md`

## Course Metadata

Each `course.json` should include `slug`, `title`, `subtitle`, `description`, `level`, `status`, `category`, `estimatedHours`, `prerequisites`, `outcomes`, `topics`, `modules`, `youtube`, `downloads`, and relative `entrypoint`. Keep `courses/catalog.json` synchronized.

## Avoid Duplication

Do not copy shared templates, design docs, or platform policies into individual courses. Link to them under `shared/`.
