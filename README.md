# StackShade Courses

**The learning and course-content hub for [StackShade on YouTube](https://www.youtube.com/@StackShade).**

This repository organizes multiple beginner-to-advanced educational courses. Every course has its own lessons, modules, slides, labs, projects, case studies, visualizations and curated references, while shared standards keep everything consistent.

## Start here

- [Product and multi-course plan](PLAN.md)
- [Claude website build prompt](CLAUDE_BUILD_PROMPT.md)
- [Minimal design system doc (Udemy-inspired)](shared/design-system/README.md)
- [Content authoring, visuals & HTML slides playbook](shared/guides/content-authoring-playbook.md)
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
├── CLAUDE_BUILD_PROMPT.md
├── courses/       # Independent courses and course catalogue
├── shared/        # Reusable templates, standards and resources
└── scripts/       # Course scaffolding and authoring helpers
```

The website is intentionally not implemented in this content-planning phase. The approved architecture and detailed implementation instructions are in `CLAUDE_BUILD_PROMPT.md`. The intended public site is https://stack-shade.github.io/courses/ after the Next.js implementation and GitHub Pages deployment are complete.

**Learning philosophy:** Learn → Understand → Visualize → Build → Experiment → Explain.
