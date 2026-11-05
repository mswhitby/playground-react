import { marked } from "marked";
import DOMPurify from "dompurify";

// Vite bundles every Markdown file in src/content/ as a raw string.
const markdownFiles = import.meta.glob("../content/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const FALLBACK = "# Add a Markdown lesson\n\nSave a new `.md` file inside `src/content/`.\n";

/** Markdown source for a lesson id, e.g. "python-strings" → src/content/python-strings.md */
export const localMarkdown = (id) => markdownFiles[`../content/${id}.md`] || FALLBACK;

/** Split a lesson into its Learn part and its "## Practice" part. */
export function splitLesson(doc) {
  const split = doc.split(/^## Practice\s*$/im);
  return {
    learn: split[0],
    practice: split[1] ? `## Practice\n${split.slice(1).join("## Practice")}` : doc,
  };
}

/** Markdown → sanitized HTML. */
export const renderMarkdown = (raw) => DOMPurify.sanitize(marked.parse(raw, { breaks: false, gfm: true }));
