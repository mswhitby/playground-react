import assert from 'node:assert/strict';
import test from 'node:test';
import { courses } from '../src/data/courses.js';
import { homePath, playgroundPath, resolveRoute, teacherPath } from '../src/lib/routes.js';

test('all six playgrounds have a distinct shareable slug and resolve to their course', () => {
  assert.equal(new Set(courses.map((course) => course.slug)).size, courses.length);
  for (const course of courses) {
    const path = playgroundPath(course);
    assert.deepEqual(resolveRoute(path), { page: 'course', courseId: course.id, lessonId: null });
    assert.match(path, /\/playgrounds\/[a-z0-9-]+$/);
  }
});

test('a specific lesson is also directly shareable', () => {
  for (const course of courses) {
    const lessonId = course.lessons[0];
    const path = playgroundPath(course, lessonId);
    assert.deepEqual(resolveRoute(path), { page: 'course', courseId: course.id, lessonId });
  }
});

test('home, teacher, trailing slashes, and invalid routes', () => {
  assert.equal(resolveRoute(homePath()).page, 'home');
  assert.equal(resolveRoute(teacherPath()).page, 'teacher');
  assert.equal(resolveRoute('/playgrounds/mobile-app-web/').courseId, 'mobile-app-dev');
  assert.equal(resolveRoute('/playgrounds/missing').page, 'not-found');
  assert.equal(resolveRoute('/playgrounds/uil/lessons/no-such-lesson').page, 'not-found');
  assert.equal(resolveRoute('/playgrounds/mobile-app-web/other/react-components').page, 'not-found');
});
