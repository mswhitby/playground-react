import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { courses } from '../src/data/courses.js';
import { applyCourseColorPreferences, contrastTextForColor, isHexColor, selectedCourseColor } from '../src/lib/courseColors.js';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');

test('students can choose any six-digit course color without changing other courses', () => {
  assert.ok(isHexColor('#F1A273'));
  assert.ok(isHexColor('#001122'));
  assert.equal(isHexColor('tomato'), false);
  assert.equal(isHexColor('var(--pass)'), false);
  assert.equal(isHexColor('#12345Z'), false);
  assert.equal(selectedCourseColor(courses[0], { [courses[0].id]: '#abcdef' }), '#ABCDEF');
  assert.equal(selectedCourseColor(courses[1], { [courses[0].id]: '#abcdef' }), courses[1].color);
});

test('course colors apply as CSS variables and reset individually', () => {
  const saved = new Map();
  const root = { style: {
    setProperty: (name, value) => saved.set(name, value),
    removeProperty: name => saved.delete(name)
  }};
  applyCourseColorPreferences({ [courses[0].id]:'#55AA22', [courses[1].id]:'#000000' }, courses, root);
  assert.equal(saved.get('--student-course-color-computer-science-1'), '#55AA22');
  assert.equal(saved.get('--student-course-color-game-programming'), '#000000');
  assert.equal(saved.get('--student-course-ink-game-programming'), '#FFFFFF');
  assert.equal(saved.get('--student-course-ink-computer-science-1'), contrastTextForColor('#55AA22'));
  applyCourseColorPreferences({ [courses[1].id]:'#000000' }, courses, root);
  assert.equal(saved.has('--student-course-color-computer-science-1'), false);
  assert.equal(saved.has('--student-course-ink-computer-science-1'), false);
  assert.equal(saved.get('--student-course-color-game-programming'), '#000000');
});

test('the overview settings use the same color controls as the course cards, without inline JSX styles', () => {
  const landing = read('../src/pages/CourseLanding.jsx');
  const app = read('../src/App.jsx');
  const css = read('../src/styles/course-colors.css');
  assert.match(landing, /Settings2/);
  assert.match(landing, /type="color"/);
  assert.match(landing, /Reset to default/);
  assert.match(app, /designlab:course-colors/);
  assert.match(css, /var\(--student-course-color-computer-science-1/);
  assert.doesNotMatch(landing, /style=\{\{/);
});

test('arbitrary light and dark picks get readable button labels', () => {
  assert.equal(contrastTextForColor('#000000'), '#FFFFFF');
  assert.equal(contrastTextForColor('#FFFFFF'), '#101012');
  assert.equal(contrastTextForColor('#FFFF00'), '#101012');
  assert.equal(contrastTextForColor('#001133'), '#FFFFFF');
});
