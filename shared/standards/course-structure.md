# Multi-course repository structure

The repository is a course monorepo: common platform files live once, while every course owns its learning content.

## Canonical layout

```text
courses/
  catalog.json
  <course-slug>/
    README.md
    course.json
    roadmap.md
    curriculum.md
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
  standards/
  templates/
  resources/
site/
  index.html
  _sidebar.md
  _coverpage.md
  assets/
.github/workflows/
```

Not every course needs every folder on day one. Create folders when there is real content to put in them. Prefer meaningful module subfolders only when a course becomes large enough to justify them.

## Ownership rules

- **`courses/<slug>/`:** course-specific material, progression, exercises, diagrams, assets and references.
- **`shared/templates/`:** reusable lesson, lab, project, case-study and slide formats.
- **`shared/standards/`:** editorial rules, accessibility, citation, diagrams and quality standards.
- **`shared/resources/`:** tools and resources useful across multiple courses.
- **`site/`:** global website shell, theme and navigation. Do not put lesson content here.
- **`courses/catalog.json`:** machine-readable list of published and in-progress courses.

## Add a course

1. Choose a short lowercase slug, e.g. `backend-engineering`.
2. Create `courses/<slug>/README.md`, `course.json`, `roadmap.md` and `curriculum.md`.
3. Create the relevant content directories from the canonical layout.
4. Add one entry to `courses/catalog.json`.
5. Add course navigation links to `site/_sidebar.md`.
6. Add slide sources to `courses/<slug>/slides/*.md`. The workflow discovers decks across all courses.
7. Use links relative to each course folder for internal content, and root-relative links only for cross-course resources.
8. Keep statuses honest: `planned`, `in-progress`, `review`, or `published`.

## Naming

- Lessons: `lessons/NN-topic-name.md` or `modules/NN-topic-name/README.md`.
- Labs: `labs/NN-topic-name.md`.
- Projects: `projects/project-name/README.md`.
- Case studies: `case-studies/NN-system-name.md`.
- Slides: `slides/NN-topic-name.md` using Marp.
- Diagrams: `diagrams/topic-name.mmd` or SVG/PNG with an editable source when possible.
- Assessments: `assessments/checkpoint-NN.md`.

## Course metadata

Each `course.json` should include a `slug`, `title`, `description`, `level`, `status`, `prerequisites`, `topics`, and relative `entrypoint`. Keep the global catalogue in sync.

## Avoid duplication

Do not copy the shared templates or common platform policies into each course. Link to them. If a resource is truly specific to one topic or course, keep it local. A shared resource should have clear reuse across at least two courses.
