import { useEffect, useRef, useState } from 'react';
import { Code2, Save, Send } from 'lucide-react';
import CodeEditor from './CodeEditor.jsx';
import { useSaved } from '../../hooks/useSaved.js';
import { readString, storageKeys, writeString } from '../../lib/storage.js';
import Chip from '../ui/Chip.jsx';
import Splitter from '../ui/Splitter.jsx';
import ConsolePane from './ConsolePane.jsx';
import { buildPublicChecks } from '../../lib/publicPythonChecks.js';
import {
  summarizeChecks,practiceRowsFromPython,practiceRowsFromJava,practiceRowsFromCSharp,
  convertPreviewRows,challengeCases,buildChallengePython,buildJavaChallenge,parseJavaChallenge
} from '../../lib/previewChecks.js';
import { browserPreviewSource,createLanguageRunner,csharpClassName } from '../../lib/livePreviewRuntime.js';

/**
 * Live student practice against PUBLIC examples, never trusted grading.
 * Python, C# and Java run inside browser workers; web previews run in a sandboxed frame.
 */
export default function CodePane({lessonId,task}) {
  const codeKey=task.storageKey || storageKeys.code(lessonId);
  const isProjectDraft=Boolean(task.projectDraft);
  const isChallenge=Boolean(task.isChallenge);
  const workspace=useRef(null);
  const runner=useRef(null);
  const frameRef=useRef(null);
  const previewRequest=useRef(null);
  const timeout=useRef(null);
  const [running,setRunning]=useState(false);
  const [code,setCode]=useState(task.starter || '');
  const [consoleText,setConsoleText]=useState(task.console || 'Press Run to execute the code.');
  const [savedMessage,setSavedMessage]=useState('');
  const [checksText,setChecksText]=useState('Choose Check to run the published examples. Your scores are not recorded.');
  const [checkRows,setCheckRows]=useState(null);
  const [previewDoc,setPreviewDoc]=useState('');
  const isBrowser=['html','css','javascript','jsx'].includes(task.language);
  const previewEnabled=isBrowser && !isChallenge;
  const [consoleTab,setConsoleTab]=useState(previewEnabled?'Preview':'Console');
  const [editorHeight,setEditorHeight]=useSaved('designlab:editor-height',300);

  useEffect(()=>{
    setCode(readString(codeKey) ?? task.starter ?? '');
    setConsoleText(task.console || 'Run to see your program output.');
    setChecksText('Choose Check to run the published examples. Your scores are not recorded.');
    setCheckRows(null);
    setConsoleTab(isBrowser&&!isChallenge?'Preview':'Console');
    setPreviewDoc('');
    setSavedMessage('');
  },[codeKey,task.language,task.starter,task.console,isBrowser,isChallenge]);

  useEffect(()=>()=> {
    clearTimeout(timeout.current);
    previewRequest.current=null;
    runner.current?.instance.dispose();
    runner.current=null;
  },[]);

  useEffect(()=>{
    function handleMessage(event) {
      const request=previewRequest.current;
      if(!request || !frameRef.current || event.source!==frameRef.current.contentWindow ||
        event.data?.token!==request.token)return;
      const message=event.data;
      if(message.kind==='log'){
        setConsoleText(old=>(old==='Run to see your program output.'?'':old)+'['+(message.level||'log')+'] '+message.text+'\n');
      }
      if(message.kind==='clear')setConsoleText('');
      if(message.kind==='error'){
        clearTimeout(timeout.current);
        setConsoleText(old=>old+'Error: '+message.text+'\n');
        if(request.check)setChecksText('Fix the runtime error, then try Check again.');
        previewRequest.current=null;setRunning(false);
        setConsoleTab('Console');
      }
      if(message.kind==='checks'){
        clearTimeout(timeout.current);
        setCheckRows(convertPreviewRows(message.results || (message.text?[{label:message.text,pass:message.pass}]:[])));
        previewRequest.current=null;setRunning(false);
        setConsoleTab('Checks');
      }
      if(message.kind==='ready'&&!request.check){
        clearTimeout(timeout.current);
        previewRequest.current=null;setRunning(false);
      }
    }
    window.addEventListener('message',handleMessage);
    return ()=>window.removeEventListener('message',handleMessage);
  },[]);

  function resizeRows(event) {
    if(!workspace.current)return;
    const rect=workspace.current.getBoundingClientRect();
    setEditorHeight(Math.max(160,Math.min(rect.height-120,event.clientY-rect.top)));
  }

  async function getRunner() {
    if(!runner.current || runner.current.language!==task.language) {
      runner.current?.instance.dispose();
      const item=await createLanguageRunner(task.language,message=>setConsoleText(message));
      runner.current={...item,language:task.language};
    }
    return runner.current;
  }

  async function executeCompiled(check) {
    const type=task.language;
    const active=await getRunner();
    if(type==='python'){
      let source=code;
      if(isChallenge){
        source=buildChallengePython(code,{...task,starter:task.starter},check);
      } else if(check) {
        if(!task.cases?.length)throw Error('This lesson has no published examples.');
        source=buildPublicChecks(task,code);
      } else if(task.mode==='function' && task.cases?.[0]?.call) {
        const {previewHarness}=await import(/* @vite-ignore */ '/playground/python-checks.mjs');
        source=previewHarness(code,task.cases[0].call);
      }
      const result=await active.instance.run(source);
      if(check) {
        const rows=isChallenge?task.challengeExamples.map(row=>({
          call:(task.functionName || 'Function')+'('+JSON.stringify(row.input)+')',
          expected:JSON.stringify(row.expected)
        })):task.cases;
        setCheckRows(practiceRowsFromPython(result.output,rows));
        setConsoleText('Python completed the public checks. Review individual results in Checks.');
      }else if(isChallenge){
        const rows=practiceRowsFromPython(result.output,[{
          call:'First published example',expected:JSON.stringify(task.challengeExamples[0].expected)
        }]);
        setConsoleText(rows[0].error || 'First example returned '+rows[0].received+'. Expected '+rows[0].expected+'.');
      }else if(task.mode==='function' && task.cases?.[0]?.call) {
        const marker=String(result.output||'').split('\n').find(line=>line.startsWith('PLAYGROUND_PREVIEW='));
        if(marker) {
          const details=JSON.parse(marker.slice('PLAYGROUND_PREVIEW='.length));
          setConsoleText(details.call+'\nReturned: '+details.returned+(details.printed?'\nPrinted: '+details.printed:''));
        }else setConsoleText(result.output || 'No return value was captured. See your code and retry.');
      }else setConsoleText(result.output || (result.success?'Program finished with no printed output.':'The Python program stopped.'));
    }
    if(type==='java'){
      if(task.environment==='ide')throw Error('This lesson uses Java 26 file input and must run in a full Java IDE. Browser execution is not supported.');
      if(isChallenge) {
        const cases=challengeCases(task,'java',code);
        const used=check?cases:cases.slice(0,1);
        const result=await active.instance.run(buildJavaChallenge(code,{...task,challengeExamples:used}),[]);
        if(!result.success)throw Error([result.stdout,result.stderr,result.diagnostics].filter(Boolean).join('\n'));
        const rows=parseJavaChallenge(result.stdout,used);
        if(check)setCheckRows(rows);
        else setConsoleText(rows.map(r=>r.call+'\nReceived: '+r.received+'\nExpected: '+r.expected).join('\n'));
      } else {
        const cases=check?task.cases||[]:[{args:task.runArgs || task.cases?.[0]?.args || []}];
        if(check && !cases.length)throw Error('No public Java examples are available for this exercise.');
        const results=[];
        for(const item of cases) {
          const result=await active.instance.run(code,item.args || []);
          results.push(result);
          if(!result.success)break;
        }
        if(check) {
          const rows=practiceRowsFromJava(results,cases);
          if(results.length!==cases.length)throw Error('Java stopped before completing all published examples: '+(results.at(-1)?.diagnostics||results.at(-1)?.stderr||'Unknown error'));
          setCheckRows(rows);
          setConsoleText('Java completed the published checks. Review the Checks tab.');
        }else setConsoleText([results[0]?.stdout,results[0]?.stderr,results[0]?.diagnostics].filter(Boolean).join('\n') || 'Java ran without printed output.');
      }
    }
    if(type==='csharp'){
      const protocol=active.protocol;
      const cases=isChallenge?challengeCases(task,'csharp',code).map(row=>({...row,expected:row.expectedLiteral})):task.cases || [];
      const className=isChallenge?'Solution':csharpClassName(code);
      const shouldUseChecks=check || (isChallenge&&cases.length>0);
      if(check&&!cases.length)throw Error('No public C# examples are available for this exercise.');
      if(shouldUseChecks&&!className)throw Error('The C# checker could not find the public class name.');
      const used=check?cases:cases.slice(0,1);
      const helper=shouldUseChecks?protocol.buildChecks(used,className):null;
      const result=await active.instance.run(code,helper);
      if(!result.compiled || !result.success)throw Error([result.diagnostics,result.stderr].filter(Boolean).join('\n')||'C# could not execute.');
      if(shouldUseChecks) {
        const rows=practiceRowsFromCSharp(result.stdout,used,protocol.parseChecks);
        if(check)setCheckRows(rows);
        else setConsoleText(rows.map(row=>row.call+'\nReceived: '+row.received+'\nExpected: '+row.expected).join('\n'));
      }else setConsoleText(result.stdout || 'C# executed without printed output.');
    }
  }

  async function execute(check) {
    if(running)return;
    setRunning(true);setSavedMessage('');
    setCheckRows(null);
    if(check){setChecksText('Running published example checks…');setConsoleTab('Checks');}
    else {setConsoleText('Preparing runner…');setConsoleTab(previewEnabled?'Preview':'Console');}
    try {
      if(isBrowser) {
        const token=crypto.randomUUID();
        previewRequest.current={token,check};
        const html=await browserPreviewSource({
          code,language:task.language,lessonId,task,token,check
        });
        setPreviewDoc(html);setConsoleText('');
        clearTimeout(timeout.current);
        timeout.current=setTimeout(()=>{
          if(previewRequest.current?.token!==token)return;
          previewRequest.current=null;setRunning(false);
          setConsoleText('The preview did not finish within 7 seconds. Check for errors or an infinite loop.');
          setChecksText('Practice timed out. No result was recorded.');
          if(frameRef.current)frameRef.current.srcdoc='<p>Preview stopped after timeout.</p>';
          setConsoleTab('Console');
        },7000);
      }else{
        await executeCompiled(check);
        setRunning(false);
      }
    }catch(error){
      clearTimeout(timeout.current);
      previewRequest.current=null;setRunning(false);
      const message=String(error?.message||error);
      setConsoleText(message);setConsoleTab('Console');
      if(check)setChecksText('Check unavailable: '+message);
    }
  }

  function act(action) {
    if(running)return;
    if(action==='Run'||action==='Check'){void execute(action==='Check');return;}
    if(action==='Save'){
      writeString(codeKey,code);setSavedMessage('Draft saved in this browser only.');return;
    }
    if(action==='Reset'){
      setCode(task.starter || '');
      writeString(codeKey,task.starter || '');
      setCheckRows(null);setPreviewDoc('');
      setChecksText('Choose Check to run published examples again.');
      setConsoleText('Starter code restored. No points were recorded.');
      setConsoleTab(previewEnabled?'Preview':'Console');
    }
  }

  return <div className="code-pane">
    <div className="pane-header">
      <strong><Code2 size={16}/> Editor</strong>
      <div className="right-meta">{task.language.toUpperCase()} <Chip>Live practice</Chip></div>
    </div>
    <div className="code-workspace" ref={workspace} style={{'--editor-height':editorHeight+'px'}}>
      <CodeEditor value={code} language={task.language} onChange={value=>{
        setCode(value);
        if(isProjectDraft||isChallenge)writeString(codeKey,value);
        setSavedMessage('');setCheckRows(null);
        setChecksText('Code changed. Choose Check to run fresh examples.');
      }}/>
      <Splitter axis="rows" onDrag={resizeRows}/>
      <ConsolePane text={consoleText} checksText={checksText} checkRows={checkRows}
        points={task.points} language={task.language} lessonId={lessonId}
        previewEnabled={previewEnabled} previewDoc={previewDoc} previewRef={frameRef}
        activeTab={consoleTab} onTabChange={setConsoleTab}/>
    </div>
    <div className="editor-controls">
      <div>
        {['Run','Check','Reset'].map(action=><button type="button" key={action}
          className="btn" disabled={running} onClick={()=>act(action)}>{action}</button>)}
        {running && <button type="button" className="btn" onClick={()=>{
          runner.current?.instance.stop?.();previewRequest.current=null;
          clearTimeout(timeout.current);setRunning(false);setConsoleText('Execution stopped.');
        }}>Stop</button>}
      </div>
      <div>
        <button type="button" className="btn" disabled={running} onClick={()=>act('Save')}><Save size={15}/> Save</button>
        <button type="button" className="btn submit" disabled title="Submission and official grading are not connected in this preview">
          <Send size={15}/> Submit (not enabled)
        </button>
      </div>
    </div>
    <div className="editor-note" role="status">{savedMessage||
      'Run executes code locally; Check tests public examples only. No grades, points or hand-ins are recorded.'}</div>
  </div>;
}
