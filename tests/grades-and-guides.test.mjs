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
  assert.equal(dueLabel('2026-11-06'),'Nov 6, 2026');
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

test('Learn paginates existing lesson section headings without changing source Markdown',()=>{
  const source=readFileSync(new URL('../src/content/python-variables.md',import.meta.url),'utf8');
  const {learn,solve}=splitLesson(source);
  const guide=guidedSteps(learn);
  assert.ok(guide.steps.length>=4, 'existing lesson sections should become learn pages');
  assert.match(guide.intro,/New skill/);
  assert.match(guide.steps[0],/Why this matters/);
  assert.doesNotMatch(guide.steps[0],/Study this example/);
  assert.match(guide.steps.at(-1),/Reflection/);
  assert.match(solve,/Hint 1/);
});

test('explicit numbered steps win over section headings and fenced headings are ignored',()=>{
  const source=[
    '# Lesson',
    '## Introduction',
    'Read this first.',
    '## Step 1: Start',
    '```markdown',
    '## Step 99: This is inside code',
    '```',
    '## Step 2: Finish',
    'Done.'
  ].join('\n');
  const guide=guidedSteps(source);
  assert.equal(guide.steps.length,2);
  assert.match(guide.intro,/Introduction/);
  assert.match(guide.steps[0],/Step 99/);
  assert.doesNotMatch(guide.steps[0],/Step 2/);
});

test('lesson reading accents and navigation are consistently course colored',()=>{
  const css=readFileSync(new URL('../src/styles/course.css',import.meta.url),'utf8');
  const tokens=readFileSync(new URL('../src/styles/tokens.css',import.meta.url),'utf8');
  const page=readFileSync(new URL('../src/pages/CoursePage.jsx',import.meta.url),'utf8');
  assert.ok(css.includes('font-size: 16px;'));
  assert.ok(css.includes('font-size:13.5px;'));
  assert.ok(css.includes('color: var(--inline-code);'));
  assert.ok(css.includes('.instructions-pane .tabs button.active'));
  assert.ok(css.includes('border-color: var(--course-color)'));
  assert.ok(tokens.includes('--inline-code:'));
  assert.ok(page.includes('lessonIndex > 0 && <button'));
  assert.ok(page.includes('className="lesson-nav-link previous"'));
  assert.ok(page.includes('className="lesson-nav-link next"'));
});

test('the actual Strings and Variables lesson paginates into three separate pages',()=>{
  const markdown = readFileSync(new URL('../src/content/python-strings.md',import.meta.url),'utf8');
  const sections = splitLesson(markdown);
  const guide = guidedSteps(sections.learn);
  assert.equal(guide.steps.length,3);
  assert.match(guide.intro,/Strings and Variables/);
  assert.match(guide.steps[0],/Step 1 · Store a value/);
  assert.doesNotMatch(guide.steps[0],/Step 2 · Combine information/);
  assert.match(guide.steps[1],/Step 2 · Combine information/);
  assert.match(guide.steps[1],/f-string/);
  assert.doesNotMatch(guide.steps[1],/Step 3 · Check your understanding/);
  assert.match(guide.steps[2],/Step 3 · Check your understanding/);
  assert.match(sections.solve,/Create a greeting/);
});

test('numbered step headings in fenced example code do not create pages',()=>{
  const sample = [
    '## Learn',
    'Introduction.',
    '### Step 1 · Start',
    '~~~markdown',
    '### Step 50 · This is code, not a lesson',
    '~~~',
    '### Step 2 · Finish',
    'Done.'
  ].join('\n');
  const guide=guidedSteps(sample);
  assert.equal(guide.steps.length,2);
  assert.match(guide.steps[0],/Step 50/);
  assert.doesNotMatch(guide.steps[0],/Step 2/);
});
