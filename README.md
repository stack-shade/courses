# StackShade Courses

**The learning and course-content hub for [StackShade on YouTube](https://www.youtube.com/@StackShade).**

This repository organizes multiple beginner-to-advanced educational courses. Every course has its own lessons, modules, slides, labs, projects, case studies, visualizations and curated references, while shared standards keep everything consistent.

## Start here

- [Product and multi-course plan](PLAN.md)
- [Minimal design system doc (Udemy-inspired)](shared/design-system/README.md)
- [Content authoring, visuals & HTML slides playbook](shared/guides/content-authoring-playbook.md)
- [Web application (`apps/web/`)](apps/web/package.json)
- [Course catalogue](courses/README.md)
- [Repository structure standard](shared/standards/course-structure.md)
- [Shared templates & guides](shared/README.md)
- [Contributing guide](CONTRIBUTING.md)

## Courses

| Course | Level | Scope | Status |
|---|---|---|---|
| [System Design: Beginner → Advanced](courses/system-design/README.md) | Beginner to advanced | 9 Modules · 40 Lessons · 14 Labs · 16 Case Studies | In progress |

More courses will be added independently under `courses/<course-slug>/`.

## Repository map

```text
.
├── README.md
├── PLAN.md
├── apps/web/      # Next.js static site + presenter mode + neuroscience practice arena
├── courses/       # Independent courses and course catalogue
├── shared/        # Minimal design system, visuals engine, templates and guides
├── scripts/       # Slide HTML compiler and course scaffolding helpers
└── .github/workflows/pages.yml
```

The static site deploys to `https://stack-shade.github.io/courses/` via GitHub Actions (`apps/web/out/`).

**Learning philosophy:** Learn → Understand → Visualize → Build → Experiment → Explain.
