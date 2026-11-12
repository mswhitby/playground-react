import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { courses } from '../src/data/courses.js';
import { courseProgress, isLessonComplete, toggleLessonComplete } from '../src/lib/completion.js';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('course progress only counts explicitly completed course lessons', () => {
  const course = courses[0];
  assert.deepEqual(courseProgress(course, []), { completed: 0, total: course.lessons.length, percent: 0 });
  const one = course.lessons[0];
  assert.equal(isLessonComplete(one, [one]), true);
  assert.equal(isLessonComplete(one, []), false);
  assert.equal(courseProgress(course, [one, one, 'unknown']).completed, 1);
  assert.equal(courseProgress(course, [one]).percent, Math.round(100 / course.lessons.length));
  assert.equal(courseProgress(course, course.lessons).percent, 100);
  assert.equal(courseProgress({ lessons: [] }, []).percent, 0);
});

test('students can mark a lesson complete or undo completion without changing other lessons', () => {
  const initial = ['python-strings'];
  const completed = toggleLessonComplete(initial, 'python-loops');
  assert.deepEqual(completed, ['python-strings', 'python-loops']);
  assert.deepEqual(initial, ['python-strings']);
  assert.deepEqual(toggleLessonComplete(completed, 'python-strings'), ['python-loops']);
});

test('updated course order is preserved in home and sidebar', () => {
  assert.deepEqual(courses.map(course => course.id), [
    'computer-science-1', 'game-programming', 'mobile-app-dev', 'capstone', 'uil', 'tsi-math'
  ]);
  const card = read('../src/components/home/CourseCard.jsx');
  const side = read('../src/components/layout/Sidebar.jsx');
  const page = read('../src/pages/CoursePage.jsx');
  assert.match(card, /<a className="course-card"/);
  assert.match(card, /course-progress-track/);
  assert.match(side, /assignment-dot/);
  assert.match(side, /activity.dueDate \? activity.state : ''/);
  assert.doesNotMatch(side, /outline-due|lesson-completion-dot/);
  const statusCss = read('../src/styles/learning.css');
  const uiCss = read('../src/styles/ui.css');
  const tokensCss = read('../src/styles/tokens.css');
  for (const state of ['completed', 'assigned', 'overdue']) {
    assert.ok(statusCss.includes('.assignment-dot.' + state));
    assert.ok(uiCss.includes('.assignment-status.' + state));
    assert.ok(tokensCss.includes('--status-' + state));
  }
  assert.doesNotMatch(page, /Copy link|copyCourseLink/);
  assert.match(page, /Prev: \{lessonTitleOf\(course, sequence\[lessonIndex - 1\]\)\}/);
  assert.match(page, /Next: \{lessonTitleOf\(course, sequence\[lessonIndex \+ 1\]\)\}/);
});

test('TSI shows a question beside Learn without a Practice tab', () => {
  const workspace = read('../src/components/course/LessonWorkspace.jsx');
  const instructions = read('../src/components/course/InstructionsPane.jsx');
  const question = read('../src/components/course/TsiPractice.jsx');
  assert.match(workspace, /<TsiPractice lessonId=/);
  assert.match(workspace, /<InstructionsPane lessonId=\{lessonId\} task=\{task\} isTsi/);
  assert.match(instructions, /isTsi \? <strong className="tsi-learn-title">Learn<\/strong>/);
  assert.match(instructions, /tsi-worked-solution/);
  assert.doesNotMatch(question, /coding tools|console|TSIA2 sample practice/i);
});

test('static colors and the Submit button use shared CSS; code consoles have output tabs', () => {
  for (const path of [
    '../src/components/home/CourseCard.jsx',
    '../src/components/layout/Sidebar.jsx',
    '../src/pages/CoursePage.jsx',
    '../src/pages/CourseLanding.jsx',
    '../src/components/layout/ThemeControls.jsx',
  ]) assert.doesNotMatch(read(path), /style=\{\{/);
  const consolePane = read('../src/components/course/ConsolePane.jsx');
  assert.match(consolePane, /\['Preview', 'Console', 'Checks'\]/);
  assert.match(consolePane, /role="tablist"/);
  assert.match(read('../src/pages/ChallengeDetail.jsx'), /<CodePane/);
  assert.match(read('../src/components/course/ConsolePane.jsx'), /console-tabs/);
  assert.match(read('../src/styles/ui.css'), /\.btn\.submit/);
});
