// Only public examples and hints are included in this independent course preview.
export function publishedSolveSupplement(task, solve = '') {
  if (!task?.isPublished) return '';
  let extra = '';
  const cases = Array.isArray(task.cases) ? task.cases : [];
  if (cases.length && !/##\s+(?:Published )?Examples\b/i.test(solve)) {
    extra += '\n\n### Published examples\n';
    cases.forEach((item, i) => {
      extra += '\n**Example ' + (i + 1) + '**\n\n';
      if (item.call) extra += 'Input: `' + item.call + '`\n\n';
      extra += task.mode === 'function' ? 'Expected return:\n' : 'Expected output:\n';
      extra += '\n```text\n' + String(item.expected ?? '') + '\n```\n';
    });
  }
  const hints = Array.isArray(task.hints) ? task.hints : [];
  if (hints.length && !/<details(?:\s|>)/i.test(solve)) {
    extra += '\n\n### Need a hint?\n';
    hints.forEach((hint,i)=>{
      extra += '\n<details>\n<summary>Hint '+(i+1)+'</summary>\n\n'+String(hint).replaceAll('<','&lt;')+'\n\n</details>\n';
    });
  }
  return extra;
}

export function resolvePublishedLinks(markdown, sourcePath) {
  if (!sourcePath) return markdown;
  const root = 'https://github.com/mswhitby/computer-science-1/blob/main/units/';
  const full = new URL(sourcePath,root);
  return String(markdown).replace(/\]\(([^)]+)\)/g,(match,target)=>{
    // Keep external links, fragments, mail links and non-path schemes unchanged.
    if (/^(?:https?:|mailto:|#|data:)/i.test(target)) return match;
    const [file, ...rest] = target.split(' ');
    try {
      const dest = new URL(file,full);
      if (dest.origin !== full.origin) return match;
      return ']('+dest.href+(rest.length?' '+rest.join(' '):'')+')';
    } catch {return match;}
  });
}
