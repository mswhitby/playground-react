import test from 'node:test';
import assert from 'node:assert/strict';
import {createLessonIdentityResolver} from '../src/lib/lessonIdentity.js';
test('old grades resolve to permanent lesson identity without changing their stored IDs',()=>{
 const catalog={lessonRecords:{'01-how-programs-work/01-first-message':{
  id:'01-how-programs-work/01-first-message',stableId:'les_8f3a2c91',
  legacyIds:['01-how-programs-work/01-first-message'],title:'Instructions and output'}}};
 const resolver=createLessonIdentityResolver(catalog);
 const stored={activity_id:'lesson:01-how-programs-work/01-first-message',points:5};
 assert.equal(resolver.title(stored.activity_id),'Instructions and output');
 assert.equal(resolver.canonicalId(stored.activity_id),'les_8f3a2c91');
 assert.equal(resolver.title('les_8f3a2c91'),'Instructions and output');
 assert.equal(stored.activity_id,'lesson:01-how-programs-work/01-first-message');
});
test('duplicate aliases fail closed',()=>{
 assert.throws(()=>createLessonIdentityResolver({lessonRecords:{
  a:{stableId:'les_aaaaaaaa',legacyIds:['old']},
  b:{stableId:'les_bbbbbbbb',legacyIds:['old']}
 }}),/Ambiguous/);
});
