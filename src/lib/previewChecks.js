// Student-visible, formative check results. Never write to grades or submission APIs.
export const normalizeOutput = value => String(value ?? '').replace(/\r\n/g, '\n').replace(/\n$/, '');

export function summarizeChecks(cases) {
  const rows = Array.isArray(cases) ? cases : [];
  return { passed:rows.filter(row => row.passed === true).length, total:rows.length };
}
export function practiceRowsFromPython(output, cases) {
  const marker = String(output || '').split(/\r?\n/).find(line => line.startsWith('PUBLIC_CHECK_RESULTS='));
  if (!marker) throw new Error('Python returned no example-check results. See Console for errors.');
  const records = JSON.parse(marker.slice('PUBLIC_CHECK_RESULTS='.length));
  if (!Array.isArray(records) || records.length !== cases.length) throw new Error('Python did not finish every published example.');
  return cases.map((example,index) => ({
    call:example.call || 'Example ' + (index + 1),
    expected:String(example.expected ?? ''),
    received:String(records[index].actual ?? ''),
    error:String(records[index].error || ''),
    passed:records[index].ok === true
  }));
}
export function practiceRowsFromJava(results,cases) {
  return cases.map((item,index) => ({
    call:'main(' + JSON.stringify(item.args || []) + ')',
    expected:normalizeOutput(item.expected),
    received:normalizeOutput(results[index]?.stdout),
    error:String(results[index]?.diagnostics || results[index]?.stderr || ''),
    passed:results[index]?.success === true && normalizeOutput(results[index].stdout) === normalizeOutput(item.expected)
  }));
}
export function practiceRowsFromCSharp(stdout,cases,parseChecks) {
  const results=parseChecks(stdout,cases.length);
  return results.map(row=>({
    call:cases[row.index].call,
    expected:row.expected,
    received:row.received,
    error:row.error,
    passed:row.passed
  }));
}
export function convertPreviewRows(rows) {
  return (rows || []).map((row,i) => ({
    call:String(row.call || row.label || 'Check ' + (i+1)),
    expected:String(row.expected ?? 'Requirement met'),
    received:String(row.received ?? (row.pass === true || row.passed === true ? 'Requirement met' : 'Not yet met')),
    error:String(row.error || ''),
    passed:row.pass === true || row.passed === true
  }));
}

function pythonName(source) {
  return /^\s*(?:async\s+)?def\s+([A-Za-z_]\w*)\s*\(/m.exec(source)?.[1] || null;
}
function jsxName(source,language) {
  if(language==='python')return pythonName(source);
  if(language==='javascript')return /(?:export\s+)?function\s+([\w$]+)\s*\(/.exec(source)?.[1] || null;
  if(language==='csharp')return /\b(?:public\s+)?static\s+[\w\[\]<>?, ]+?\s+([A-Za-z_]\w*)\s*\(/.exec(source)?.[1] || null;
  if(language==='java')return /\bpublic\s+static\s+[\w\[\]<>?, ]+?\s+([A-Za-z_]\w*)\s*\(/.exec(source)?.[1] || null;
  return null;
}
export const challengeFunctionName = jsxName;

function typedLiteral(value, language, arrayHint = null) {
  if(typeof value==='string')return JSON.stringify(value);
  if(value===null)return 'null';
  if(typeof value==='boolean')return String(value);
  if(typeof value==='number')return Number.isFinite(value) ? String(value) : '0';
  if(Array.isArray(value)) {
    const numbers=value.every(x=>Number.isInteger(x));
    const strings=value.every(x=>typeof x==='string');
    const booleans=value.every(x=>typeof x==='boolean');
    const type=value.length===0 && arrayHint ? arrayHint : numbers?'int':strings?'string':booleans?'bool':'double';
    const translated=language==='java' ? (type==='string'?'String':type==='bool'?'boolean':type) : type;
    return 'new ' + translated + '[]{' + value.map(x=>typedLiteral(x,language)).join(',') + '}';
  }
  throw new Error('This example uses a data type unsupported by the browser checker.');
}
export function challengeCases(task,language,source) {
  const name=jsxName(source,language) || jsxName(task.starter || '',language);
  if(!name)throw new Error('The checker could not find a function declaration.');
  const examples=task.challengeExamples || [];
  const hints=(examples[0]?.input || []).map((_,index)=>{
    const found=examples.map(row=>row.input?.[index]).find(item=>Array.isArray(item)&&item.length>0);
    return Array.isArray(found)?typeof found[0]==='boolean'?'bool':
      typeof found[0]==='string'?'string':Number.isInteger(found[0])?'int':'double':null;
  });
  return examples.map(row=>({
    ...row,call:name + '(' + (row.input||[]).map((x,index)=>typedLiteral(x,language,hints[index])).join(', ') + ')',
    expectedLiteral:typedLiteral(row.expected,language),
    expected:String(row.expected)
  }));
}
export function buildChallengePython(source, task, check=true) {
  const fn=jsxName(source,'python')||jsxName(task.starter||'','python');
  if(!fn)throw new Error('Define the challenge function before running it.');
  const rows=task.challengeExamples||[];
  return [
    'import json as __json, io as __io, contextlib as __ctx',
    '__source = '+JSON.stringify(source),
    '__cases = __json.loads('+JSON.stringify(JSON.stringify(check?rows:rows.slice(0,1)))+')',
    '__results = []',
    'for __case in __cases:',
    '    try:',
    '        __env = {"__name__":"student"}',
    '        with __ctx.redirect_stdout(__io.StringIO()): exec(compile(__source,"main.py","exec"),__env)',
    '        __actual = __env['+JSON.stringify(fn)+'](*__case["input"])',
    '        __ok = type(__actual) is type(__case["expected"]) and __actual == __case["expected"]',
    '        __results.append({"ok":__ok,"actual":repr(__actual)[:300],"error":""})',
    '    except BaseException as __error:',
    '        __results.append({"ok":False,"actual":"","error":type(__error).__name__+": "+str(__error)[:300]})',
    'print("PUBLIC_CHECK_RESULTS="+__json.dumps(__results))',
  ].join('\n');
}
export function buildJavaChallenge(source,task) {
  const cases=challengeCases(task,'java',source);
  if(!cases.length) throw new Error('No visible examples are available.');
  const lines=cases.map((row,i)=>`try{Object actual=Solution.${row.call}; Object expected=${row.expectedLiteral}; boolean ok=java.util.Objects.deepEquals(actual,expected); String received=java.util.Arrays.deepToString(new Object[]{actual}); received=received.substring(1,received.length()-1); System.out.println("PLAYGROUND_CASE:${i}:"+(ok?"1":"0")+":"+received);}catch(Throwable error){System.out.println("PLAYGROUND_CASE:${i}:0:ERROR "+error.getClass().getSimpleName()+" "+error.getMessage());}`);
  return source+'\nclass __PlaygroundPracticeChecks {public static void main(String[] args) {'+lines.join('\n')+'}}';
}
export function parseJavaChallenge(stdout,cases) {
  const lines=String(stdout||'').split(/\r?\n/).filter(line=>line.startsWith('PLAYGROUND_CASE:'));
  if(lines.length!==cases.length)throw new Error('Java did not return all published examples.');
  return cases.map((row,i)=>{
    const line=lines[i],match=/^PLAYGROUND_CASE:(\d+):([01]):([\s\S]*)$/.exec(line);
    if(!match||Number(match[1])!==i)throw Error('Java returned invalid check data.');
    return {call:row.call,expected:row.expected,received:match[3],passed:match[2]==='1',error:match[3].startsWith('ERROR ')?match[3]:''};
  });
}
