import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {applyCs1PublishedMetadata} from '../src/lib/cs1Integration.js';

const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');

test('CS1 integration only reads data through canonical production bridge',()=>{
  const adapter=read('../src/lib/cs1Integration.js');
  assert.match(adapter,/VITE_READONLY_INTEGRATION/);
  assert.match(adapter,/\/playground\/integration\/.*account-bridge\.js/);
  assert.doesNotMatch(adapter,/insert\(|update\(|upsert\(|delete\(|submit\(|signInWithOAuth/);
  const app=read('../src/App.jsx');
  assert.match(app,/cs1IntegrationMode\?courses\.filter\(c=>c\.id==='computer-science-1'\)/);
  assert.match(app,/loadCs1PublishedCatalog/);
  assert.match(app,/applyCs1PublishedMetadata/);
  assert.match(app,/cs1IntegrationMode\?\[\]:completedLessons/);
  assert.match(app,/readOnlyMode=\{cs1IntegrationMode\}/);
  assert.match(app,/onToggleLessonComplete=\{cs1IntegrationMode\?undefined/);
  assert.match(app,/!\['home','course','grades','teacher','admin'\]\.includes\(page\)/);
  assert.match(app,/cs1IntegrationMode \? <TeacherReadOnly \/>/);
  assert.match(app,/cs1IntegrationMode \? <AdminReadOnly \/>/);
  const admin=read('../src/pages/AdminReadOnly.jsx');
  assert.match(admin,/useTeacherIdentity/);
  assert.match(admin,/readOnlyMode/);
  assert.doesNotMatch(admin,/seedStudents|setStudents|patchStudent|Reset sample accounts/);
  const header=read('../src/components/course/LessonHeader.jsx');
  assert.match(header,/readOnlyMode && !grade/);
  const sidebar=read('../src/components/layout/Sidebar.jsx');
  assert.match(sidebar,/MENU\.filter/);
  const landing=read('../src/pages/CourseLanding.jsx');
  assert.match(landing,/with verified grades/);
  const gradeView=read('../src/pages/Grades.jsx');
  assert.match(gradeView,/weeklyPoints/);
  assert.match(gradeView,/Assignment and due-date data will be connected/);
  assert.match(gradeView,/Verified Computer Science I results/);
});

test('regular published React preview stays separate from integration mode',()=>{
  const pkg=JSON.parse(read('../package.json'));
  assert.ok(pkg.scripts.build);
  const topbar=read('../src/components/layout/Topbar.jsx');
  assert.match(topbar,/LOCAL DESIGN LAB/);
  assert.match(topbar,/CS1 READ-ONLY TEST/);
});


test('published CS1 metadata overrides stale bundled titles without replacing lesson bodies',()=>{
  const course={
    units:[{id:'u1',title:'Old Unit',lessons:['01-how-programs-work/01-first-message']}],
    lessonRecords:{
      '01-how-programs-work/01-first-message':{
        id:'01-how-programs-work/01-first-message',
        title:'Instructions and output',
        markdownSource:'# Lesson body',
        starter:'print("hi")'
      }
    }
  };
  const catalog={lessons:[{
    id:'01-how-programs-work/01-first-message',
    title:'Instructions and Output',
    unitName:'How Programs Work',
    points:5
  }]};
  const merged=applyCs1PublishedMetadata(course,catalog);
  const lesson=merged.lessonRecords['01-how-programs-work/01-first-message'];
  assert.equal(lesson.title,'Instructions and Output');
  assert.equal(lesson.markdownSource,'# Lesson body');
  assert.equal(merged.units[0].title,'How Programs Work');
});
