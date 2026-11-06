import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { courses } from '../src/data/courses.js';
import { courseProgress, toggleLessonComplete } from '../src/lib/completion.js';
import { statusFor } from '../src/lib/gradebook.js';
const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');

test('marking a CS1 lesson completed changes overview, sidebar and progress from a single source',()=>{
  const cs1=courses.find(course=>course.id==='computer-science-1');
  const lesson=cs1.lessons[0];
  const before=courseProgress(cs1,[]);
  const completed=toggleLessonComplete([],lesson);
  const after=courseProgress(cs1,completed);
  assert.equal(after.completed,before.completed+1);
  assert.equal(statusFor('lesson:'+lesson,{completedLessons:completed}).state,'completed');
  assert.equal(statusFor('lesson:'+lesson,{completedLessons:completed}).dueDate,null);
  assert.equal(courseProgress(cs1,toggleLessonComplete(completed,lesson)).completed,0);
  const sidebar=read('../src/components/layout/Sidebar.jsx');
  const cards=read('../src/pages/CourseLanding.jsx');
  const app=read('../src/App.jsx');
  assert.match(sidebar,/activity\.completed \? 'completed'/);
  assert.match(cards,/a\.dueDate \|\| a\.completed/);
  assert.match(cards,/assignment-status/);
  assert.match(app,/completedWithGrades = completionIds\(completedLessons,grades\)/);
  assert.match(app,/toggleLessonComplete\(previous, id\)/);
  assert.match(cards,/marked complete in preview/);
});

test('there are no global coral or purple accent selectors',()=>{
  const controls=read('../src/components/layout/ThemeControls.jsx');
  const topbar=read('../src/components/layout/Topbar.jsx');
  const app=read('../src/App.jsx');
  const tokens=read('../src/styles/tokens.css');
  const colors=read('../src/styles/course-colors.css');
  assert.doesNotMatch(controls,/ACCENTS|accent-swatch|setAccent/);
  assert.doesNotMatch(topbar,/setAccent/);
  assert.doesNotMatch(app,/dataset\.accent|setAccent/);
  assert.doesNotMatch(tokens,/data-accent=/);
  assert.match(colors,/\[data-course\] \{ --accent: var\(--course-color\)/);
});

test('Learn step navigation is plain course-colored text',()=>{
  const pane=read('../src/components/course/InstructionsPane.jsx');
  const css=read('../src/styles/course.css');
  assert.match(pane,/className="step-link"/);
  assert.doesNotMatch(pane,/className="btn primary" disabled=\{page/);
  assert.match(css,/\.lesson-step-controls \.step-link/);
  assert.match(css,/background:transparent;color:var\(--course-color\)/);
});

test('the editor uses bundled CodeMirror with syntax, auto pairs, indentation and matching brackets',()=>{
  const pkg=JSON.parse(read('../package.json'));
  assert.ok(pkg.dependencies.codemirror);
  const component=read('../src/components/course/CodeEditor.jsx');
  const pane=read('../src/components/course/CodePane.jsx');
  assert.match(component,/CodeMirror\.fromTextArea/);
  assert.match(component,/autoCloseBrackets: true/);
  assert.match(component,/matchBrackets: true/);
  assert.match(component,/smartIndent: true/);
  assert.match(component,/lineNumbers: true/);
  assert.match(component,/Ctrl-Space/);
  assert.match(pane,/<CodeEditor value=\{code\}/);
});

test('teacher Curriculum tab pulls public lesson catalog but not student records',()=>{
  const tab=read('../src/components/teacher/TeacherTabs.jsx');
  const teacher=read('../src/pages/TeacherDashboard.jsx');
  const curriculum=read('../src/components/teacher/TeacherCurriculum.jsx');
  assert.match(tab,/\["curriculum", "Curriculum"/);
  assert.match(teacher,/<TeacherCurriculum\/>/);
  assert.match(curriculum,/\/playground\/data\/computer-science-1\/course\.json/);
  assert.match(curriculum,/normalizeImportedOutline\(result\)/);
  assert.match(curriculum,/cache:'no-store'/);
  assert.match(curriculum,/Student records and grades are not connected/);
  assert.doesNotMatch(curriculum,/supabase|rpc\(/i);
});

test('lesson number tiles retain their course color for completed, assigned and overdue work',()=>{
  const css=read('../src/styles/learning.css');
  const course=read('../src/styles/course-colors.css');
  const landing=read('../src/pages/CourseLanding.jsx');
  assert.match(css,/\.unit-lesson-index \{[^\n]*--course-color/);
  assert.doesNotMatch(css,/\.unit-lesson-link:has\(\.assignment-status\.(?:completed|assigned|overdue)\) \.unit-lesson-index/);
  assert.match(landing,/assignment-status \$\{a\.state\}/);
  assert.match(landing,/assignment-dot \$\{a\.state\}/);
  assert.match(course,/--student-course-color-computer-science-1/);
});

test('Learn step and lesson navigation has chevrons and hides unavailable actions',()=>{
  const steps=read('../src/components/course/InstructionsPane.jsx');
  const page=read('../src/pages/CoursePage.jsx');
  const stepCss=read('../src/styles/course.css');
  const lessonCss=read('../src/styles/learning.css');
  assert.match(steps,/ChevronLeft, ChevronRight/);
  assert.match(steps,/page > 0 && <button/);
  assert.match(steps,/page < guide.steps.length - 1 && <button/);
  assert.doesNotMatch(steps,/disabled=\{page===/);
  assert.match(steps,/Previous/);
  assert.match(steps,/Next <ChevronRight/);
  assert.match(page,/lessonIndex > 0 && <button/);
  assert.match(page,/lessonIndex >= 0 && lessonIndex < sequence.length - 1 && <button/);
  assert.doesNotMatch(page,/disabled=\{lessonIndex <= 0\}/);
  assert.match(page,/Prev: \{lessonTitleOf\(course, sequence\[lessonIndex - 1\]\)\}/);
  assert.match(page,/Next: \{lessonTitleOf\(course, sequence\[lessonIndex \+ 1\]\)\}/);
  assert.match(page,/ChevronLeft size=\{16\}/);
  assert.match(page,/ChevronRight size=\{16\}/);
  assert.match(stepCss,/\.step-link\.previous/);
  assert.match(stepCss,/\.step-link\.next/);
  assert.match(lessonCss,/\.lesson-nav-link\.previous/);
  assert.match(lessonCss,/\.lesson-nav-link\.next/);
});
