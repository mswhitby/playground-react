// Design-only journal helpers. No backend, real students, or teacher messaging.
const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit' });
export function weekStart(at = new Date()) {
  const p = Object.fromEntries(parts.formatToParts(at).filter(part => part.type !== 'literal').map(part => [part.type, part.value]));
  const d = new Date(Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day)));
  d.setUTCDate(d.getUTCDate() - (d.getUTCDay() + 6) % 7);
  return d.toISOString().slice(0, 10);
}
export function journalWeeks(at = new Date(), count = 8) {
  const first = new Date(weekStart(at) + 'T12:00:00Z');
  return Array.from({ length: count }, (_, n) => {
    const d = new Date(first); d.setUTCDate(d.getUTCDate() - n * 7); return d.toISOString().slice(0, 10);
  });
}
export const journalWeekLabel = (week) => new Date(week + 'T12:00:00Z').toLocaleDateString('en-US', {
  month: 'short', day: 'numeric', year: 'numeric', timeZone: 'America/Chicago'
});
export const journalDraftId = (sectionId, studentId, week) => `${sectionId}|${studentId}|${week}`;
export function validateJournal({response, type, aiUse, aiDetails}) {
  if (!['essay', 'logic-puzzle'].includes(type)) return 'Select an essay or logic puzzle.';
  if (String(response).trim().length < 10) return 'Write your answer and explain your thinking.';
  if (!['none', 'disclosed'].includes(aiUse)) return 'Complete the AI-use declaration.';
  if (aiUse === 'disclosed' && String(aiDetails).trim().length < 5) return 'Describe which parts involved AI.';
  return '';
}
