// Browser-only public examples; private grading and student submissions are not connected.
const PREFIX='PUBLIC_CHECK_RESULTS=';

export function buildPublicChecks(task, source) {
  const cases=Array.isArray(task?.cases)?task.cases:[];
  const student=JSON.stringify(String(source));
  const testCases=JSON.stringify(JSON.stringify(cases));
  const python=[
    'import ast as __ast',
    'import io as __io',
    'import json as __json',
    'import contextlib as __ctx',
    'import traceback as __trace',
    '__student = '+student,
    '__cases = __json.loads('+testCases+')',
    '__results = []',
    'for __example in __cases:',
    '    __out = __io.StringIO()',
    '    try:',
    '        __env = {"__name__": "__main__"}',
    '        with __ctx.redirect_stdout(__out), __ctx.redirect_stderr(__out):',
    '            exec(compile(__student, "main.py", "exec"), __env)',
    task?.mode==='function'?
      '            __actual = eval(compile(__ast.parse(__example["call"], mode="eval"), "example", "eval"), __env)':
      '            __actual = __out.getvalue().rstrip("\\n")',
    task?.mode==='function'?
      '        __expected = __ast.literal_eval(__example["expected"])':
      '        __expected = __example["expected"].rstrip("\\n")',
    task?.mode==='function'?
      '        __ok = type(__actual) is type(__expected) and __actual == __expected':
      '        __ok = __actual == __expected',
    '        __results.append({"ok":__ok,"actual":str(__actual)[:240],"expected":str(__expected)[:240],"error":""})',
    '    except BaseException as __error:',
    '        __results.append({"ok":False,"actual":"","expected":str(__example.get("expected",""))[:240],"error":type(__error).__name__+": "+str(__error)[:200]})',
    'print("'+PREFIX+'"+__json.dumps(__results))',
  ];
  return python.join('\n')+'\n';
}

export function formatPublicCheckResults(output, sampleCount) {
  const line=String(output||'').split('\n').find(s=>s.startsWith(PREFIX));
  if(!line) return 'Checks did not finish. Review the Console output and try again.';
  try{
    const results=JSON.parse(line.slice(PREFIX.length));
    if(!Array.isArray(results)||results.length!==sampleCount)throw Error('Incomplete check results');
    const successes=results.filter(x=>x.ok).length;
    return [
      `${successes} of ${results.length} published examples matched.`,
      ...results.map((result,i)=>{
        if(result.ok)return `✓ Example ${i+1}: matched`;
        return `✗ Example ${i+1}: ${result.error||'Expected '+result.expected+'; received '+result.actual}`;
      }),
      '',
      'These are practice checks only. No grade or points were recorded.',
    ].join('\n');
  }catch{return 'Checks returned an unexpected result. Please run the code again.';}
}
