import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { courses } from '../src/data/courses.js';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');

test('all registered courses retain unique vivid category colors', () => {
  assert.equal(courses.length, 7);
  assert.equal(new Set(courses.map(course => course.color)).size, courses.length);
  for (const course of courses) assert.match(course.color, /^#[0-9a-fA-F]{6}$/);
});

test('both themes have distinct neutral page and card surfaces', () => {
  const tokens = read('../src/styles/tokens.css');
  assert.match(tokens, /--bg: #101012/);
  assert.match(tokens, /--surface: #242429/);
  assert.match(tokens, /--bg: #f0f1f5/);
  assert.match(tokens, /--surface: #ffffff/);
});

test('cards have individual spacing, padding, and category signals', () => {
  const css = read('../src/styles/home.css');
  const card = read('../src/components/home/CourseCard.jsx');
  assert.match(css, /gap: 20px/);
  assert.match(css, /padding: 24px/);
  assert.match(css, /box-shadow: var\(--card-shadow\)/);
  assert.match(css, /background:var\(--course-color\)/);
  assert.match(card, /course-progress-track/);
  assert.match(card, /data-course=\{course.id\}/);
  assert.match(card, /href=\{playgroundPath\(course\)\}/);
  assert.doesNotMatch(card, /style=\{\{/);
  assert.match(read('../src/styles/course-colors.css'), /--course-color/);
});

test('course identity and status colors remain separate', () => {
  const tokens = read('../src/styles/tokens.css');
  const css = read('../src/styles/course.css');
  assert.match(css, /--course-color/);
  assert.match(tokens, /--pass:/);
  assert.match(tokens, /--warn:/);
});
