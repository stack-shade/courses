# Contributing to StackShade Courses

This repository is a multi-course learning platform. Each course owns its content; shared standards and templates keep all courses consistent.

## Where to put content

- Course-specific lessons, diagrams, labs, slides, projects, assessments and resources: `courses/<course-slug>/`.
- Reusable templates and editorial standards: `shared/`.
- Global website shell and navigation: `site/`.
- Build and deployment automation: `.github/workflows/`.

Do not add a new course's material to the root README or into another course's folder.

## Content standards

1. Teach from first principles. Define the problem before introducing a tool or product.
2. Be precise. Label assumptions, estimates, invariants and unknowns.
3. Show the system. Add a Mermaid diagram, sequence, table or experiment when it helps.
4. Explain trade-offs. Include when a design works, when it fails and what it costs.
5. Cite primary documentation, standards, research papers and first-party engineering posts. Summarize in your own words; never copy copyrighted diagrams, chapters or slides.
6. Make it testable. Include a lab, thought experiment, worked calculation or retrieval questions.
7. Link prerequisites and next steps. Keep links relative within a course.

## Lesson quality checklist

- [ ] Measurable learning objectives and prerequisites.
- [ ] Terms defined on first use.
- [ ] At least one useful visualization, worked example or comparison.
- [ ] Assumptions, units and limitations are explicit.
- [ ] Failure modes and trade-offs are discussed.
- [ ] Practical exercise and retrieval questions are included.
- [ ] Sources and attribution are clear.
- [ ] Status and review date are honest.
- [ ] Relative links resolve.

See [shared lesson quality standard](shared/standards/lesson-quality.md) and [source attribution guide](shared/standards/source-attribution.md).

## Adding a course

1. Read [the canonical course structure](shared/standards/course-structure.md).
2. Create `courses/<slug>/` using the shared templates.
3. Add `course.json` and a matching entry in `courses/catalog.json`.
4. Add its links to `site/_sidebar.md`.
5. Add Marp slide sources under `courses/<slug>/slides/`. CI discovers decks across every course.
6. Submit a change that explains the learning outcomes and source material.

A helper script at `scripts/new-course.sh` can scaffold the starting files.

## Naming conventions

- Lessons: `lessons/NN-topic-name.md`
- Labs: `labs/NN-topic-name.md`
- Case studies: `case-studies/NN-system-name.md`
- Projects: `projects/project-name/README.md`
- Slides: `slides/NN-topic-name.md`
- Diagrams: `diagrams/topic-name.mmd`

Generated PPTX files belong in the build output, not in source control. Markdown is the editable slide source of truth.

## Pull requests

Describe the learning gap, sources consulted, what changed, and how correctness was checked. For architecture changes, include a diagram and at least one alternative considered.
