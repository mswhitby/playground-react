import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync } from 'node:fs';
import { courses } from '../src/data/courses.js';
import { lessons } from '../src/data/lessons.js';
import { tsiQuestions } from '../src/data/tsiQuestions.js';
import { journalsPath, resolveRoute } from '../src/lib/routes.js';
import { journalDraftId, journalWeeks, weekStart, validateJournal } from '../src/lib/journals.js';

test('every course has unit groups and every listed lesson has metadata and Markdown source', () => {
  for (const course of courses) {
    assert.ok(course.units.length >= 2, `${course.id} needs units`);
    assert.deepEqual(course.lessons, course.units.flatMap(unit => unit.lessons));
    assert.equal(new Set(course.lessons).size, course.lessons.length);
    for (const id of course.lessons) {
      if (course.publishedContent) {
        const record = course.lessonRecords[id];
        assert.ok(record, `missing public lesson ${id}`);
        assert.ok(record.markdownSource?.length > 100, `missing published Markdown ${id}`);
        assert.equal(typeof record.starter, 'string');
      } else {
        assert.ok(lessons[id], `missing sample lesson ${id}`);
        assert.ok(existsSync(new URL(`../src/content/${id}.md`, import.meta.url)), `missing Markdown ${id}`);
      }
    }
  }
});
test('TSIA2 lessons have math questions rather than code tasks', () => {
  const tsi = courses.find(course => course.id === 'tsi-math');
  for (const id of tsi.lessons) {
    const q = tsiQuestions[id];
    assert.ok(q && q.options.length === 4 && Number.isInteger(q.correct));
    assert.ok(q.correct >= 0 && q.correct < q.options.length);
  }
});
test('journal link and Central Time week dates behave as designed', () => {
  assert.deepEqual(resolveRoute(journalsPath()), { page:'journals' });
  assert.equal(weekStart(new Date('2026-11-05T17:00:00Z')), '2026-11-02');
  assert.equal(journalWeeks(new Date('2026-11-05T17:00:00Z'))[0], '2026-11-02');
  assert.notEqual(journalDraftId('p1','sample-1','2026-11-02'),journalDraftId('p1','sample-2','2026-11-02'));
});
test('journal validation requires reasoning and AI-use disclosure', () => {
  const valid = { response:'I tested three cases and explained why each one worked.',type:'essay',aiUse:'none',aiDetails:''};
  assert.equal(validateJournal(valid),'');
  assert.ok(validateJournal({...valid,response:'no'}));
  assert.ok(validateJournal({...valid,aiUse:'disclosed'}));
  assert.equal(validateJournal({...valid,aiUse:'disclosed',aiDetails:'I used a suggestion to outline the structure.'}),'');
});
