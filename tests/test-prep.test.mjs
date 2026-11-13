import assert from 'node:assert/strict';
import test from 'node:test';
import { getCourse } from '../src/data/courses.js';
import { testPrepTracks, testPrepQuestionCount, findTestPrepTopic } from '../src/data/testPrepSamples.js';
import { playgroundPath, resolveRoute } from '../src/lib/routes.js';

test('Test Prep is a shareable course, and existing TSI routes stay valid', () => {
  const prep = getCourse('test-prep');
  const tsi = getCourse('tsi-math');
  assert.equal(resolveRoute(playgroundPath(prep)).courseId, 'test-prep');
  assert.equal(resolveRoute(playgroundPath(tsi)).courseId, 'tsi-math');
  assert.equal(resolveRoute(playgroundPath(prep, 'asvab-ar')).lessonId, 'asvab-ar');
  assert.equal(resolveRoute('/playgrounds/test-prep/lessons/bogus').page, 'not-found');
  // TSI stays registered for old links but is shown only through the Test Prep hub.
  assert.ok(prep.units.some(unit => unit.id === 'asvab'));
  assert.equal(tsi.id, 'tsi-math');
});

test('ASVAB, SAT, ACT each contain question samples with valid answer keys', () => {
  assert.deepEqual(testPrepTracks.map(track => track.id), ['asvab', 'sat', 'act']);
  assert.equal(testPrepQuestionCount, 20);
  const ids = new Set();
  for (const track of testPrepTracks) {
    assert.ok(track.reference.startsWith('https://'));
    assert.ok(track.topics.length > 0);
    for (const topic of track.topics) {
      assert.equal(findTestPrepTopic(topic.id).track.id, track.id);
      assert.equal(topic.questions.length, 2);
      for (const question of topic.questions) {
        assert.ok(!ids.has(question.id), question.id);
        ids.add(question.id);
        assert.equal(question.options.length, 4);
        assert.ok(Number.isInteger(question.correct) && question.correct >= 0 && question.correct < 4);
        assert.ok(question.prompt.length > 20 && question.explanation.length > 15);
      }
    }
  }
});
