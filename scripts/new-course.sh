#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: bash $0 <course-slug> \"Course title\" [description]"
  exit 1
fi

slug="$1"
title="$2"
description="${3:-A practical, project-based learning path.}"

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

## Start here

- [Roadmap](roadmap.md)
- [Curriculum](curriculum.md)

## Learning approach

Learn → recall → visualize → build → measure → explain.
EOF

cat > "$target/course.json" <<EOF
{
  "slug": "$slug",
  "title": "$title",
  "description": "$description",
  "level": "Beginner to Advanced",
  "status": "planned",
  "prerequisites": [],
  "topics": [],
  "entrypoint": "README.md"
}
EOF

cat > "$target/roadmap.md" <<EOF
# $title · Roadmap

- [ ] Foundations
- [ ] Core concepts
- [ ] Intermediate applications
- [ ] Advanced topics
- [ ] Capstone project
EOF

cat > "$target/curriculum.md" <<EOF
# $title · Curriculum

| Module | Topics | Practical output | Status |
|---|---|---|---|
| 01 | Foundations | Concept notes and diagram | Planned |
EOF

cat <<EOF
Created $target

Next:
1. Add lessons, labs, projects and slide decks.
2. Add an entry to courses/catalog.json.
3. Add links to site/_sidebar.md.
4. Review shared/standards/course-structure.md.
EOF
