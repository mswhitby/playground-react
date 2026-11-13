# React Design Lab — supplemental working handoff

**This file is a React-specific supplement, not the platform's master record.** Always read `mswhitby/playground/AGENTS.md` and `mswhitby/playground/docs/HANDOFF.md` first. The **actual Playground** resides in `mswhitby/playground`, and its built production artifact is served from `mswhitby/classroom/playground/`. This React repo only prototypes frontend updates at `/playground/preview/`.



**Last updated:** November 6, 2026 (America/Chicago).  
**Primary repo:** `mswhitby/playground-react`  
**Read first:** canonical `mswhitby/playground/AGENTS.md` and `mswhitby/playground/docs/HANDOFF.md`, then local `AGENTS.md`.  
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

## React-lab-specific next work (after reviewing canonical handoff)

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

At the end of each material change, update `mswhitby/playground/docs/HANDOFF.md` **and then** revise this supplemental handoff with **(a)** date, **(b)** exact repo/branch and open PR status, **(c)** what changed and what's still mock, **(d)** tests + preview deployment status (verified only), **(e)** next actionable task. Keep it concise enough for a fresh chat to consume and do not add secrets or real student information. A new chat should first request: **“Read `AGENTS.md` and `docs/HANDOFF.md` from `mswhitby/playground/main` first, then check the React companion handoff and latest PR/deployment.”**

## November 12, 2026 — React course-content migration (review PR #10; NOT production)

**Decision:** prioritize the frontend/content migration and isolated /playground/preview/ review before new TSI curriculum writing or writing other course lessons. Preserve authoring repos and production backend. React code changes live in the open `course-accents-editor-teacher-catalog` PR #10; do not merge without explicit approval.

- CS1 retains its authentic published 40-lesson React snapshot, original IDs and Python browser public-example Run/Check.
- Game Programming reads 7 published units, 11 original C#/Unity companion lessons, student-facing Markdown, starters, and Unity activity descriptions from **existing** same-origin `/playground/data/game-programming/`.
- Mobile App & Web reads all 4 published competency lessons **plus three separate guided projects**, preserving project and step IDs and a single browser-local code draft across each project's steps; no example-solution files are fetched.
- UIL reads the published written-practice questions and 6 Java lessons with Java starters. The written reading omits answers/explanations in its React-generated content. Java/C# and web Run/Check remain mocked in React, not graded.
- TSI reads the existing 20-day schedule, four authored draft strand lessons, published 24-question practice diagnostic, and 81 MATH locator profiles; missing sessions are labeled unfinished. TSI diagnostic and placement remain browser-only, instructional—not official TSIA2 readiness scores or enrolled student data.
- Capstone remains visibly unpublished because it has no canonical curriculum repository. No fictional Capstone lessons appear in the migrated views.
- Shared lesson/course navigation, links, Learn/Markdown reading, projects, resizable editor/console, and course colors are reused. All course grade data and assignments on student-facing migrated views are **empty**, rather than fabricated. Teacher and admin pages continue to use explicitly fictional UI demonstrations; no real role-gated backend writes, login, submissions or verified grading were integrated.
- New `src/lib/publishedCourseLoader.js` only requests student-facing published files from `/playground/data/`, with path safety and hard failure on unavailable content. It never fetches the private challenge bank, hidden tests or teacher keys. New `tests/migrated-course-content.test.mjs` exercises course IDs, projects, TSI drafts and privacy protections.
- **Validation:** GitHub Actions React `npm test` and `npm run build` passed on SHA `98520191647693868ead20b71566a184b9be78c6` (run `43259246953`). Further small safety/UI commits and documentation must be retested at their final SHA before deploying.
- **Deployment status at authoring:** React publisher in `mswhitby/classroom/.github/workflows/publish-react-cs1-preview.yml` is pinned to an older reviewed React SHA; **this migration has not yet been republished or website-verified**. Publishing an updated tested SHA is allowed only to isolated `/playground/preview/`; the production `/playground/` app must not be modified.

**Next:** verify the final React test/build run; pin the tested commit in the classroom preview-only workflow; confirm successful publisher and Pages deployment and direct course/project/TSI links. Then review UI and preserve `mswhitby/playground` GitHub sign-in, authorized teacher functions, server grades, course runtimes and student history when integrating into the central app through a new unmerged PR. Resume TSI/other course content authoring only afterward.

## November 12, 2026 — live browser Run/Check development (review pending)

**User-approved scope:** make React checks resemble the live Playground's expected/received cards and run actual Python, Java, C#, HTML, CSS, JavaScript, React and public shared-bank examples in the isolated preview. **Keep Submit disabled; no trusted grading, point awards, roster data or teacher operations.**

- React `CodePane` and `ConsolePane` now share a structured pass/review grid of publicly authored checks, separate Console and browser Preview tabs, running status, error feedback and a disabled Submit button. The optional public-check fraction is labeled practice-only.
- Python continues to execute in the existing preview Pyodide worker; public function examples now display a real returned value on Run and individual pass/received/expected values on Check.
- C# and Java load the same-origin public production browser worker/runtime modules lazily from `/playground/`; lesson checks use the production's C# Roslyn checker and Java public example contracts. C# shared-bank array outputs use structural comparison. Java 26 file-input tasks explicitly remain IDE-only.
- HTML, CSS, JavaScript and React use a sandboxed `iframe srcDoc` with actual user code and runtime DOM checks. Existing guided Mobile App projects reuse published production step validators (`project-preview.mjs`); students keep a shared browser-local draft across steps.
- The shared Challenge Bank now uses this common workspace for Python, Java, JavaScript and C# with the **already public** sample cases; no private solutions or hidden tests are bundled. Legacy mock Submit and simulated check messages in these views were replaced; submission/grade APIs are not called.
- New `src/lib/livePreviewRuntime.js`, `src/lib/previewChecks.js`, `tests/live-language-checks.test.mjs`; updated `src/components/course/{CodePane,ConsolePane,ProjectWorkspace}.jsx`, `src/pages/ChallengeDetail.jsx`, shared CSS and relevant prior tests.
- **Testing before publication:** JavaScript syntax checks and sandbox JS public-example execution were inspected. CI/build and the publisher's exact-commit npm test/build gate **must pass on the final SHA** before declaring the website updated. The last published preview remains the verified curriculum migration until then.
- **Limitations:** supported browsers and school CDN access still determine whether Pyodide loads; Java file I/O tasks need a full Java 26 IDE; no hidden grading, sandboxed execution trust, official grades or server submissions. Do not imply the client-side checker is authoritative.

**Next:** pin the final reviewed React commit in `mswhitby/classroom/.github/workflows/publish-react-cs1-preview.yml`; verify the isolated publisher tests/build, the Pages deployment and real course links. Once approved, port the reviewed frontend to the canonical Playground against its existing authentication, grading and runtimes. Do not merge/deploy production without explicit user approval.

### Verified React live-practice preview publication — November 12, 2026

- React open PR #10 unmerged at `4b52173a8260bed39beed5d77ba1557b45331ce9`. No canonical main Playground application change.
- Preview publisher workflow pinned exact SHA and committed as `mswhitby/classroom` `22451152db596593f1e4e7c0d4437c2238254045`.
- Publisher run `43268280514` succeeded: **66 tests passed, zero failed**, hosted Vite build succeeded and isolated preview publish succeeded. An earlier Vite failure for a Python helper import was fixed before this successful release.
- Generated classroom preview commit `12b1d269b9030c8afe385e3db2358400823a118d` changes only `playground/preview/index.html` and three React preview assets; it does not change production application artifacts.
- GitHub Pages deployment `43268373582` **succeeded** for this commit. Preview URL: https://www.mswhitby.com/playground/preview/ . No in-browser UI click-through or campus network test performed in this session.
- Python uses Pyodide with a CDN that can be affected by school filtering. Java file-I/O tasks require Java 26 IDE, and Unity gameplay scenes require Unity. All client checks are public-example practice, never trusted grading; Submit remains disabled.
- **Next:** review deployed functional Run/Check/Preview in every course on actual browsers, then port approved React UI to canonical Playground while preserving role-protected student data and server grading. Neither React PR #10 nor handoff PR #32 may be merged without authorization.

## November 12, 2026 — Mobile App & Web multi-file preview (production unchanged)

**Decision:** In the React course preview, each Mobile App & Web lesson uses three separately editable browser-local files: `index.html`, `styles.css`, `script.js` (React: `App.jsx` in place of `script.js`). Run/Check assemble those linked files into the existing isolated browser preview. The HTML source visibly references its separate stylesheet/script; students no longer need to edit inline CSS or JS in a giant HTML document. Source folders and IDs remain owned by `mswhitby/mobile-app-dev`.

**Implementation** (`mswhitby/playground-react` PR #10, still open, branch `course-accents-editor-teacher-catalog`):
- `src/components/course/WebFilesPane.jsx` owns independent, tabbed, per-file drafts for each lesson/project and a common preview/console/checks panel. It opens the relevant file when a guided project advances to HTML, styling or JavaScript; project steps retain one **shared project** file set, while different lessons/projects have isolated draft keys. Save, Reset, download of the selected file, Run and published Check work browser-locally; Submit remains disabled.
- `src/lib/webFiles.js` separates previous inline `<style>` and `<script>` content in existing one-file starters and any saved one-file browser draft **without deleting the legacy draft**. Browser preview assembles only files explicitly linked by `index.html`; separate files are never sent to grading or student-data services. The existing opaque-origin iframe, publicly authored step checks, and special React JSX compiler/runtime are reused.
- `src/lib/publishedCourseLoader.js` now accepts optional per-lesson/per-project `starterFiles` maps of actual published paths in the Mobile App curriculum repository. Until those are authored and published, the preview continues to split the existing single-file starters. Course, project, lesson, and step IDs and order are unchanged.
- Existing published Markdown for Club Connect/Bracket Challenge still describes inline `<style>`/`<script>` and complete cumulative one-file examples. The React project reading pane explicitly remaps those directions to `styles.css`/`script.js`. Source prose must be rewritten in its **owning curriculum repo** during the next curriculum authoring phase, not silently rewritten in generated classroom assets.
- `mswhitby/mobile-app-dev` draft PR #3 (`docs/separate-mobile-source-files`) documents the next-authoring standard for physical source files and the optional manifest map. It is documentation-only and unmerged; existing starter files and production site remain unchanged.
- **Validation:** isolated preview publisher run `43273518799` successfully ran **73 tests, 0 failures**, the hosted Vite build and preview-only publisher. It checked out React code SHA `046f632d70444e3c72e22b595e68233a7ac887a1` (no production grading/login changes). Classroom workflow pin commit `921d0b994dfdf167e41663c59f4552af703575a7`; published React assets commit `8f42197a38be7509b2bdd892df1833b9ebbc5d10` touches only the preview tree. Pages deployment run `43273602383` must be checked for completed success; UI click-through on a school device was not performed.
- **Next:** verify Pages deployment, review the linked file tabs and Club Connect/Bracket checks in a browser, retain existing drafts, and update future lesson Markdown/starter sources in `mobile-app-dev` only after frontend review. No merging or production deployment without explicit approval.

### Final multi-file preview publication confirmation

- GitHub Pages site deployment **completed successfully** in `mswhitby/classroom` run `43273602383` for commit `8f42197a38be7509b2bdd892df1833b9ebbc5d10`. The publisher changed only the isolated preview index and its generated JS/CSS assets. The separate production `/playground/` application was not modified.
- Preview ready for user review: https://www.mswhitby.com/playground/preview/ . Review HTML lesson, CSS lesson, JavaScript lesson, React lesson, Club Connect step changes and Bracket Challenge; browser-specific smoke testing remains unverified beyond successful build and automated tests.


## 2026-11-13 — Test Prep hub work (unmerged feature branch)

Branch `feature/test-prep-hub-20261113` was based on the open React design PR branch `course-accents-editor-teacher-catalog`. It adds a new Test Prep card/hub containing the existing TSI Math link plus 20 **original, preview-only** ASVAB (4 subjects), digital SAT (2), and enhanced ACT (4, with Science optional) multiple-choice questions. It has in-browser answer checking and local practice history, no authentication and no official score predictions. Existing `tsi-math` course URL and lesson identifiers are unchanged. The intended new canonical curriculum repo is `mswhitby/test-prep`, **not created yet**; current sample items reside temporarily in the React design branch. No production app, classroom publisher or live student data changed. Before merging or publishing, run React tests/build and review source attribution and mobile UI; do not assume publication or CI passed.
