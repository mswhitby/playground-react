# Ms. Whitby's Playground — React Design Lab

A **standalone React frontend preview** modeled after Ms. Whitby's Playground. **Computer Science I includes the complete published 10-unit, 40-lesson curriculum** with authentic unit names, lesson Markdown, hints, public examples, and starter code. The other five courses and all student/teacher records remain fictional samples. CS1 Run and Check execute browser-based Python and use **public examples only**; Submit never records a grade or sends student work. There is no Supabase, student sign-in, production API, or private test data.

## Start it locally

Requires Node.js (recommended: Node 20+). From this extracted folder:

```bash
npm install
npm run dev
```

Vite will open a browser at `http://127.0.0.1:5173`. Edit the files in VS Code; the preview updates automatically. `npm run build` creates a static preview bundle in `dist/`.

If npm is blocked on a school device, **install dependencies on a machine/network where npm access is allowed**. This zip deliberately excludes `node_modules` and never accesses your classroom backend.

## Direct links for every playground

Each course has a unique **clean URL** rather than being selected only from saved browser state. The URL is the source of truth; refresh and browser Back/Forward retain the current page. Click **Copy playground link** on a course to copy its course URL.

| Playground | Local URL (while `npm run dev` is running) |
|---|---|
| Computer Science I | `http://127.0.0.1:5173/playgrounds/computer-science-1` |
| Game Programming & Design | `http://127.0.0.1:5173/playgrounds/game-programming` |
| Mobile App & Web | `http://127.0.0.1:5173/playgrounds/mobile-app-web` |
| UIL Computer Science | `http://127.0.0.1:5173/playgrounds/uil` |
| TSI Math Advisory | `http://127.0.0.1:5173/playgrounds/tsi-math` |
| Capstone | `http://127.0.0.1:5173/playgrounds/capstone` |

You can also link to a specific lesson: `/playgrounds/mobile-app-web/lessons/react-components`. Selecting a lesson updates the URL, so the Back button works.

The route definitions live in `src/lib/routes.js`; each course's public `slug` is in `src/data/courses.js` and can differ from its internal `id`. Keep published slugs stable, or old shared links will stop working. The home-page course actions are real links, so you can right-click to **Copy Link Address** or open in another tab.

**Hosted review:** [React preview](https://www.mswhitby.com/playground/preview/react/) uses hash-based links, keeping lesson URLs shareable without changing the live Playground. **Deployment:** `localhost` links only work on your own computer. To give students usable links, deploy the React build at a public domain. Clean URLs require your host to serve `index.html` for non-file paths. Vite's dev server does this automatically, and `public/_redirects` supplies that rule for Netlify/Cloudflare Pages. GitHub Pages and other static hosts need their own SPA fallback handling. If deploying to a subfolder, configure Vite's `base` first; routes honor that prefix.

Run `npm test` to check the slug and deep-link mapping.

## What to edit

```
src/
├── main.jsx                 React entry point (loads App + styles/index.css)
├── App.jsx                  App shell: page routing, theme/accent, sidebar state, saved students
├── pages/                   One file per screen
│   ├── Home.jsx
│   ├── CoursePage.jsx
│   └── TeacherDashboard.jsx
├── components/
│   ├── layout/              Topbar, ThemeControls, Sidebar, Footer
│   ├── ui/                  Shared pieces: Chip, SectionTitle, Empty, Splitter
│   ├── home/                CourseCard, TeacherShortcut
│   ├── course/              CourseNavigation, LessonWorkspace, LessonHeader,
│   │                        InstructionsPane, CodePane, ConsolePane, mockActions.js
│   └── teacher/             TeacherToolbar, TeacherTabs, ClassOverview, SectionBanner,
│                            StatGrid, WeeklyPointsPanel, RosterPanel, StudentAssignments,
│                            AccountsTab, AccountCard, SectionSetup, SortSelect
├── hooks/useSaved.js        useState that persists to localStorage
├── lib/                     Plain helpers: cn (class names), students (name/sort),
│                            markdown (load/split/render), storage (safe localStorage)
├── data/                    Fictional mock data: courses, lessons, sections, students, weeks
├── content/*.md             Markdown lessons (auto-discovered by Vite)
└── styles/                  index.css imports, in order: tokens → base → layout → ui →
                             home → course → teacher (each file holds its own media queries)
```

| To change… | Edit |
|---|---|
| Colors, fonts, light/dark themes, accents | `src/styles/tokens.css` |
| Top bar, sidebar, footer | `src/components/layout/` + `src/styles/layout.css` |
| Home course cards | `src/components/home/` + `src/styles/home.css` |
| Lesson workspace, editor, console | `src/components/course/` + `src/styles/course.css` |
| Teacher dashboard tabs and tables | `src/components/teacher/` + `src/styles/teacher.css` |
| Sample students, courses, lessons | `src/data/` (fictional only — never real student info) |
| Lesson text | `src/content/<lesson-id>.md` |

### Built-in demo interactions

- **Home / course navigation:** All six course categories represented, with mock lessons and challenges.
- **Learn / Practice:** Displays lesson content from editable Markdown files (with fenced code samples, headings, lists and blockquotes (not a production-identical renderer; math typesetting extensions are not included)). To permanently change text, edit `src/content/<lesson-id>.md` in VS Code. The `FileText` button also opens an editable Markdown source *in the browser*, but browser-only edits save to localStorage, **not** back to the `.md` file.
- **Resizable workspace:** Drag the vertical gutter between Markdown and editor; drag the horizontal gutter between code editor and console. Layout sizes persist locally. On narrow screens the page stacks vertically.
- **Editor and console:** CS1 Run executes Python in a browser worker, and Check compares against the published examples. These do **not** record grades or student submissions. Other courses still use mock actions. Save stores drafts in your browser only.
- **Teacher Dashboard → Class overview:** Mock weekly scorecard, sorting by first/last/GitHub, and click a name to expand assignment history **in its roster row**.
- **Teacher Dashboard → Accounts:** Search, period filter, sorting, and editable sample Sheet/student names. Sheet names take precedence; if blank, the demo falls back to the student name, then GitHub.
- **Appearance:** Dark/light and coral/purple accent switches; left sidebar collapses. Preferences and mock edits persist across reloads through localStorage.

## Important differences from the production Playground

This remains a **frontend preview**, not the production app. It includes the authentic public CS1 curriculum and browser-only public Python checks, but does not connect to production auth, hidden grading, student accounts, the Supabase dashboard backend, or real point calculations. No actual school data is in the zip; weekly values are fictional and predetermined.

The current production site is maintained in `mswhitby/playground` and deployed through `mswhitby/classroom/playground/`. This sandbox runs independently at localhost. Changing it does **not** change the production site. When you settle on a layout, we can port the relevant React components and CSS patterns back without risking the live system.

The design tokens and visual direction were taken from the current Playground source: dark charcoal surfaces, compact navigation, course-specific accents, desktop/phone responsive layouts, and a horizontal editor-over-console arrangement. The sandbox uses **system fonts** rather than bundling licensed font files.

## Reset local demo state

Use the **Reset sample records** button in Teacher Dashboard to restore fictional students. To clear *all* saved interface state (including Markdown source previews, editor drafts, theme, sizes), clear storage for `http://127.0.0.1:5173` in your browser's site settings.

**Build verification note:** The refactored components were bundled and rendered in a headless browser and compared screen-by-screen against the original single-file version (desktop, tablet and phone widths, both themes, all tabs) with identical results. A full `vite build` was not run in the preparation environment because npm registry access was unavailable; run `npm install` followed by `npm run dev` on your local computer.

## Vibrant category-card themes (November 2026)

The home page now uses **individually elevated, generously spaced neutral cards** rather than a grouped list. Both light and dark modes use a quieter page background and more distinct card surfaces. Course icons, thin bars, and active course navigation convey category identity with vivid indigo, magenta, cyan, orange, green, and pink. The course accent also carries into the lesson header and selected lesson. Grading success and warning colors remain universal and separate from course category colors.

- Change surface contrast and accent shades in `src/styles/tokens.css` (light and dark modes).
- Change course category identity in `src/data/courses.js`; CSS consumes each `course.color` using `--course-color`.
- Change card spacing, icon tiles and accent bars in `src/styles/home.css`.
- Change course workspace separation in `src/styles/course.css`, teacher surfaces in `src/styles/teacher.css`.
- Existing coral/purple theme controls and saved settings remain; the default accent for *new* sessions is purple.
- This remains a frontend-only preview. No production data or backend was changed.


## Unit outlines, TSIA2 practice, and weekly journals (November 2026)

- Every course now opens on a **course landing page**, with clickable unit cards and lesson previews. Current outlines are **fictional samples** for layout testing, not a copy of the full production curriculum. Unit metadata is in `src/data/courseUnits.js`; each lesson points to editable `src/content/<lesson-id>.md`.
- The current course's **unit/lesson outline** appears inside the shared left sidebar between Explore and Playgrounds. On narrow screens, use the lesson selector above the workspace.
- **TSI Math** lessons show sample multiple-choice math questions, explanations and feedback instead of a coding editor. Questions are original design examples in `src/data/tsiQuestions.js`.
- **Weekly Journals** at `/journals` lets you change sample class/student/week, choose an essay or logic puzzle, draft text, disclose AI use, and create *local simulated* hand-ins. Open Teacher Dashboard → Journals to review them with per-section submitted/missing counts. Drafts and demo receipts persist in this browser using `localStorage` only. There is **no connection to real students, submission services, or grading**.
- The GitHub repository remains a design-only sandbox. Changes here do not modify the separate production `mswhitby/playground` or `mswhitby/classroom` repos.

## Shared Challenge Bank design preview (November 2026)

The global **Challenge Bank** is available under Explore. Ten original reusable problems have stable language-independent IDs, search, course/topic/difficulty/language filters, and alphabetical sorting. Course landing pages link to filtered views of the **same** bank, not duplicated challenge content. The challenge workspace has Markdown instructions, visible examples, adjustable editor and console panes, and language-specific starter functions for **Python, Java, JavaScript and C#**. Separate local drafts are kept per problem and language.

**Source:** Private `mswhitby/challenges`, with a student-facing metadata snapshot in `src/challenge-bank/catalog.json` and authored statement/example and starter-template preview data in `src/data/challengeDefinitions.js`. The design lab is not a live private-repository sync. To publish from the private challenge repository, copy only student-facing files during the build using a read-only GitHub App or fine-grained token stored in GitHub Actions secrets. Never send a secret to a browser, and never publish hidden tests or solutions.

**Simulation notice:** Run and Check display published examples but do **not** execute a student's code. Save and Demo submit store copies in that browser only and do **not** produce verified grades or teacher submissions. Course matching does not establish prerequisite readiness; the teacher should verify prerequisites before recommending challenges.
