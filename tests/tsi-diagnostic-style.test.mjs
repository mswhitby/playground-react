import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');

test('TSI diagnostic shares the authored strand-practice question and choice styling', () => {
  const diagnostic = read('../src/components/course/TsiDiagnostic.jsx');
  const practice = read('../src/components/course/TsiStrandWorkspace.jsx');
  const css = read('../src/styles/learning.css');
  for (const selector of ['tsi-strand-panel-heading','tsi-strand-question',
      'tsi-strand-question-number','tsi-strand-options','tsi-strand-option','tsi-strand-letter']) {
    assert.ok(diagnostic.includes(selector), 'Diagnostic must reuse ' + selector);
    assert.ok(practice.includes(selector), 'Practice must use ' + selector);
  }
  assert.match(diagnostic,/tsi-diagnostic-strand surface-card/);
  assert.match(diagnostic,/diagnosticOptions\(question\)\.map/);
  assert.match(diagnostic,/responses\[question\.id\]===String\(option\)/);
  assert.match(diagnostic,/value="skip"/);
  assert.match(diagnostic,/Not sure/);
  assert.match(diagnostic,/diagnosticPlacement\(items,responses\)/);
  assert.match(diagnostic,/onSubmit=\{submit\}/);
  assert.match(css,/\.tsi-diagnostic \.tsi-diagnostic-strand/);
  assert.match(css,/\.tsi-diagnostic \.tsi-strand-option:focus-within/);
});
