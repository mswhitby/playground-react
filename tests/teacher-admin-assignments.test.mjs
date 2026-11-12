import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { adminPath, resolveRoute } from '../src/lib/routes.js';
import {
  matchingPreviewAssignment, previewAssignment, previewAssignmentId,
  upsertPreviewAssignment, validatePreviewAssignment
} from '../src/lib/previewAssignments.js';

const read = path => readFileSync(new URL(path,import.meta.url),'utf8');
const students=[
  {id:'sample-1',sections:['p1'],github:'sample-one'},
  {id:'sample-2',sections:['p1'],github:'sample-two'},
];
const draft={
  sectionId:'p1',sectionCourseId:'computer-science-1',
  lessonId:'02-values-and-variables/01-meet-variables',
  dueDate:'2026-11-20',points:10,scope:'section',studentIds:[]
};

test('teacher can draft a whole-class lesson assignment with due date and points',()=>{
  const record=previewAssignment(draft,students);
  assert.equal(record.id,previewAssignmentId('p1',draft.lessonId));
  assert.equal(record.courseId,'computer-science-1');
  assert.equal(record.points,10);
  assert.equal(record.dueDate,'2026-11-20');
  assert.equal(record.scope,'section');
  assert.deepEqual(record.studentIds,[]);
  const updated=upsertPreviewAssignment([record],{...record,points:15});
  assert.equal(updated.length,1);
  assert.equal(matchingPreviewAssignment(updated,'p1',draft.lessonId).points,15);
  assert.equal(matchingPreviewAssignment(updated,'p3',draft.lessonId),null);
});

test('teacher can select individual students only from the current section',()=>{
  const selected=previewAssignment({...draft,scope:'selected',studentIds:['sample-2','sample-1','sample-2']},students);
  assert.deepEqual(selected.studentIds,['sample-1','sample-2']);
  assert.match(validatePreviewAssignment({...draft,scope:'selected',studentIds:[]},students),/Select at least/);
  assert.match(validatePreviewAssignment({...draft,scope:'selected',studentIds:['another-section']},students),/Select at least/);
  assert.match(validatePreviewAssignment({...draft,sectionCourseId:'game-programming'},students),/different course/);
});

test('invalid dates and points cannot create assignments',()=>{
  assert.match(validatePreviewAssignment({...draft,dueDate:'2026-02-30'},students),/valid due date/);
  assert.match(validatePreviewAssignment({...draft,dueDate:'11/20/2026'},students),/valid due date/);
  assert.match(validatePreviewAssignment({...draft,points:-5},students),/Points/);
  assert.match(validatePreviewAssignment({...draft,points:3.14},students),/Points/);
  assert.match(validatePreviewAssignment({...draft,points:'x'},students),/Points/);
});

test('teacher dashboard is section-specific while account settings live on admin route',()=>{
  const tabs=read('../src/components/teacher/TeacherTabs.jsx');
  const dashboard=read('../src/pages/TeacherDashboard.jsx');
  const toolbar=read('../src/components/teacher/TeacherToolbar.jsx');
  const admin=read('../src/pages/AdminDashboard.jsx');
  const sidebar=read('../src/components/layout/Sidebar.jsx');
  const app=read('../src/App.jsx');
  assert.match(tabs,/\["curriculum", "Curriculum"/);
  assert.doesNotMatch(tabs,/\["accounts"|"setup",/);
  assert.doesNotMatch(dashboard,/<AccountsTab/);
  assert.match(dashboard,/<TeacherCurriculum section=\{currentSection\}/);
  assert.match(dashboard,/id="teacher-section-setup"/);
  assert.match(toolbar,/section-setup-toggle/);
  assert.match(toolbar,/onToggleSetup/);
  assert.match(admin,/<AccountsTab/);
  assert.match(sidebar,/\['admin', 'Admin dashboard'/);
  assert.match(app,/<AdminDashboard students=\{students\}/);
  assert.equal(resolveRoute(adminPath()).page,'admin');
});

test('public curriculum previews assignment controls but never loads answer keys',()=>{
  const curriculum=read('../src/components/teacher/TeacherCurriculum.jsx');
  const styles=read('../src/styles/teacher.css');
  assert.match(curriculum,/previewAssignment\(\{/);
  assert.match(curriculum,/setAssignments/);
  assert.match(curriculum,/Whole class/);
  assert.match(curriculum,/Selected students/);
  assert.match(curriculum,/type="date"/);
  assert.match(curriculum,/type="number"/);
  assert.match(curriculum,/Update preview assignment/);
  assert.match(curriculum,/Remove assignment/);
  assert.match(curriculum,/codeView === 'starter'/);
  assert.match(curriculum,/Teacher-only solutions/);
  assert.match(curriculum,/not included in the public React preview/);
  assert.doesNotMatch(curriculum,/fetch\([^)]*(solution|answer.key)/i);
  assert.match(styles,/\.curriculum-solution-locked/);
});
