import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { statusFor, gradeFor, gradeTotals, weeklyGrades, completionIds, dueLabel } from '../src/lib/gradebook.js';
import { assignedWork } from '../src/data/assignedWork.js';
import { sampleGrades } from '../src/data/sampleGrades.js';
import { splitLesson, guidedSteps } from '../src/lib/lessonSections.js';
import { gradesPath, resolveRoute } from '../src/lib/routes.js';

test('Grades is a shareable route',()=>{
  assert.deepEqual(resolveRoute(gradesPath()),{page:'grades'});
});
test('due dates apply only to assigned work and statuses update with completion',()=>{
  assert.equal(statusFor('lesson:python-decisions',{assignments:assignedWork,grades:sampleGrades,today:'2026-11-06'}).state,'overdue');
  assert.equal(statusFor('lesson:python-formatting',{assignments:assignedWork,grades:sampleGrades,today:'2026-11-06'}).state,'assigned');
  assert.equal(statusFor('lesson:python-strings',{assignments:assignedWork,grades:sampleGrades,today:'2026-11-06'}).state,'completed');
  assert.equal(statusFor('lesson:python-decisions',{assignments:assignedWork,grades:[],completedLessons:['python-decisions'],today:'2026-11-06'}).state,'completed');
  assert.equal(statusFor('lesson:python-loops',{assignments:assignedWork,grades:[],today:'2026-11-06'}).state,'unassigned');
  assert.equal(dueLabel('2026-11-06'),'Nov 6');
});
test('earned points are shown only for actual score records',()=>{
  assert.equal(gradeFor('lesson:python-loops',sampleGrades),null);
  assert.deepEqual(gradeTotals([{earned:8,possible:10},{earned:12,possible:15}]),{earned:20,possible:25,percent:80,count:2});
  assert.ok(weeklyGrades(sampleGrades).length>=2);
  assert.equal(completionIds(['python-loops'],sampleGrades).includes('python-strings'),true);
});
test('the published Markdown supports hint disclosure and full steps without showing every step at once',()=>{
  const lesson=readFileSync(new URL('../src/content/python-variables.md',import.meta.url),'utf8');
  const parts=splitLesson(lesson,{challenge:'Build a profile'});
  assert.match(parts.solve,/## Practice: Names for changing information/);
  assert.match(parts.solve,/<details>/);
  assert.match(parts.solve,/Hint 1/);
  const unity=readFileSync(new URL('../src/content/unity-player-controller.md',import.meta.url),'utf8');
  const guide=guidedSteps(unity);
  assert.ok(guide.steps.length>=6);
  assert.match(guide.intro,/Prerequisites/);
  assert.match(guide.steps[0],/Step 1/);
  assert.doesNotMatch(guide.steps[0],/Step 2/);
});
