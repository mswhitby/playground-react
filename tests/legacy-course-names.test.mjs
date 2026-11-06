import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import {
  normalizeImportedOutline, lessonIdOf, lessonIdsOf, unitTitleOf,
  unitNumberOf, courseLessonIds, getCourseLesson, lessonTitleOf, lessonInCourse
} from '../src/lib/courseContent.js';
import { playgroundPath, resolveRoute } from '../src/lib/routes.js';
import { courseProgress } from '../src/lib/completion.js';
import { statusFor } from '../src/lib/gradebook.js';

const read = path => readFileSync(new URL(path, import.meta.url),'utf8');

// The identifiers and titles below are copied from the existing published
// Computer Science I curriculum; never infer IDs from a displayed name.
const publishedCS1 = [
  {id:'01-how-programs-work/01-first-message',unit:1,unitName:'How Programs Work',lesson:1,title:'Instructions and output',points:5},
  {id:'01-how-programs-work/04-robotics-status',unit:1,unitName:'How Programs Work',lesson:4,title:'Cumulative mini-project',points:5},
  {id:'02-values-and-variables/01-meet-variables',unit:2,unitName:'Values, Variables & Expressions',lesson:1,title:'Names for changing information',points:5},
  {id:'02-values-and-variables/03-types-and-conversion',unit:2,unitName:'Values, Variables & Expressions',lesson:3,title:"Numbers aren't always text",points:10},
];

test('published Computer Science I metadata retains original unit titles, order and nested IDs',()=>{
  const outline=normalizeImportedOutline(publishedCS1);
  assert.equal(outline.units.length,2);
  assert.deepEqual(outline.units.map(unitTitleOf),['How Programs Work','Values, Variables & Expressions']);
  assert.equal(unitNumberOf(outline.units[1]),2);
  assert.equal(outline.units[1].lessons[0],'02-values-and-variables/01-meet-variables');
  const course={id:'computer-science-1',slug:'computer-science-1',...outline};
  const id='02-values-and-variables/03-types-and-conversion';
  assert.equal(lessonTitleOf(course,id),"Numbers aren't always text");
  assert.equal(getCourseLesson(course,id).points,10);
  assert.equal(getCourseLesson(course,id).ready,false);
  assert.deepEqual(courseLessonIds(course),publishedCS1.map(item=>item.id));
  assert.equal(lessonInCourse(course,id),true);
  assert.equal(courseProgress(course,[id]).completed,1);
  const path=playgroundPath(course,id);
  assert.match(path, /02-values-and-variables%2F03-types-and-conversion/);
  assert.deepEqual(resolveRoute(path,[course]),{page:'course',courseId:course.id,lessonId:id});
  assert.equal(statusFor('lesson:'+id,{assignments:[{id:'lesson:'+id,dueDate:'2026-11-04'}],today:'2026-11-06'}).state,'overdue');
});

test('nested Unity units use their original published titles',()=>{
  const legacy={units:[
    {id:'3d-essentials',number:2,title:'3D Essentials',summary:'Build a world',lessons:[
      {id:'essentials-02',title:'Objects, components, and C# calculations'},
      {id:'essentials-03',title:'Build reusable prefabs & calculate scoring'}
    ]},
    {id:'programming-essentials',number:4,title:'Programming Essentials',lessons:[
      {id:'essentials-04',title:'Scripts, methods, and a tiny game loop'}
    ]}
  ]};
  const result=normalizeImportedOutline(legacy);
  const course={id:'game-programming',slug:'game-programming',...result};
  assert.equal(unitNumberOf(result.units[1]),4);
  assert.equal(unitTitleOf(result.units[0]),'3D Essentials');
  assert.equal(lessonTitleOf(course,'essentials-03'),'Build reusable prefabs & calculate scoring');
  assert.equal(lessonTitleOf(course,'essentials-04'),'Scripts, methods, and a tiny game loop');
  assert.equal(lessonIdsOf(result.units[0]).length,2);
});

test('flat mobile and UIL lessons keep display names independent of their IDs',()=>{
  const mobile=normalizeImportedOutline({lessons:[
    {id:'html',competency:'HTML',title:'Give a team page its structure'},
    {id:'css',competency:'CSS',title:'Make a readable event card'},
    {id:'javascript',competency:'JavaScript',title:'Count the people joining in'}
  ]});
  assert.deepEqual(mobile.units.map(unitTitleOf),['HTML','CSS','JavaScript']);
  assert.equal(lessonTitleOf(mobile,'html'),'Give a team page its structure');
  const uil=normalizeImportedOutline({lessons:[
    {id:'welcome-output',title:'Print the team banner'},
    {id:'file-greetings',title:'Read names from a file'}
  ]});
  assert.equal(uil.units.length,1);
  assert.equal(lessonTitleOf(uil,'file-greetings'),'Read names from a file');
  assert.equal(lessonIdOf({id:'lesson-with-hyphen'}),'lesson-with-hyphen');
  assert.equal(lessonIdOf(null),'');
});

test('long and punctuated names are supported across sidebar, course overview, navigation and grades',()=>{
  const files=[
    read('../src/components/layout/Sidebar.jsx'),
    read('../src/pages/CourseLanding.jsx'),
    read('../src/pages/CoursePage.jsx'),
    read('../src/pages/Grades.jsx'),
    read('../src/components/course/LessonHeader.jsx'),
  ];
  assert.match(files[0],/lessonTitleOf\(course,id\)/);
  assert.match(files[0],/unitTitleOf\(unit\)/);
  assert.match(files[1],/lessonTitleOf\(course,id\)/);
  assert.match(files[2],/lessonTitleOf\(course,sequence\[lessonIndex \+ 1\]\)/);
  assert.match(files[3],/lessonTitleOf\(getCourse\(courseId\),name\)/);
  assert.match(files[4],/unitTitleOf\(unit\)/);
  const css=read('../src/styles/learning.css');
  assert.match(css,/\.outline-unit-title/);
  assert.match(css,/\.outline-lesson-name/);
  assert.match(css,/overflow-wrap: anywhere/);
  assert.doesNotMatch(files.join('\n'),/lessons\[id\]\.title/);
});
