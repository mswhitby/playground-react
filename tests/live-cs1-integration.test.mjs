import assert from 'node:assert/strict';
import test from 'node:test';
import { courses } from '../src/data/courses.js';
import { getCourseLesson } from '../src/lib/courseContent.js';
import { splitLesson, guidedSteps } from '../src/lib/lessonSections.js';
import { publishedSolveSupplement, resolvePublishedLinks } from '../src/lib/publishedLessons.js';
import { buildPublicChecks, formatPublicCheckResults } from '../src/lib/publicPythonChecks.js';
import { readFileSync } from 'node:fs';

const cs1 = courses.find(c=>c.id==='computer-science-1');
const examples = courses.filter(c=>c.id!=='computer-science-1' && c.id!=='test-prep');

test('complete published CS1 content replaces only Computer Science I mocks',()=>{
  assert.equal(cs1.publishedContent,true);
  assert.equal(cs1.units.length,10);
  assert.equal(cs1.lessons.length,40);
  assert.equal(new Set(cs1.lessons).size,40);
  assert.equal(cs1.units[0].title,'How Programs Work');
  assert.equal(cs1.units[1].title,'Values, Variables & Expressions');
  assert.equal(cs1.lessons[0],'01-how-programs-work/01-first-message');
  assert.equal(cs1.lessons.at(-1),'10-algorithms-and-testing/04-build-an-event-report');
  for(const course of examples) {
    assert.equal(course.publishedContent,undefined);
    assert.equal(course.lessonRecords,undefined);
  }
});

test('all 40 lessons have original Markdown, public cases and runnable starters',()=>{
  for(const id of cs1.lessons){
    const task=getCourseLesson(cs1,id);
    assert.ok(task?.ready && task.isPublished,id);
    assert.equal(task.language,'python',id);
    assert.ok(task.markdownSource?.includes('# '),id);
    assert.ok(Array.isArray(task.cases)&&task.cases.length>0,id);
    assert.equal(typeof task.starter,'string',id);
    assert.ok(task.markdown.startsWith(id.split('/')[0]+'/'),id);
    const contents=splitLesson(task.markdownSource,task);
    assert.ok(contents.learn.length>50,id);
    assert.ok(contents.solve.length>25,id);
  }
});

test('published examples and hints are readable while no hidden answers are included',()=>{
  const task=getCourseLesson(cs1,cs1.lessons[0]);
  const {solve,learn}=splitLesson(task.markdownSource,task);
  const summary=publishedSolveSupplement(task,solve);
  assert.match(summary,/Published examples/);
  assert.match(summary,/Expected output/);
  assert.match(summary,/Hint 1/);
  assert.doesNotMatch(summary,/"expected":/);
  const linked=resolvePublishedLinks(solve,task.markdown);
  assert.match(linked,/https:\/\/github.com\/mswhitby\/computer-science-1\/blob\/main\/units\//);
  assert.ok(guidedSteps(learn).steps.length>0);
});

test('published public checker can distinguish printed scripts and return values',()=>{
  const printTask=getCourseLesson(cs1,cs1.lessons[0]);
  const functionTask=getCourseLesson(cs1,'07-strings-and-text/01-index-and-length');
  const printHarness=buildPublicChecks(printTask,printTask.starter);
  const functionHarness=buildPublicChecks(functionTask,functionTask.starter);
  assert.match(printHarness,/__out.getvalue/);
  assert.match(functionHarness,/__ast.literal_eval/);
  assert.match(functionHarness,/edge_letters/);
  const output='PUBLIC_CHECK_RESULTS='+JSON.stringify([
    {ok:true},{ok:false,error:'Expected 3 but got 2'}
  ]);
  assert.match(formatPublicCheckResults(output,2),/1 of 2 published examples matched/);
  assert.match(formatPublicCheckResults(output,2),/No grade or points were recorded/);
});

test('migrated preview has no fictional graded scores or assigned due dates',()=>{
  const app=readFileSync(new URL('../src/App.jsx',import.meta.url),'utf8');
  const grades=readFileSync(new URL('../src/pages/Grades.jsx',import.meta.url),'utf8');
  assert.match(app, /const grades = \[\];/);
  assert.match(app, /const courseAssignments = \[\];/);
  assert.doesNotMatch(app, /sampleGrades|assignedWork/);
  assert.match(app,/assignments=\{courseAssignments\}/);
  assert.match(grades,/assignments=\[\]/);
  assert.doesNotMatch(grades,/sample scores|assignedWork/);
});
