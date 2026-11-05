import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {resolveRoute,challengePath,challengesPath} from '../src/lib/routes.js';
import {challengeIds} from '../src/data/challengeIds.js';
const catalog=JSON.parse(readFileSync(new URL('../src/challenge-bank/catalog.json',import.meta.url),'utf8'));
test('the React design lab has ten language-independent challenges',()=>{
 assert.equal(catalog.challenges.length,10);
 assert.deepEqual(new Set(challengeIds),new Set(catalog.challenges.map(c=>c.id)));
 for(const c of catalog.challenges){
  assert.equal(c.languages.length,4);assert(c.prerequisites.length);assert(c.suggestedCourses.length);
  assert(['Very Easy','Easy','Medium','Hard'].includes(c.difficulty));
  const dir='../src/challenge-bank/'+c.path+'/';
  const config=JSON.parse(readFileSync(new URL(dir+'config.json',import.meta.url)));
  const samples=JSON.parse(readFileSync(new URL(dir+'examples.json',import.meta.url)));
  assert.equal(config.id,c.id);assert.equal(samples.challengeId,c.id);assert(samples.cases.length>=3);
  assert(existsSync(new URL(dir+'problem.md',import.meta.url)));
  for(const file of ['python.py','Solution.java','javascript.js','Solution.cs'])assert(existsSync(new URL(dir+'starters/'+file,import.meta.url)));
 }
});
test('challenge deep links, course views, and invalid IDs',()=>{
 assert.equal(resolveRoute(challengesPath()).page,'challenges');
 assert.deepEqual(resolveRoute(challengesPath('uil')),{page:'challenges',filterCourse:'uil'});
 assert.deepEqual(resolveRoute(challengePath('second-largest-distinct')),{page:'challenge',challengeId:'second-largest-distinct'});
 assert.equal(resolveRoute(challengePath('not-a-problem')).page,'not-found');
 assert.equal(resolveRoute(challengesPath('bogus')).page,'not-found');
});
