// Static snapshot of mswhitby/challenges. Student-facing content only.
// The public React lab does not fetch a private GitHub repository at runtime.
import catalog from '../challenge-bank/catalog.json';
const problems = import.meta.glob('../challenge-bank/problems/*/problem.md', {query:'?raw', import:'default', eager:true});
const starters = import.meta.glob('../challenge-bank/problems/*/starters/*', {query:'?raw', import:'default', eager:true});
const samples = import.meta.glob('../challenge-bank/problems/*/examples.json', {eager:true, import:'default'});
export const challengeCatalog = catalog.challenges;
export const challengeLanguages = catalog.languages;
export const languageLabels = { python:'Python', java:'Java', javascript:'JavaScript', csharp:'C#' };
export const starterFile = {python:'python.py',java:'Solution.java',javascript:'javascript.js',csharp:'Solution.cs'};
export function getChallenge(id) { return challengeCatalog.find(c => c.id === id) || null; }
export function getChallengeStatement(id) { return problems[`../challenge-bank/problems/${id}/problem.md`] ?? ''; }
export function getChallengeStarter(id,language) { return starters[`../challenge-bank/problems/${id}/starters/${starterFile[language]}`] ?? ''; }
export function getChallengeExamples(id) { return samples[`../challenge-bank/problems/${id}/examples.json`]?.cases ?? []; }
export const challengeTopics = [...new Set(challengeCatalog.flatMap(c=>c.tags))].sort((a,b)=>a.localeCompare(b));
export const difficultyOrder = ['Very Easy','Easy','Medium','Hard'];
export function filterChallenges({query='',topic='all',difficulty='all',course='all',language='all'}={}) {
 const q=query.trim().toLocaleLowerCase();
 return challengeCatalog.filter(c=>(!q||[c.title,c.summary,...c.tags].join(' ').toLowerCase().includes(q))
   && (topic==='all'||c.tags.includes(topic))
   && (difficulty==='all'||c.difficulty===difficulty)
   && (course==='all'||c.suggestedCourses.includes(course))
   && (language==='all'||c.languages.includes(language)))
   .slice().sort((a,b)=>a.title.localeCompare(b.title));
}
