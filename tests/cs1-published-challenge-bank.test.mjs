import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {publishedCs1Challenges,filterPublishedCs1Challenges,cs1ChallengeStatement,cs1ChallengeDraftKey,PYTHON_ONLY_NOTICE} from '../src/lib/cs1ChallengeBank.js';
import {resolveRoute} from '../src/lib/routes.js';

const published = {
  id:'app-event-type-tally',title:'App Event Type Tally',difficulty:'Easy',points:10,
  topics:['Dictionaries','Loops','Strings'],scenario:'Count events.',
  parameters:'`events` is a list of strings.',behavior:'Return a dictionary.',
  starter:'def count_app_events(events):\n    pass\n',
  examples:[{call:"count_app_events(['CLICK'])",expected:"{'click': 1}"}],
  skills:'# Skills guide\n\nRead and practice.',solutions:'DO NOT PUBLISH',
  tests:{hidden:true},internalAccessToken:'not-public'
};
test('published CS1 challenges use their original IDs, examples and safe public fields only',()=>{
  const rows=publishedCs1Challenges({challenges:[
    {id:'broken',title:'No examples',starter:'def broken(): pass',examples:[]},
    {...published},
    {...published,id:'upload-space-check',title:'Upload Space Check',difficulty:'Very Easy',topics:['Booleans']}
  ]});
  assert.deepEqual(rows.map(row=>row.id),['app-event-type-tally','upload-space-check']);
  assert.deepEqual(rows[0].languages,['python']);
  assert.deepEqual(rows[0].examples,published.examples);
  assert.equal(rows[0].points,10);
  assert.equal(rows[0].starter,published.starter);
  for(const field of ['solutions','tests','internalAccessToken'])assert(!Object.hasOwn(rows[0],field));
  assert.equal(rows[0].source,'published-cs1');
  assert.match(PYTHON_ONLY_NOTICE,/Python challenges are available now/);
  assert.equal(cs1ChallengeDraftKey(rows[0].id),'cs1:challenges:2026-10-26:draft:app-event-type-tally');
});
test('shared bank filters CS1 Python problems by course, topic, level, language and search',()=>{
  const catalog=publishedCs1Challenges({challenges:[published]});
  assert.equal(filterPublishedCs1Challenges(catalog,{course:'computer-science-1',language:'python',topic:'Loops',difficulty:'Easy'}).length,1);
  assert.equal(filterPublishedCs1Challenges(catalog,{language:'java'}).length,0);
  assert.equal(filterPublishedCs1Challenges(catalog,{course:'uil'}).length,0);
  assert.equal(filterPublishedCs1Challenges(catalog,{query:'event type'}).length,1);
  assert.equal(filterPublishedCs1Challenges(catalog,{query:'unrelated'}).length,0);
});
test('published challenge Markdown includes visible public examples and optional skill guidance',()=>{
  const [task]=publishedCs1Challenges({challenges:[published]});
  const markdown=cs1ChallengeStatement(task);
  for(const fragment of ['Scenario','Parameters','Required behavior','Published examples',"count_app_events(['CLICK'])","# Skills guide"])
    assert(markdown.includes(fragment),fragment);
  assert(!markdown.includes('DO NOT PUBLISH'));
});
test('integrated challenge deep links resolve through the real CS1 IDs without modifying preview routes',()=>{
  const ids=['app-event-type-tally','upload-space-check'];
  assert.deepEqual(resolveRoute('/challenges/app-event-type-tally',undefined,ids),{page:'challenge',challengeId:'app-event-type-tally'});
  assert.equal(resolveRoute('/challenges/attendance-percent',undefined,ids).page,'not-found');
  assert.equal(resolveRoute('/challenges/attendance-percent').page,'challenge');
});
test('integration UI stays Python-only and uses browser formative checks without Submit writes',()=>{
  const app=readFileSync(new URL('../src/App.jsx',import.meta.url),'utf8');
  const challenge=readFileSync(new URL('../src/pages/ChallengeDetail.jsx',import.meta.url),'utf8');
  const code=readFileSync(new URL('../src/components/course/CodePane.jsx',import.meta.url),'utf8');
  assert.match(app,/catalog=\{integrationChallenges\} pythonOnly=\{cs1IntegrationMode\}/);
  assert.match(challenge,/cs1ChallengeDraftKey\(challengeId\)/);
  assert.match(challenge,/publicPythonCases:isPublishedCs1/);
  assert.match(code,/buildPublicChecks\(\{cases:task\.challengeExamples,mode:'function'\},code\)/);
  assert.match(code,/Submit \(not enabled\)/);
});
