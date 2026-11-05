// This is the *student-facing* static metadata snapshot from private mswhitby/challenges.
// Never fetch private GitHub APIs from the browser. Grading remains outside this preview.
import catalog from '../challenge-bank/catalog.json';
import { challengeDefinitions } from './challengeDefinitions.js';
export const challengeCatalog=catalog.challenges;
export const challengeLanguages=catalog.languages;
export const languageLabels={python:'Python',java:'Java',javascript:'JavaScript',csharp:'C#'};
export const difficultyOrder=['Very Easy','Easy','Medium','Hard'];
export const challengeTopics=[...new Set(challengeCatalog.flatMap(x=>x.tags))].sort((a,b)=>a.localeCompare(b));
export function getChallenge(id){return challengeCatalog.find(x=>x.id===id)||null;}
export function getChallengeExamples(id){return challengeDefinitions[id]?.examples||[];}
const snake=id=>id.replaceAll('-','_');
const pascal=id=>id.split('-').map(x=>x.charAt(0).toUpperCase()+x.slice(1)).join('');
const camel=id=>{const s=pascal(id);return s.charAt(0).toLowerCase()+s.slice(1);};
export function getChallengeStarter(id,lang){
 const def=challengeDefinitions[id];if(!def)return '';
 const [pyArgs,pyType,javaArgs,javaType,csArgs,csType,jsArgs]=def.signature;
 switch(lang){
  case 'python':return 'def '+snake(id)+'('+pyArgs+') -> '+pyType+':\\n    # TODO: Implement this function.\\n    raise NotImplementedError("Your solution goes here")\\n';
  case 'java':return 'public class Solution {\\n    public static '+javaType+' '+camel(id)+'('+javaArgs+') {\\n        // TODO: Implement this function.\\n        throw new UnsupportedOperationException("Your solution goes here");\\n    }\\n}\\n';
  case 'javascript':return 'export function '+camel(id)+'('+jsArgs+') {\\n  // TODO: Implement this function.\\n  throw new Error("Your solution goes here");\\n}\\n';
  case 'csharp':return 'using System;\\n\\npublic static class Solution {\\n    public static '+csType+' '+pascal(id)+'('+csArgs+') {\\n        // TODO: Implement this function.\\n        throw new NotImplementedException("Your solution goes here");\\n    }\\n}\\n';
  default:return '';
 }
}
export function getChallengeStatement(id){
 const c=getChallenge(id),d=challengeDefinitions[id];if(!c||!d)return '';
 const examples=d.examples.map((x,i)=>'**Example '+(i+1)+'**\\n\\n\\x60\\x60\\x60json\\n'+JSON.stringify({arguments:x.input,expected:x.expected},null,2)+'\\n\\x60\\x60\\x60').join('\\n\\n');
 return '# '+c.title+'\\n\\n'+c.summary+'\\n\\n## Problem\\n\\n'+d.problem+'\\n\\n## Input and output\\n\\nImplement the supplied function and **return** the result. Do not print the answer.\\n\\n## Examples\\n\\n'+examples+'\\n\\n## Prerequisites\\n\\n'+c.prerequisites.join(', ')+'.\\n';
}
export function filterChallenges({query='',topic='all',difficulty='all',course='all',language='all'}={}){
 const q=query.trim().toLowerCase();
 return challengeCatalog.filter(c=>(!q||[c.title,c.summary,...c.tags].join(' ').toLowerCase().includes(q))&&(topic==='all'||c.tags.includes(topic))&&(difficulty==='all'||c.difficulty===difficulty)&&(course==='all'||c.suggestedCourses.includes(course))&&(language==='all'||c.languages.includes(language))).slice().sort((a,b)=>a.title.localeCompare(b.title));
}
