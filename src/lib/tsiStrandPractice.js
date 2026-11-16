/**
 * Parse the four publicly authored TSI strand draft lessons.
 * This mirrors only the student's Markdown; authoring remains in mswhitby/TSI.
 */
export function parseTsiStrandLesson(markdown) {
  const text = String(markdown || '');
  const learnStart = text.indexOf('## Learn');
  const practiceStart = text.indexOf('## Practice');
  const reflectStart = text.indexOf('## Reflect');
  if (learnStart < 0 || practiceStart < learnStart) return { learn:'', reflect:'', questions:[] };
  const learn = text.slice(learnStart, practiceStart).trim();
  const practice = text.slice(practiceStart, reflectStart > practiceStart ? reflectStart : undefined);
  const reflect = reflectStart > practiceStart ? text.slice(reflectStart).trim() : '';
  const questions = [...practice.matchAll(/###\s+(\d+)\.\s+([^\n]+)\n([\s\S]*?)(?=\n###\s+\d+\.|$)/g)]
    .map(match => ({
      number:Number(match[1]),
      prompt:match[2].trim(),
      options:[...match[3].matchAll(/-\s+\*\*([A-D])\.\*\*\s+([^\n]+)/g)]
        .map(option=>({letter:option[1],text:option[2].trim()})),
    }));
  return {learn,reflect,questions};
}
