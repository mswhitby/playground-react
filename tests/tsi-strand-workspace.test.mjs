import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseTsiStrandLesson } from '../src/lib/tsiStrandPractice.js';

const read = path => readFileSync(new URL(path,import.meta.url),'utf8');

test('four-strand React preview separates questions from worked explanations', () => {
  const sample = `# Unit rates
## Learn — guided worked example
**Problem:** Divide 180 miles by 3 hours.

1. Divide: 180 ÷ 3 = 60.

## Practice — choose one answer
### 1. A car travels 180 miles in 3 hours. What is its speed?
- **A.** 40
- **B.** 60
- **C.** 90
- **D.** 540

### 2. Four tickets cost $30. What do 10 cost?
- **A.** $60
- **B.** $65
- **C.** $75
- **D.** $120

## Reflect
Explain your correction.`;
  const parsed = parseTsiStrandLesson(sample);
  assert.match(parsed.learn, /180 ÷ 3/);
  assert.deepEqual(parsed.questions.map(q=>q.number),[1,2]);
  assert.deepEqual(parsed.questions[0].options.map(q=>q.letter),['A','B','C','D']);
  assert.equal(parsed.questions[1].options[2].text,'$75');
  assert.match(parsed.reflect,/Explain your correction/);
  assert.equal(parseTsiStrandLesson('# Not published').questions.length,0);
  assert.match(read('../src/components/course/LessonWorkspace.jsx'),/task\.tsiStrandDraft/);
  const jsx=read('../src/components/course/TsiStrandWorkspace.jsx');
  assert.match(jsx,/tsi-strand-questions/);
  assert.match(jsx,/tsi-strand-explanations/);
  assert.match(jsx,/Answer explanations/);
  const css=read('../src/styles/learning.css');
  assert.match(css,/\.tsi-strand-workspace\s*\{/);
  assert.match(css,/@media\(max-width:850px\)/);
});
