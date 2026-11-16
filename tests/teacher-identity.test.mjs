import test from 'node:test';
import assert from 'node:assert/strict';
import {buildTeacherIdentity,identityForStudent} from '../src/lib/teacherIdentity.js';
import {niceName,sortStudent} from '../src/lib/students.js';
const id='00000000-0000-4000-8000-000000000001';
const person={user_id:id,github_account:'student-handle',student_name:'Signup Student'};
const member={user_id:id,github_account:'student-handle',display_name:'Section Backup'};
test('name priority is teacher then synced Sheet then signup then GitHub',()=>{
 const resolve=(names,sheets,people=[person])=>niceName(identityForStudent(buildTeacherIdentity(names,sheets,people),member));
 assert.equal(resolve([{user_id:id,display_name:'Teacher Preferred'}],[{user_id:id,name:'Sheet Name'}]),'Teacher Preferred');
 assert.equal(resolve([],[{user_id:id,name:'Sheet Name'}]),'Sheet Name');
 assert.equal(resolve([],[]),'Signup Student');
 assert.equal(resolve([],[],[{...person,student_name:''}]),'Section Backup');
 assert.equal(niceName(identityForStudent(buildTeacherIdentity([],[],[]),{user_id:id,github_account:'student-handle'})),'student-handle');
});
test('directory name joins by account id; sorting uses resolved names',()=>{
 const identity=buildTeacherIdentity([{user_id:id,display_name:'Zara Teacher'}],[{user_id:id,name:'Amy Sheet'}],[person]);
 const first={...identityForStudent(identity,member),id};
 const second={github:'another',studentName:'Bella Signup',id:'second'};
 assert.equal(sortStudent(first,second,'first')>0,true);
 assert.equal(first.github,'student-handle');
});
