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

/** Pagination for both explicitly numbered steps and existing section-based lessons.
 *
 * Numbered `## ... Step 1: ...` headings take priority. If the author used
 * descriptive section headings instead, each H2 becomes a learnable step.
 * Fenced code examples remain intact, even if they contain heading-like text.
 */
export function guidedSteps(markdown) {
  const lines=String(markdown||'').split('\n');
  const headings=[];
  let fence=null;
  lines.forEach((line,index)=>{
    const trimmed=line.trim();
    const delimiter=/^(`{3,}|~{3,})/.exec(trimmed);
    if(delimiter) {
      const char=delimiter[1][0];
      if(!fence) fence={char,length:delimiter[1].length};
      else if(fence.char===char && delimiter[1].length>=fence.length) fence=null;
      return;
    }
    if(!fence && /^##\s+\S/.test(line)) {
      headings.push({index,numbered:/\bStep\s+\d+\s*:/i.test(line)});
    }
  });
  const explicit=headings.filter(heading=>heading.numbered);
  const markers=explicit.length?explicit.map(heading=>heading.index):headings.map(heading=>heading.index);
  if(!markers.length) return {intro:lines.join('\n'),steps:[]};
  return {
    intro:lines.slice(0,markers[0]).join('\n').trim(),
    steps:markers.map((start,i)=>lines.slice(start,markers[i+1]??lines.length).join('\n').trim()),
  };
}
