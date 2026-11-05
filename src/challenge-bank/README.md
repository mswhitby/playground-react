# Ms. Whitby's Shared Challenge Bank

**One problem, multiple languages.** This private repository is the source of truth for reusable programming challenges across Ms. Whitby's Playground courses.

Each challenge has one `problem.md` statement, `config.json` metadata, public sample cases in `examples.json`, and starter code in Python, Java, JavaScript, and C#. Each language uses its normal function-naming convention but preserves the same input/output contract.

## Use in Playground

- The React design lab carries a **public-facing snapshot** in `src/challenge-bank/` for browsing and layout previews. It is not a live connection to this repository.
- For the production site, package the public-facing challenge files during the existing Playground build. Do **not** call GitHub's private API from a student's browser, and do **not** add secrets to client-side code.
- To checkout this private repository in a workflow running in a different repository, configure a fine-grained read-only token or GitHub App installation token with access to `mswhitby/challenges`. `GITHUB_TOKEN` scoped to the other repository cannot read it automatically.
- Problem statements, samples, and starters become public when packaged into a public site. The bank intentionally has **no solutions or hidden grading cases**. Keep unpublished tests/solutions in a separately restricted grader or private secrets, and never ship them to the browser.

## Content format

- `catalog.json` is the index. `id` is stable and **not tied to a course or language**.
- `problems/<id>/problem.md` is student-facing Markdown.
- `problems/<id>/config.json` declares difficulty, points, skills required, suggested course filters, and language function signatures.
- `problems/<id>/examples.json` stores visible sample arguments and expected JSON values.
- `problems/<id>/starters/` contains language-specific function templates, no implementation.
- `suggestedCourses` is only a filter, **not** a content copy or an automatic assertion that prerequisites have been taught. Only recommend a problem to a learner after all `prerequisites` have been covered.

## Difficulty points

Very Easy 5 · Easy 10 · Medium 15–20 · Hard 25.

## Safety and grades

The React design lab is a mock interface: its Run / Check / Submit controls do **not** execute or grade code. Actual grading must happen in a trusted service with language-specific compilation/execution, isolation, resource limits, verified test outcomes, and cross-language parity checks. Do not award real points from a browser simulation.

To validate the content catalog locally: `node scripts/validate.mjs`.
