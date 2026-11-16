import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');

test('CS1 integration only reads data through canonical production bridge',()=>{
  const adapter=read('../src/lib/cs1Integration.js');
  assert.match(adapter,/VITE_READONLY_INTEGRATION/);
  assert.match(adapter,/\/playground\/integration\/account-bridge\.js/);
  assert.doesNotMatch(adapter,/insert\(|update\(|upsert\(|delete\(|submit\(|signInWithOAuth/);
  const app=read('../src/App.jsx');
  assert.match(app,/cs1IntegrationMode\?courses\.filter\(c=>c\.id==='computer-science-1'\)/);
  assert.match(app,/cs1IntegrationMode\?\[\]:completedLessons/);
  assert.match(app,/readOnlyMode=\{cs1IntegrationMode\}/);
  assert.match(app,/onToggleLessonComplete=\{cs1IntegrationMode\?undefined/);
  assert.match(app,/!\['home','course','grades'\]\.includes\(page\)/);
  const header=read('../src/components/course/LessonHeader.jsx');
  assert.match(header,/readOnlyMode && !grade/);
  const sidebar=read('../src/components/layout/Sidebar.jsx');
  assert.match(sidebar,/MENU\.filter/);
  const gradeView=read('../src/pages/Grades.jsx');
  assert.match(gradeView,/weeklyPoints/);
  assert.match(gradeView,/Verified Computer Science I results/);
});

test('regular published React preview stays separate from integration mode',()=>{
  const pkg=JSON.parse(read('../package.json'));
  assert.ok(pkg.scripts.build);
  const topbar=read('../src/components/layout/Topbar.jsx');
  assert.match(topbar,/LOCAL DESIGN LAB/);
  assert.match(topbar,/CS1 READ-ONLY TEST/);
});
