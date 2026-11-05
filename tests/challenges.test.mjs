import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolveRoute,challengePath,challengesPath} from '../src/lib/routes.js';
import {challengeIds} from '../src/data/challengeIds.js';
const catalog=JSON.parse(readFileSync(new URL('../src/challenge-bank/catalog.json',import.meta.url),'utf8'));
const definitions=readFileSync(new URL('../src/data/challengeDefinitions.js',import.meta.url),'utf8');
test('shared bank has ten language-neutral challenges and consistent metadata',()=>{
 assert.equal(catalog.challenges.length,10);
 assert.deepEqual(new Set(challengeIds),new Set(catalog.challenges.map(c=>c.id)));
 for(const c of catalog.challenges){assert.equal(c.languages.length,4);assert(c.prerequisites.length);assert(c.suggestedCourses.length);assert(definitions.includes('"'+c.id+'"'));}
});
test('challenge bank routes, course filter and deep links',()=>{
 assert.equal(resolveRoute(challengesPath()).page,'challenges');
 assert.deepEqual(resolveRoute(challengesPath('uil')),{page:'challenges',filterCourse:'uil'});
 assert.deepEqual(resolveRoute(challengePath('second-largest-distinct')),{page:'challenge',challengeId:'second-largest-distinct'});
 assert.equal(resolveRoute(challengePath('not-real')).page,'not-found');
 assert.equal(resolveRoute(challengesPath('bogus')).page,'not-found');
});
