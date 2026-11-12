import test from 'node:test';
import assert from 'node:assert/strict';
import { loadPublishedCourse, publicResourceUrl } from '../src/lib/publishedCourseLoader.js';
import { getCourseLesson } from '../src/lib/courseContent.js';
import { courses } from '../src/data/courses.js';
import { projectPath, resolveRoute } from '../src/lib/routes.js';

function fixtureFetch(files) {
  return async url => {
    const path = url.replace('/playground/data/','');
    if (!(path in files)) return {ok:false,status:404};
    return {ok:true,json:async()=>files[path],text:async()=>files[path]};
  };
}

test('published course loader only accepts student-safe same-origin paths', () => {
  assert.equal(publicResourceUrl('game-programming','lessons/editor.md'),'/playground/data/game-programming/lessons/editor.md');
  assert.throws(()=>publicResourceUrl('game-programming','../teachers/answers.json'));
  assert.throws(()=>publicResourceUrl('game-programming','/teachers/answers.json'));
  assert.throws(()=>publicResourceUrl('capstone','course.json'));
});

test('Game Programming retains published unit/lesson/exercise IDs and Markdown', async()=>{
  const row={id:'essentials-01',title:'Find your way around a scene',markdown:'lessons/essentials-01.md',
    exercise:{id:'essentials-01-practice',starter:'using System;',prompt:'Return a name.',examples:[{call:'GetArenaName()',expected:'"Practice Arena"'}]},
    unityTask:['Test the scene']};
  const files={
    'game-programming/course.json':{units:[{id:'editor-essentials',number:1,title:'Editor Essentials',lessons:[row]}]},
    'game-programming/lessons/essentials-01.md':'# Explore Unity',
  };
  const course=await loadPublishedCourse('game-programming',{fetchImpl:fixtureFetch(files)});
  assert.deepEqual(course.lessons,['essentials-01']);
  assert.equal(course.units[0].id,'editor-essentials');
  const lesson=getCourseLesson(course,'essentials-01');
  assert.equal(lesson.exerciseId,'essentials-01-practice');
  assert.match(lesson.markdownSource,/Explore Unity/);
  assert.match(lesson.markdownSource,/Test the scene/);
  assert.equal(lesson.starter,'using System;');
  assert.equal(lesson.isPublished,true);
});

test('Mobile App & Web keeps lessons distinct from guided projects and does not fetch example solutions',async()=>{
  const files={
    'mobile-app-dev/course.json':{
      lessons:[{id:'html',title:'Structure',competency:'HTML',markdown:'lessons/html/lesson.md',starterFile:'lessons/html/starter.html',language:'html'}],
      projects:[{id:'club-connect',title:'Club Connect',summary:'Build a club page',
        starterFile:'projects/club-connect/starter.html',exampleFile:'projects/club-connect/example.html',
        steps:[{id:'structure',title:'Build page',markdown:'projects/club-connect/01-structure.md'},
               {id:'style',title:'Style page',markdown:'projects/club-connect/02-style.md'}]}]
    },
    'mobile-app-dev/lessons/html/lesson.md':'# HTML lesson',
    'mobile-app-dev/lessons/html/starter.html':'<h1>Start</h1>',
    'mobile-app-dev/projects/club-connect/starter.html':'<html></html>',
    'mobile-app-dev/projects/club-connect/01-structure.md':'# Structure step',
    'mobile-app-dev/projects/club-connect/02-style.md':'# Style step',
  };
  const requested=[];
  const base=fixtureFetch(files);
  const fetchImpl=async url=>{requested.push(url);return base(url);};
  const content=await loadPublishedCourse('mobile-app-dev',{fetchImpl});
  assert.deepEqual(content.lessons,['html']);
  assert.deepEqual(content.projects[0].steps.map(x=>x.id),['structure','style']);
  assert.equal(getCourseLesson(content,'html').starter,'<h1>Start</h1>');
  assert.ok(requested.every(url=>!url.includes('example.html')));
  const availableCourses=courses.map(course => course.id==='mobile-app-dev'?{...course,...content}:course);
  const url=projectPath(availableCourses.find(course=>course.id==='mobile-app-dev'),'club-connect','style');
  assert.deepEqual(resolveRoute(url,availableCourses),{
    page:'course',courseId:'mobile-app-dev',lessonId:null,projectId:'club-connect',stepId:'style'
  });
});

test('UIL written questions remain student-facing without publishing answer indices or explanations',async()=>{
  const files={
    'uil/course.json':{written:{markdown:'lessons/written-prep.md',practice:'practice/written-01.json'},
      lessons:[{id:'welcome-output',title:'Print the banner',markdown:'lessons/welcome-output.md',starterFile:'programming/TeamBanner.java',cases:[]}]},
    'uil/lessons/written-prep.md':'# Written practice',
    'uil/practice/written-01.json':{questions:[{id:'written-01',prompt:'2 + 2?',choices:['3','4'],answer:1,explanation:'Confidential demo key'}]},
    'uil/lessons/welcome-output.md':'# Java print',
    'uil/programming/TeamBanner.java':'class TeamBanner {}',
  };
  const course=await loadPublishedCourse('uil',{fetchImpl:fixtureFetch(files)});
  assert.deepEqual(course.lessons,['written','welcome-output']);
  assert.match(getCourseLesson(course,'written').markdownSource,/2 \+ 2/);
  assert.doesNotMatch(getCourseLesson(course,'written').markdownSource,/Confidential demo key/);
  assert.equal(getCourseLesson(course,'welcome-output').language,'java');
});

test('TSI migrates current 20-day plan with explicit unpublished sessions and four-strand draft reading',async()=>{
  const files={
    'tsi-math/content/20-day-program.json':{days:[{day:1,id:'tsi-20d-d01',title:'Diagnostic',strand:'diagnostic'},
      {day:2,id:'tsi-20d-d02',title:'Rational numbers',strand:'quantitative'}]},
    'tsi-math/content/strand-lessons-v1.json':{lessons:[{id:'tsi-geometry-right-triangles-and-area-v1',
      title:'Right triangles and area',student_lesson:'lessons/strands/geometry/right-triangles-and-area.md',minutes:30}]},
    'tsi-math/lessons/strands/geometry/right-triangles-and-area.md':'# Right triangles and area',
    'tsi-math/content/diagnostic-24-mc-v2.json':{items:[{id:'geometry-1',strand:'geometry',answer:4,correct_index:2}]},
    'tsi-math/content/math-locator-profiles.json':{profiles:[{code:'MATH01',levels:{geometry:'Basic'}}]},
  };
  const content=await loadPublishedCourse('tsi-math',{fetchImpl:fixtureFetch(files)});
  assert.deepEqual(content.lessons,['tsi-20d-d01','tsi-20d-d02','tsi-geometry-right-triangles-and-area-v1']);
  assert.equal(getCourseLesson(content,'tsi-20d-d02').ready,false);
  assert.equal(getCourseLesson(content,'tsi-geometry-right-triangles-and-area-v1').ready,true);
  assert.equal(content.tsiDraft,true);
  assert.equal(content.diagnosticItems[0].id,'geometry-1');
  assert.equal(content.locatorProfiles[0].code,'MATH01');
});

test('missing public resources fail closed instead of replacing real content with mocks',async()=>{
  await assert.rejects(()=>loadPublishedCourse('mobile-app-dev',{fetchImpl:fixtureFetch({})}),/unavailable/);
});
