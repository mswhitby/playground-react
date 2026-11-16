import test from 'node:test';
import assert from 'node:assert/strict';
import {assignmentKind,summarizeAssignments} from '../src/lib/assignmentSummary.js';

test('assignment history keeps lesson and challenge totals separate',()=>{
  const entries=[
    {id:'lesson:ask-python-a-question',type:'lesson',status:'Completed',score:5,possible:5},
    {id:'challenge:lab-procedure-formatter',type:'challenge',status:'Completed',score:10,possible:10},
    {id:'challenge:classroom-topic-tag',type:'challenge',status:'Completed',score:10,possible:10},
  ];
  const s=summarizeAssignments(entries);
  assert.deepEqual(s.lessons,{completed:1,graded:1,tracked:1,earned:5,possible:5});
  assert.deepEqual(s.challenges,{completed:2,graded:2,tracked:2,earned:20,possible:20});
});

test('activity kind recognizes lowercase history types and prefixed IDs',()=>{
  assert.equal(assignmentKind({type:'challenge'}),'challenge');
  assert.equal(assignmentKind({id:'challenge:foo'}),'challenge');
  assert.equal(assignmentKind({type:'lesson'}),'lesson');
  assert.equal(assignmentKind({id:'lesson:foo'}),'lesson');
});
