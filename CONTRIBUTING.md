# Contributing to StackShade Courses

This repository is a multi-course learning platform. Each course owns its content; shared design specs, authoring guides, and templates keep all courses consistent.

## Where to Put Content

- Course-specific lessons, diagrams, labs, slides, projects, assessments, and resources: `courses/<course-slug>/`.
- Shared minimal design system, authoring guides, templates, and standards: `shared/`.
- Global website application (when implemented): `apps/web/`.
- Build and deployment automation: `.github/workflows/`.

Do not add a new course's material to the root README or into another course's folder.

## Content Standards

1. Teach from first principles. Define the problem before introducing a tool or product.
2. Be precise. Label assumptions, estimates, units, invariants, and unknowns.
3. Show the system. Follow the [Mermaid visual grammar & animation spec](shared/design-system/slide-and-animation-spec.md).
4. Explain trade-offs. Include when a design works, when it fails, and what it costs.
5. Cite primary documentation, standards, research papers, and first-party engineering posts. Summarize in your own words; never copy copyrighted diagrams, chapters, or slides.
6. Make it testable. Include a lab, interactive experiment, worked calculation, or retrieval questions.
7. Link prerequisites and next steps. Keep links relative within a course.

## Lesson Quality Checklist

- [ ] Measurable learning objectives and prerequisites.
- [ ] Terms defined on first use.
- [ ] At least one useful Mermaid diagram, visualization/animation, worked example, or comparison.
- [ ] Assumptions, units, and limitations are explicit.
- [ ] Failure modes and trade-offs are discussed.
- [ ] Practical exercise and retrieval questions are included.
- [ ] Sources and attribution are clear (paid books labeled honestly).
- [ ] Status and review date are honest.
- [ ] Relative links resolve cleanly.

See [Content Authoring Playbook](shared/guides/content-authoring-playbook.md), [Lesson Quality Standard](shared/standards/lesson-quality.md), and [Source Attribution Guide](shared/standards/source-attribution.md).

## Adding a Course

1. Read [the canonical course structure](shared/standards/course-structure.md).
2. Run `bash scripts/new-course.sh <slug> "Course Title" "Description"` (or create `courses/<slug>/` using shared templates).
3. Update `course.json` and add a matching entry in `courses/catalog.json` (the web loader discovers courses dynamically).
4. Add slide Markdown sources under `courses/<slug>/slides/` following the [Downloadable Animated HTML Slides Spec](shared/guides/downloadable-html-slides.md).
5. Submit a change explaining the learning outcomes and primary sources consulted.

## Naming Conventions

- Lessons: `lessons/NN-topic-name.md`
- Labs: `labs/NN-topic-name.md`
- Case studies: `case-studies/NN-system-name.md`
- Projects: `projects/project-name/README.md`
- Slides: `slides/NN-topic-name.md`
- Diagrams: `diagrams/topic-name.mmd`

Generated `.html` deck exports, `.pdf`, and `.pptx` binaries belong in build/release output, not committed into Git source control unless explicitly curated. Markdown is the single editable source of truth.

## Pull Requests

Describe the learning gap, primary sources consulted, what changed, and how link/syntax correctness was checked. For architecture changes, include a Mermaid diagram and at least one alternative considered.
