# Ms. Whitby's Playground — working handoff

**Last updated:** November 6, 2026 (America/Chicago).  
**Primary repo:** `mswhitby/playground-react`  
**Read first:** `AGENTS.md` in this repo.  
**Purpose:** A reliable start-of-chat snapshot. Re-check live GitHub state before acting; this document is not a substitute for current PR or build status.

## Where we are right now

- **Production** is separate: `mswhitby/playground`, published under `https://www.mswhitby.com/playground/`. Do **not** change production unless explicitly asked.
- **React design preview** is hosted under `https://www.mswhitby.com/playground/preview/` using hash routes. For a browser-copyable teacher page: `https://www.mswhitby.com/playground/preview/#/teacher`. Admin mock: `https://www.mswhitby.com/playground/preview/#/admin`.
- **Hosting repo:** `mswhitby/classroom`. `.github/workflows/publish-react-cs1-preview.yml` checks out an exact commit of `playground-react`, runs tests, builds, and safely copies only React preview assets. Journal/challenge standalone preview files remain separate.
- **PR #9** was merged into React `main`, bringing in authentic CS1 content and legacy name/ID support.
- **PR #10** is **OPEN / NOT MERGED**: `https://github.com/mswhitby/playground-react/pull/10`; branch `course-accents-editor-teacher-catalog`. At this snapshot its head was `a60dd68dda4195e765a0c37eaeebb7bf83510474`.
- **Tests/build** passed at GitHub Actions run `42311186343` (React repo); preview publisher and GitHub Pages deployment also completed successfully at that snapshot. Hosting workflow was pinned to the PR #10 head above. Verify again after changes.
- **React main** at this snapshot: `22ab66fe951bfdbac5548c45d18bae1b2543562b` (not PR #10 yet).

## What the React preview already supports

- Authentic **Computer Science I** (10 units, 40 lessons) from published course data: full original names, IDs, Markdown, hints, Learn steps, starter code, public practice Python Run/Check. All other course curricula still use mock content.
- Student course color customization, course-color accents and number tiles; green **Completed**, yellow/orange **Assigned**, red **Overdue** indicators. Manual completion updates the sidebar dot, course overview lesson card and progress bar together in the **preview only**.
- Solve/Learn tabs and Markdown step pagination; subtle Prev/Next chevron text links that disappear at unavailable first/last positions. Neighboring lesson navigation displays **both** previous and next lesson names.
- Bundled CodeMirror editor with syntax highlighting, enclosure auto-closing, bracket matching, indentation and a resizable editor/console.
- Student grades and other fictional class records used for visual design; these are **not live records**.
- Teacher Dashboard **Curriculum** tab loads the **public published CS1 catalog**, shows starter code and original points, and now has **browser-only assignment drafts**: whole section or selected sample students, due dates and editable points, update/remove. No student receives these assignments.
- Curriculum **Solution** tab is deliberately locked: answers must come from authenticated server-side storage, **never public frontend files**.
- Accounts moved from Teacher Dashboard to a distinct **Admin Dashboard** mock; section setup is a button beside the section selector instead of a class-specific tab. Admin mock is **not role-protected** and contains **no real accounts**.

## Most important NEXT WORK

**Connect React's teacher dashboard to the existing authenticated Playground student data**, safely, before wiring real assignments/solutions.

1. Examine the **existing production implementation** before building a second auth system. `mswhitby/playground` already has GitHub sign-in / auth-callback and Supabase integration in public scripts (e.g. `public/account.js`, `public/classroom-client.mjs`, `public/teacher-directory.mjs`, `public/teacher-history.mjs`, `public/google-sheet-roster.mjs`) plus teacher-only SQL functions/migrations. GitHub sign-in must bind real users and enforce backend teacher/admin roles; **sign-in alone does not authorize teacher access**.
2. After role and session validation, replace **fictional class roster, account links, per-student practice, weekly points, assignment history** with permitted, class-scoped teacher data. Preserve privacy and earned-point grading semantics (including Central Time weeks and no repeat-score inflation).
3. Add **real teacher assignment operations** (whole section or selected real students, due date and points overrides) only through authorized backend endpoints; avoid a localStorage-only “success” claim in the real flow.
4. Implement **teacher-only solutions** through protected access; the public site must not bundle solution code or hidden tests.
5. Restrict **Admin dashboard** to verified admin roles before showing any real directory data. It currently contains only fictional demo data.
6. Keep original legacy lesson names/IDs stable and do not replace production `/playground/` when working on the preview.

**Open architectural questions to verify in the production backend:** existing role and enrollment guards, whether teacher endpoint already supports assignment due date/point overrides and per-student targeting, and how private solutions are stored. No need to invent a separate authentication service if the present integration can be reused.

## Design decisions to preserve

- A **single** Playground with six course areas; real CS1 now, mocks for the others while migrating.
- Students choose their own accent per course (Canvas-like), never global red/purple choices.
- Status colors apply only to dot/tag, **not** lesson numbers or other course accents.
- The editor sits with its Console/Checks below; panels can be resized.
- Original lesson Markdown must render naturally, including hints, inline yellow code, and paginated Learn instructions.
- Navigation is unobtrusive: plain course-colored chevrons, dynamic previous/next names, hidden unavailable controls.
- Preserve already-earned points across curriculum revisions and archiving; score/progress should ultimately reflect server-verified grades, not a manually checked box.
- Avoid CDs/external CDN scripts blocked on campus. Keep static preview under `mswhitby.com` for school access.
- User prefers **raw URLs in fenced text blocks** so they can copy from their phone to their computer. Include a copyable preview URL with each deployment.

## Relevant code and test entry points

- `src/App.jsx` — routes and browser-state data.
- `src/lib/routes.js` — clean/local vs hosted hash URLs.
- `src/data/courses.js`, `src/data/liveCs1/`, `src/lib/courseContent.js` — full CS1 content and title/ID normalization.
- `src/components/course/`, `src/styles/course.css`, `src/styles/learning.css` — lessons, Solve/Learn, editor, status visuals.
- `src/components/teacher/TeacherCurriculum.jsx`, `src/lib/previewAssignments.js` — public curriculum + demo teacher assignment UI.
- `src/pages/TeacherDashboard.jsx`, `src/pages/AdminDashboard.jsx`, `src/components/teacher/TeacherToolbar.jsx` — class/admin separation.
- `tests/` — Node tests; `npm test` and `npm run build` before merge/deployment.

## Session closing checklist — UPDATE THIS FILE

At the end of each material change, revise this handoff with **(a)** date, **(b)** exact repo/branch and open PR status, **(c)** what changed and what's still mock, **(d)** tests + preview deployment status (verified only), **(e)** next actionable task. Keep it concise enough for a fresh chat to consume and do not add secrets or real student information. A new chat should first request: **“Read `AGENTS.md` and `docs/HANDOFF.md` from `mswhitby/playground-react`, verify latest PR/deployment, and continue the next step.”**
