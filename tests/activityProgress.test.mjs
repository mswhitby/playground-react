import test from 'node:test';
import assert from 'node:assert/strict';
import {splitActivityProgress} from '../src/lib/activityProgress.js';
test('lesson and challenge grades and completions remain separate',()=>{
 const grades=[
  {id:'lesson:old-lesson',earned:5,possible:5},
  {id:'challenge:old-challenge',earned:8,possible:10},
  {id:'challenge:old-challenge',earned:10,possible:10},
 ];
 const actual=splitActivityProgress({lessons:['old-lesson','other'],challenges:['old-challenge'],grades});
 assert.deepEqual(actual.lessons,{available:2,completed:1,earned:5,possible:5,graded:1});
 assert.deepEqual(actual.challenges,{available:1,completed:1,earned:10,possible:10,graded:1});
 assert.equal(grades[1].id,'challenge:old-challenge');
});
test('unrecognized unprefixed records do not contaminate totals',()=>{
 const x=splitActivityProgress({grades:[{id:'unknown',earned:100,possible:100}]});
 assert.equal(x.lessons.earned+x.challenges.earned,0);
});
