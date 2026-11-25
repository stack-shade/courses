# Claude Code Master Prompt — Build StackShade Courses

You are the autonomous principal engineer, product designer, UX architect, design-systems engineer, technical writer and QA lead for **StackShade Courses**, the multi-course educational platform for https://www.youtube.com/@StackShade.

Your job is to inspect the existing repository, make independent decisions, build an excellent production-ready website, validate it, and prepare the GitHub Pages deployment. Do not stop at a mockup or a written plan. Implement the working product.

Read these first:
- `PLAN.md` — product vision, architecture recommendations, course structure, curriculum, teaching/presenter workflow, technology preferences and definition of done.
- `README.md` and `CONTRIBUTING.md`.
- `courses/catalog.json` and every file under `courses/system-design/`.
- `shared/standards/` and `shared/templates/`.

The repository is the source of truth. Preserve and surface the current System Design content. Do not delete good material merely to simplify your implementation.

---

## 1. Your autonomy — take ownership and improve the idea

You have significant autonomy. **Do not behave like a code generator waiting for every tiny instruction.** Behave like a senior team member who owns the outcome.

- Make sensible decisions independently when requirements are incomplete.
- You may add, remove, replace or combine libraries when you can explain why the result will be better.
- You may invent thoughtful product features, navigation patterns, visualizations, learning interactions, course discovery flows, motion details and responsive behaviors beyond the explicit plan.
- Improve the information architecture if you discover a better approach.
- Add delightful details that improve learning, teaching or usability, not decoration for its own sake.
- Research the latest official documentation before selecting package APIs or versions. Choose stable compatible releases, not canary/experimental packages unless a clear need exists.
- If a planned package is incompatible with static export or current dependencies, select a better solution and record the reason.
- Make reasonable assumptions and document them. Do not interrupt the build to ask me questions for decisions you can safely make.
- Do not blindly follow the specification when you can produce a demonstrably better result. Preserve its intent and explain major deviations in `IMPLEMENTATION_NOTES.md`.
- Do not overengineer. A simple reliable solution is better than an elaborate unfinished architecture.
- Finish the full workflow: build, type-check, lint, test, inspect the production export and fix the issues you find.

Use initiative, taste and engineering judgment. The specification is a strong starting point, not a ceiling.

## 2. Product identity

Build **StackShade Courses**, not a generic documentation template and not a single-course microsite.

The platform serves multiple courses under one cohesive brand. The first course is System Design: Beginner to Advanced. Future courses must be addable through content and metadata rather than bespoke page code.

The main audience is YouTube viewers, students and developers who want visual, practical, technically reliable education.

Design direction:
- Premium editorial learning platform with a playful technical personality.
- Deep ink / midnight background as the primary visual canvas, vivid lime accent close to `#A3E635`, warm off-white text and restrained secondary cyan/blue/orange accents.
- Beautiful typography, generous spacing, strong hierarchy, crisp cards, subtle grid/diagram motifs and thoughtful motion.
- Use a polished dark theme first and a genuinely designed light theme too.
- Avoid generic AI-looking gradients everywhere, excessive glassmorphism, huge rounded cards on every element, template-looking dashboards and unnecessary visual noise.
- A learner should feel that the platform was designed by an engineer who knows how to teach.
- Use the StackShade name and link to https://www.youtube.com/@StackShade. Do not invent a logo asset if none exists; make a tasteful text/mark system and leave a clear location for official brand assets.

The site must look excellent at 1440px, tablet and phone sizes.

## 3. Repository architecture

Keep this ownership model:

- `courses/<slug>/`: course-specific content.
- `shared/`: cross-course templates, standards and common resource links.
- `apps/web/`: the Next.js application you will create.
- `public/`: shared brand assets and local static media.
- `scripts/`: authoring, validation and export helpers.
- `.github/workflows/`: CI and GitHub Pages deployment.

Do not move all content into a hardcoded TypeScript array. The platform must read its content from the existing course files and metadata. You can introduce an efficient content source layer or reorganize formats when needed, but preserve all current learning material and relative links.

Use and validate:
- `courses/catalog.json` for the course catalogue.
- Each course's `course.json` for course metadata.
- Markdown/MDX documents for lessons, labs, modules, resources, projects and case studies.
- Explicit metadata schemas, preferably Zod.
- A robust source loader that can handle multiple courses without one-off route code.

Create a course scaffold command or improve the existing helper so future courses get a correct starting structure and metadata.

## 4. Recommended stack — verify and decide

Preferred starting point:
- Latest stable **Next.js App Router** compatible with current stable React.
- React Server Components for static content and client components only for real interactivity.
- **Fumadocs + Fumadocs MDX** for documentation navigation, MDX source, table of contents, breadcrumbs and docs primitives.
- **Tailwind CSS v4**.
- **shadcn/ui** with accessible primitives for common UI.
- **lucide-react** icons.
- **Motion for React** for small, purposeful transitions.
- **next-themes** for light/dark theme.
- **Zod** to validate course metadata and content.
- **Shiki / rehype-pretty-code** for beautiful code blocks and copy buttons.
- **remark-gfm** for tables/task lists, **remark-math + KaTeX** for technical math when needed.
- **Mermaid** for text-authored diagrams.
- **@xyflow/react** for interactive node-based architecture diagrams and simulations.
- **Recharts** or Observable Plot for data charts when appropriate.
- **@codesandbox/sandpack-react** for safe, isolated runnable frontend examples (lazy load it).
- **Slidev** for browser-first HTML presentations and PDF/PPTX exports.
- **Vitest**, **Playwright**, and **axe-core** for tests and accessibility checks.
- **pnpm** and a committed lockfile.

Do not install every package just because it is listed. Choose only what you will actually use. Avoid duplicate systems that solve the same problem.

### Static export is a hard requirement

The first deployment target is GitHub Pages at:

`https://stack-shade.github.io/courses/`

Configure Next.js static export with `output: 'export'`. Correctly handle the repository base path `/courses`, route links, asset URLs, images, local fonts, HTML exports and trailing slashes.

This is a static site:
- no mandatory Node server;
- no server actions or runtime API requirements;
- no database or authentication requirement;
- no runtime route handlers;
- no server-dependent search.
- do not require environment secrets for a local static build.

If Fumadocs defaults to a server-first mode, configure its documented static build and client-side search/index generation. Verify the exact current documentation. Use a local static search index; use Pagefind if it is a cleaner and more reliable fit than Fumadocs' built-in static search for this multi-course content set.

Implement all required dynamic routes with static params generated from the course catalogue and content. The site must work at the GitHub Pages subpath, not only at localhost root. Test deep links after deployment.

Keep the architecture portable so it can move to a server-capable host in the future, but do not sacrifice the GitHub Pages build.

## 5. Required product experience

Build a complete and polished platform.

### Home page
- Memorable StackShade hero and concise promise.
- Clear buttons to browse courses and visit the YouTube channel.
- Featured courses with category, level, status, description and visual cover.
- "Choose your path" / beginner-to-advanced entry points.
- Recently added lessons or modules, driven by course metadata.
- A small explanation of the Learn → Visualize → Build → Explain method.
- Responsive footer with course, GitHub and YouTube links.

### Course catalogue
- Search/filter by topic, difficulty, status and course category.
- Attractive course cards with progress/status labels and useful metadata.
- No fake ratings, fake user counts or fake testimonials.
- Empty state, loading state and mobile filter behavior.

### Course overview
- Hero, audience, prerequisites, learning outcomes and estimated time.
- Curriculum and roadmap visualization.
- Module list with completion/status.
- Projects, case studies and key resources.
- Related YouTube playlists/videos.
- Strong "Start this course" or "Continue learning" CTA.

### Lesson workspace
- Excellent two/three-column responsive learning layout.
- Collapsible module/lesson sidebar with active state.
- Breadcrumbs, course/module context, level, estimated duration and status.
- Reading column with excellent typography and code formatting.
- Table of contents with scroll tracking.
- Video embed, chapter links and transcript/captions when video metadata exists.
- Diagrams, formulas, examples, callouts and comparison tables.
- Exercises and quizzes with helpful feedback and answer reveals.
- Sources and further reading.
- Previous/next lesson navigation and related content.
- Print-friendly styles.
- Keyboard shortcuts where appropriate.
- Local progress with a clear reset option. Use local browser storage only; no account should be required.

### Global search
- Search titles, body text, glossary, tags, modules and resources.
- Keyboard shortcut (for example `/` or Cmd/Ctrl+K), clear escape behavior and accessible dialog.
- Highlight matches and link directly to the relevant lesson section.
- Search must work offline from the built static site after the files have loaded.

### Glossary / resource library
- Searchable glossary.
- Curated external links with descriptions, source type, difficulty and topic.
- Never label a source free if it is not.
- Prefer original sources and make attribution obvious.

### Diagrams and interactive learning
- Render Mermaid diagrams consistently in lessons.
- Add interactive React Flow diagrams where clicking nodes or toggling states actually teaches something.
- Useful examples: request lifecycle, load-balancer algorithms, cache hit/miss, replication and consistency, queue consumer groups, shard distribution, circuit breaker state transitions.
- For simulations, expose inputs and explain the resulting state. Do not add inert controls.
- Add chart-based examples only where data supports a real learning goal.
- Provide a readable static fallback for every important interactive visualization.

## 6. Slides and HTML presentation mode

This part is important. I may teach by showing the website itself or by opening an HTML slide deck and explaining each concept while recording my screen.

Use **Slidev** as the preferred HTML-first presentation system unless your research finds a better compatible option. It should support:
- Full-screen, responsive HTML slides.
- Keyboard navigation, progress indicator and presenter controls.
- Speaker/presenter notes where useful.
- Diagrams, syntax-highlighted code, formulas, images and embedded demos.
- A link back to the related course lesson.
- PDF and PowerPoint exports, with source retained in Git.
- A consistent StackShade theme.
- A way to open the presentation directly from its course/lesson page.

Preserve interactive HTML presentation behavior in the browser. Be honest that exported PDF/PPTX files cannot preserve every live interaction. Offer visually faithful PPTX and editable PPTX exports when supported, and document their differences.

Do not just export every deck as a stack of screenshots and call it interactive. The browser presentation is the primary teaching experience; PPTX/PDF are distribution formats.

## 7. Live webcam overlay / presenter mode

Implement a genuinely useful, optional **Presenter Mode** so I can teach from a lesson page or HTML deck.

### User flow
1. Open a lesson or an HTML slide deck.
2. Click "Presenter Mode".
3. Click "Enable camera" only when I choose to.
4. Grant browser camera permission.
5. A live webcam bubble appears on top of the lesson/slide content.
6. Move it where it does not cover important content, resize it, select circle or rounded rectangle, and show/hide it.
7. Record the browser window with OBS or whatever external capture/recording software I use.

### Requirements
- Camera is **off by default**.
- Start `navigator.mediaDevices.getUserMedia({ video: true, audio: false })` only from an explicit user action after explaining why permission is requested.
- Display a local `<video>` preview only. No upload, stream relay, backend, analytics capture, recording or persistence of camera footage.
- Stop all media tracks when disabled, when component unmounts or when leaving presenter mode.
- Default webcam framing is a clean circular crop. Offer rounded rectangle as an alternative.
- Drag-and-drop positioning, snapping to safe corners, resize controls and reset position.
- Mirror preview toggle, show/hide toggle, camera-off indicator and permission-denied/device-unavailable states.
- Never cover the slide navigation or important slide content by default.
- Ensure the camera layer is above the lesson or slide presentation layer with correct stacking.
- Support keyboard access and visible focus.
- Respect reduced motion.
- Optional browser Picture-in-Picture is an enhancement, not a dependency.
- Test that the overlay appears in ordinary screen/window capture.

If slides run in an embedded frame, design the parent presentation shell so the camera overlay can sit above the frame. Prefer same-origin static deck output under the site where feasible. Avoid complicated cross-origin camera plumbing.

**Do not build a video-recording backend.** I may use an external capture app. The purpose is to make the website browser view record-ready.

## 8. YouTube integration

- Prominent channel links to https://www.youtube.com/@StackShade.
- Course metadata can reference channel ID, playlists, videos, thumbnail, chapters and transcript/caption locations.
- Embed with privacy-enhanced YouTube URLs where possible.
- No autoplay with sound.
- Add "Watch on YouTube" links and a related-video block.
- Support lessons with no video yet without breaking the content page.
- Make it easy for me to add the video ID and chapters after publishing a video.

## 9. Visual design and interaction quality

Take design ownership. Do not make a generic docs theme and call it a day.

Create:
- Cohesive design tokens for colors, type, spacing, radius, shadows, borders and focus rings.
- Excellent nav/sidebar/drawer and responsive reading layout.
- Clear typography for long technical content.
- High-quality lesson cards, course cards, tags, difficulty markers and status.
- Diagram frames with captions and explanatory legends.
- Strong code blocks with language labels and copy button.
- Calm, meaningful motion and hover states.
- Well-crafted empty, error, loading and not-found states.
- Light and dark themes.
- Professional favicon and social preview / Open Graph artwork using the brand mark.
- A tiny set of visual motifs that are repeated consistently.

Use real content from the repository in the page designs. Do not fill the home page with lorem ipsum or fake data.

## 10. Content and curriculum

Use the current `courses/system-design/` content. Preserve all existing lessons and resources. Improve broken links and navigation, but do not silently rewrite correct technical explanations.

The course path should span:

**Foundations**
- system thinking, requirements, NFRs, estimation;
- Internet, DNS, TCP/TLS/HTTP, proxies and CDNs;
- APIs, data modeling, relational/NoSQL data stores, indexes and storage internals.

**Building blocks**
- caching, load balancing, stateless services and concurrency;
- queues, streams, workers, retries and delivery semantics;
- replication, partitioning, sharding, search, object/media storage and security.

**Distributed systems and reliability**
- partial failure, consistency, CAP with accurate nuance, quorum, consensus, clocks and coordination;
- outbox, saga, CQRS and event sourcing;
- logs, metrics, tracing, SLIs/SLOs, overload, backpressure, DR and multi-region.

**Architecture mastery**
- requirement discovery, sizing, API/data architecture, alternatives, cost, migrations, security, deployment and incident response.

Case-study coverage should include URL shortener, pastebin, rate limiter, notification platform, news feed, chat, file storage/sync, video platform, search, ride hailing, payment ledger, ticket booking, metrics pipeline and distributed scheduler.

Do not create 50 empty lessons. Build the website around the available content; create a coherent curriculum map for planned content, but label every future module clearly as planned.

## 11. Build and deploy

Create the Next.js app under `apps/web/`.

Add:
- `pnpm` workspace or simple single-app package setup, whichever is cleaner.
- reproducible package lock.
- `README` with install, dev, build, test, content-authoring, slide export and deployment instructions.
- strict TypeScript.
- formatter/linter.
- typecheck, lint, test and production build scripts.
- route and content validation.
- GitHub Actions workflow that installs dependencies, runs checks, exports HTML slides and PPTX/PDF assets as configured, runs Next static export, uploads the artifact and deploys to GitHub Pages.
- configure Pages for project site `/courses` and verify asset paths.
- keep generated `.next`, `out`, caches and exported binaries out of source control unless a deliberate reason exists.

If GitHub Pages must be enabled manually because the token cannot change repository settings, document exactly what I need to click. Do not claim deployment worked unless the Actions run and public URL confirm it.

## 12. Testing and acceptance

At minimum:
- Install from a clean checkout.
- Run formatting/lint and TypeScript checks.
- Run unit tests.
- Build static output.
- Verify every course route has a generated HTML file.
- Verify deep links work with the `/courses` base path.
- Verify all internal links, image paths and slide links.
- Verify search data exists and the client can search it.
- Run Playwright through home → catalogue → course → lesson → slide deck.
- Test mobile menu and responsive layout.
- Test presenter mode with camera denied, camera allowed and camera disabled again.
- Verify all media tracks stop when camera is turned off or route changes.
- Verify webcam bubble is in the captured browser composition and never uploaded.
- Check keyboard focus, headings and axe accessibility results.
- Review screenshots at desktop, tablet and mobile sizes. Fix visual bugs rather than just reporting them.

## 13. Commit and push discipline

Keep Git history clean. Do not create one commit per file or every few minutes.

- Work in cohesive batches.
- Make **1–3 meaningful commits total** for the complete implementation, or at most 4 if there is a real separation (for example: app foundation, content integration, presenter/slides, final deploy).
- Use descriptive messages.
- Push the finished work to the repository's main branch only after checks pass.
- Never force-push or rewrite history.
- Do not commit build output, secrets, private media or user camera data.

## 14. Final handoff

When done, report:
1. What you built and meaningful autonomous improvements you made.
2. Main stack and why you chose it.
3. Routes and key features.
4. How course content is authored and how a new course is added.
5. How to author/export/present HTML slide decks.
6. How to enable and use the webcam overlay and record with external capture software.
7. Tests and build/deployment results with links.
8. Any remaining manual GitHub Pages setting.
9. Remaining planned items clearly separated from finished features.

Now inspect the repository and start. Make decisions, implement the complete experience, test it, and push the finished result. Do not stop after creating a plan or a landing page.
