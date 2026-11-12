import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  normalizeOutput,summarizeChecks,practiceRowsFromPython,practiceRowsFromJava,
  practiceRowsFromCSharp,convertPreviewRows,challengeCases,buildChallengePython,
  buildJavaChallenge,parseJavaChallenge,challengeFunctionName
} from '../src/lib/previewChecks.js';
import { csharpClassName } from '../src/lib/livePreviewRuntime.js';

const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');

test('Python checks preserve per-example expected/received/error and avoid scoring real grades',()=>{
  const cases=[{call:'create_greeting("Kai")',expected:'"Welcome, Kai!"'},
    {call:'create_greeting("")',expected:'"Welcome, !"'}];
  const output='PUBLIC_CHECK_RESULTS='+JSON.stringify([
    {ok:true,actual:"'Welcome, Kai!'",error:''},
    {ok:false,actual:'None',error:''}
  ]);
  const rows=practiceRowsFromPython(output,cases);
  assert.deepEqual(summarizeChecks(rows),{passed:1,total:2});
  assert.equal(rows[0].passed,true);
  assert.equal(rows[1].received,'None');
  assert.equal(rows[1].expected,'"Welcome, !"');
  assert.throws(()=>practiceRowsFromPython('broken',cases),/no example-check results/);
  assert.throws(()=>practiceRowsFromPython('PUBLIC_CHECK_RESULTS=[]',cases),/every published example/);
});

test('Java checks normalize terminal line endings but preserve actual errors',()=>{
  const cases=[{args:['1','2'],expected:'3\n'},{args:[],expected:'0\n'}];
  const rows=practiceRowsFromJava([
    {success:true,stdout:'3\r\n',diagnostics:''},
    {success:false,stdout:'',diagnostics:'Compilation failed'}
  ],cases);
  assert.equal(normalizeOutput('3\r\n'),'3');
  assert.equal(rows[0].passed,true);
  assert.match(rows[1].error,/Compilation failed/);
  assert.equal(summarizeChecks(rows).passed,1);
});

test('C# parses real protocol responses into visible cards',()=>{
  const cases=[{call:'GetArenaName()',expected:'"Practice Arena"'}];
  const parser=(stdout,count)=>{
    assert.equal(stdout,'PLAYGROUND_CASE...');
    assert.equal(count,1);
    return [{index:0,passed:false,received:'None',expected:'Practice Arena',error:''}];
  };
  const rows=practiceRowsFromCSharp('PLAYGROUND_CASE...',cases,parser);
  assert.equal(rows[0].call,'GetArenaName()');
  assert.equal(rows[0].received,'None');
  assert.equal(summarizeChecks(rows).passed,0);
  assert.equal(csharpClassName('public class ArenaNaming { public static string GetArenaName() {} }'),'ArenaNaming');
  assert.equal(csharpClassName('public static class Solution {}'),'Solution');
});

const challenge={
  starter:'def temperature_alert(degrees): pass',
  challengeExamples:[{input:[32],expected:'Freeze'},{input:[90],expected:'Heat'}]
};
test('Python challenge executes the authored function only against visible examples',()=>{
  const source='def temperature_alert(degrees):\n    return "Freeze" if degrees <= 32 else "Heat"';
  assert.equal(challengeFunctionName(source,'python'),'temperature_alert');
  const harness=buildChallengePython(source,challenge,true);
  assert.match(harness,/temperature_alert/);
  assert.match(harness,/PUBLIC_CHECK_RESULTS/);
  assert.match(harness,/__case\["input"\]/);
  assert.match(buildChallengePython(source,challenge,false),/slice|__cases/);
});

test('Java/C# shared challenge calls use public inputs, preserve arrays and expected values',()=>{
  const java='public class Solution { public static int CountMatches(int[] events,int target){return 0;} }';
  const cs='public static class Solution { public static int CountMatches(int[] events,int target){return 0;} }';
  const data={challengeExamples:[{input:[[2,1,2],2],expected:2}],starter:cs};
  assert.equal(challengeCases(data,'java',java)[0].call,'CountMatches(new int[]{2,1,2}, 2)');
  assert.equal(challengeCases(data,'csharp',cs)[0].expectedLiteral,'2');
  const code=buildJavaChallenge(java,data);
  assert.match(code,/class __PlaygroundPracticeChecks/);
  assert.match(code,/Solution\.CountMatches/);
  assert.doesNotMatch(code,/hidden|secret/i);
  const rows=parseJavaChallenge('PLAYGROUND_CASE:0:1:2\n',[{call:'CountMatches(...)',expected:'2'}]);
  assert.equal(rows[0].passed,true);
});

test('sandboxed preview and real browser runners replace simulated UI while Submit stays disabled',()=>{
  const code=read('../src/components/course/CodePane.jsx');
  const output=read('../src/components/course/ConsolePane.jsx');
  const runtime=read('../src/lib/livePreviewRuntime.js');
  const challenge=read('../src/pages/ChallengeDetail.jsx');
  const project=read('../src/components/course/ProjectWorkspace.jsx');
  assert.match(code,/executeCompiled\(check\)/);
  assert.match(code,/browserPreviewSource\(/);
  assert.match(code,/disabled title="Submission and official grading are not connected/);
  assert.doesNotMatch(code,/runMockAction/);
  assert.match(output,/Checks/);
  assert.match(output,/practice-check-card/);
  assert.match(output,/sandbox="allow-scripts allow-forms"/);
  assert.doesNotMatch(output,/allow-same-origin/);
  assert.match(runtime,/\/playground\/.*java-runner\.mjs|java-runner\.mjs/);
  assert.match(runtime,/csharp-runner\.mjs/);
  assert.match(runtime,/project-preview\.mjs/);
  assert.match(challenge,/<CodePane/);
  assert.match(project,/projectId:project\.id,stepId:current\.id/);
});
