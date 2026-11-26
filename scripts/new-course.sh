#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: bash $0 <course-slug> \"Course title\" [description]"
  exit 1
fi

slug="$1"
title="$2"
description="${3:-A practical, beginner-to-advanced learning path from first principles.}"

if [[ ! "$slug" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
  echo "Error: slug must be lowercase kebab-case (example: backend-engineering)."
  exit 1
fi

target="courses/$slug"
if [[ -e "$target" ]]; then
  echo "Error: $target already exists."
  exit 1
fi

mkdir -p "$target"/{lessons,modules,slides,labs,projects,case-studies,diagrams,resources,assessments,downloads}

cat > "$target/README.md" <<EOF
# $title

$description

- **Level:** Beginner → Advanced
- **Status:** Planned
- **YouTube Channel:** [@StackShade](https://www.youtube.com/@StackShade)

## Start Here

- [Roadmap](roadmap.md)
- [Curriculum](curriculum.md)
- [Detailed Syllabus](syllabus.md)

## Learning Approach

Learn → Understand → Visualize → Build → Experiment → Break → Explain.
EOF

cat > "$target/course.json" <<EOF
{
  "slug": "$slug",
  "title": "$title",
  "subtitle": "$description",
  "description": "$description",
  "level": "Beginner to Advanced",
  "status": "planned",
  "featured": false,
  "category": "Software Engineering",
  "estimatedHours": 0,
  "prerequisites": [],
  "outcomes": [],
  "topics": [],
  "modules": [],
  "downloads": {
    "formats": ["html", "pptx", "pdf"]
  },
  "youtube": {
    "channel": "https://www.youtube.com/@StackShade",
    "playlist": null,
    "videos": []
  },
  "entrypoint": "README.md",
  "roadmap": "roadmap.md",
  "curriculum": "curriculum.md",
  "syllabus": "syllabus.md"
}
EOF

cat > "$target/roadmap.md" <<EOF
# $title · Roadmap

- [ ] Stage 1 · Foundations
- [ ] Stage 2 · Core Concepts
- [ ] Stage 3 · Intermediate Applications
- [ ] Stage 4 · Advanced Topics & Capstone
EOF

cat > "$target/curriculum.md" <<EOF
# $title · Curriculum

| Module | Topics | Practical output | Status |
|---|---|---|---|
| 00 | Foundations | Concept notes and Mermaid diagram | Planned |
EOF

cat > "$target/syllabus.md" <<EOF
# $title · Detailed Syllabus

Follow \`shared/guides/content-authoring-playbook.md\` to map lessons, Mermaid diagrams, animations, slide decks, YouTube slots, and primary sources.
EOF

cat <<EOF
Created $target

Next:
1. Map modules and lessons in $target/curriculum.md and $target/syllabus.md.
2. Add an entry to courses/catalog.json.
3. Review shared/standards/course-structure.md and shared/guides/content-authoring-playbook.md.
EOF
