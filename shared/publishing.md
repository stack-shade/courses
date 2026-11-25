# Publishing architecture and GitHub Pages

This file describes the publishing target. The website implementation is delegated to Claude; see the root [Claude build prompt](../CLAUDE_BUILD_PROMPT.md).

## Intended architecture

- Next.js App Router application under `apps/web/`.
- Fumadocs + MDX content source for multi-course documentation.
- Slidev for HTML-first presentation decks and PDF/PPTX exports.
- Static export for GitHub Pages; no runtime Node server or database required.
- GitHub Actions to validate, build, export slide assets, upload the artifact and deploy.

## Public URL

`https://stack-shade.github.io/courses/`

The implementation must configure the GitHub Pages project subpath `/courses` and verify deep-link routes and asset URLs in the built output.

## Manual repository setting

If the GitHub Actions identity cannot enable Pages, open [Settings → Pages](https://github.com/stack-shade/courses/settings/pages), choose **GitHub Actions** as the source, save, and rerun the deploy workflow.

## Slide authoring

Keep Slidev source Markdown under each course's `slides/` directory. Publish HTML decks for interactive teaching and offer PDF/PPTX exports for download. Generated outputs should normally remain build artifacts rather than committed source files.
