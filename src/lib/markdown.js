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

/** Return a short task first and the full explanation in Learn. */
export function splitLesson(doc, task = null) {
  const source=String(doc||'');
  const lines=source.split('\n');
  const start=lines.findIndex(l=>/^##\s+(?:Practice|Solve)(?:\s*[:—-].*)?\s*$/i.test(l));
  const stop=start===-1?-1:lines.findIndex((l,i)=>i>start&&/^##\s+(?:Reflection|Learn)(?:\s*[:—-].*)?\s*$/i.test(l));
  const solve=start>=0 ? lines.slice(start,stop<0?lines.length:stop).join('\n')
    : `# Solve\n\n${task?.challenge||'Try the lesson task before looking at the guide.'}`;
  const learn=start>=0 ? [...lines.slice(0,start),...(stop<0?[]:lines.slice(stop))].join('\n').trim():source;
  return { solve, learn };
}

/** Split a step-by-step guide into individual pages without losing Markdown formatting. */
export function guidedSteps(markdown) {
  const source=String(markdown||'');
  const lines=source.split('\n');
  const markers=[];
  lines.forEach((line,index)=>{if(/^##\s+.*\bStep\s+\d+\s*:/i.test(line))markers.push(index);});
  if(!markers.length)return {intro:source,steps:[]};
  return {
    intro:lines.slice(0,markers[0]).join('\n'),
    steps:markers.map((start,i)=>lines.slice(start,markers[i+1]??lines.length).join('\n'))
  };
}

/** Markdown → sanitized HTML. */
export const renderMarkdown = (raw) => DOMPurify.sanitize(marked.parse(raw, { breaks: false, gfm: true }));
