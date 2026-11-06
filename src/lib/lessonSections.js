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

/** Paginate both structured tutorials and existing lesson Markdown.
 *
 * Numbered Step headings (H2–H4, e.g. "### Step 1 · Store a value")
 * take priority over ordinary section headings. Preserve fenced code blocks
 * and all lesson content exactly as authored.
 */
export function guidedSteps(markdown) {
  const lines = String(markdown || '').split('\n');
  const headings = [];
  let fence = null;
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    const delimiter = /^(`{3,}|~{3,})/.exec(trimmed);
    if (delimiter) {
      const mark = delimiter[1];
      if (!fence) fence = { char: mark[0], length: mark.length };
      else if (fence.char === mark[0] && mark.length >= fence.length) fence = null;
      return;
    }
    if (fence) return;
    const heading = /^(#{2,4})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!heading) return;
    const title = heading[2];
    const numbered = /^Step\s+\d+(?=\s*(?:[:.·–—-]|$))/i.test(title);
    headings.push({ index, level: heading[1].length, numbered });
  });
  const numbered = headings.filter(heading => heading.numbered);
  // Fall back to ordinary H2 sections for lessons that do not number steps.
  const markers = (numbered.length ? numbered : headings.filter(heading => heading.level === 2))
    .map(heading => heading.index);
  if (!markers.length) return { intro: lines.join('\n'), steps: [] };
  return {
    intro: lines.slice(0, markers[0]).join('\n').trim(),
    steps: markers.map((start, i) =>
      lines.slice(start, markers[i + 1] ?? lines.length).join('\n').trim()
    ),
  };
}
