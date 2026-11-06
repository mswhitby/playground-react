# React Design Lab — companion instructions

**Canonical project:** `mswhitby/playground`. The source-of-truth agent instructions and cross-chat project state live at `mswhitby/playground/AGENTS.md` and `mswhitby/playground/docs/HANDOFF.md`. **Read those first.** This repository (`mswhitby/playground-react`) is a temporary frontend preview/design sandbox; it is not the real Playground backend, identity service, or production application.

## React-lab-specific guidance

This repository is the **independent React Design Lab**, not the live student application.

## Start here in every new coding session

1. Read the **canonical** `mswhitby/playground/AGENTS.md` and `mswhitby/playground/docs/HANDOFF.md` first, then this repository's [docs/HANDOFF.md](docs/HANDOFF.md) for React-lab-specific progress.
2. Confirm current GitHub branch, PR, CI and deployment status; timestamps/SHAs in the handoff are historical snapshots, not guarantees of current state.
3. Inspect the relevant source files before changing code. Prefer continuing the current review PR unless the user requests a separate branch.
4. After substantial work, **update the canonical `mswhitby/playground/docs/HANDOFF.md` first**, even if the changes were only in React. Also update this repo's local `docs/HANDOFF.md` with React-specific details. Never claim a file was written, merged or deployed without verifying.

## Repositories and boundaries

- **React frontend / design lab:** `mswhitby/playground-react` (this repo).
- **Production Playground:** `mswhitby/playground`. Do **not** modify production code, real grading, student accounts or data unless the user explicitly asks.
- **Public website / hosted React preview:** `mswhitby/classroom`; publisher `.github/workflows/publish-react-cs1-preview.yml` checks out a pinned React commit and publishes to `playground/preview/`. Its root URL is `https://www.mswhitby.com/playground/preview/` (not `/preview/react/`).
- **Course repositories:** `mswhitby/computer-science-1`, `mswhitby/game-programming`, `mswhitby/mobile-app-dev`, `mswhitby/uil`; private `mswhitby/challenges` holds challenge answers/tests. Never expose private solutions, hidden tests, secrets or private student records in a public bundle.
- The independent journal/challenge preview HTML files under `mswhitby/classroom/playground/preview/` must remain intact when deploying the React preview.

## Important invariants

- CS1 in the React preview uses **real published curriculum** (10 units, 40 lessons), original IDs/names/Markdown/starter code; other courses remain mocks.
- Preserve old lesson IDs (including `unit-slug/lesson-slug`) and already-earned scores if content is revised or archived. Real progress comes from verified **earned points**, not a manual complete switch.
- Current React-only `Mark complete` is **visual demo state**. It must update progress, green sidebar dot and course-overview lesson card together, without recording scores.
- Student-chosen **course colors** govern lesson number tiles, selected tab accents and navigation. Status indicators are separate: green completed, yellow/orange assigned, red overdue. Never recolor the course-colored number tiles based on status; remove global purple/coral accent selectors.
- Keep Learn's paginated Markdown steps/hints; Solve first, Learn second. Previous/Next links are plain course-colored text with directional chevrons, real adjacent lesson names, and absent (not disabled) at boundaries.
- Editor uses locally bundled CodeMirror, syntax highlighting/auto-pairs and a resizable console; avoid third-party script CDNs blocked by the school network.
- Teacher Dashboard is class-specific; Admin Accounts is separate; Section setup opens beside the section selector.
- The current preview's teacher assignment editor uses fictional students and **browser-only drafts**. It is **not live assignment CRUD**. The Solution tab is locked until authenticated, authorized server-side answer retrieval exists.
- Never add real student personal information, Google Sheets URLs/tokens, Supabase service keys, or private solution files to this public repository.

## Workflow

- Run `npm test` and `npm run build`; confirm CI passes before reporting success.
- Only merge a PR when the user authorizes it; test a preview before merging when requested.
- Website preview is deployed by updating the pinned React SHA in the *classroom* publisher workflow; do not replace the live `/playground/` application.
- Prefer readable Markdown documentation. Keep long names, original published order, responsive wrapping and course themes intact.
- For a new **ordinary ChatGPT** project chat, the user or project instructions should explicitly request reading these GitHub files. Codex can automatically read root `AGENTS.md` when operating inside this repository; ordinary chat does not automatically ingest a GitHub repo.

**Current work and next action:** start at `mswhitby/playground/docs/HANDOFF.md` (canonical), then read this repo's `docs/HANDOFF.md`.
