import test from 'node:test';
import assert from 'node:assert/strict';
import {
  activeMemberships,availableRosterPeriods,buildSheetIndex,periodFromSectionName,rosterPeriodsForStudent
} from '../src/lib/rosterPeriods.js';

test('period mapping combines Sheet periods and live section names',()=>{
  const memberships=[
    {name:'Period 3',status:'approved'},
    {name:'Game Programming Period #6',status:'pending'},
    {name:'Period 8',status:'rejected'}
  ];
  assert.deepEqual(rosterPeriodsForStudent(['1','3'],memberships),['1','3','6']);
  assert.equal(periodFromSectionName('Computer Science I - Period 4'),'4');
  assert.equal(periodFromSectionName('UIL Team'),null);
  assert.equal(activeMemberships(memberships).length,2);
});

test('available periods are derived from connected students, not fictional section IDs',()=>{
  assert.deepEqual(availableRosterPeriods([{periods:['6','1']},{periods:['3','6']}]),['1','3','6']);
});

test('duplicate Sheet usernames are skipped like the live directory',()=>{
  const result=buildSheetIndex([
    {github:'StudentOne',periods:['1']},
    {github:'@studentone',periods:['3']},
    {github:'student-two',periods:['6']}
  ]);
  assert.equal(result.byGithub.has('studentone'),false);
  assert.equal(result.duplicates.has('studentone'),true);
  assert.equal(result.byGithub.get('student-two').periods[0],'6');
});
