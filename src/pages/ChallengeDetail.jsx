import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, BookOpenText, Check, Code2, RotateCcw, Save, Send, TerminalSquare } from 'lucide-react';
import { getChallenge,getChallengeExamples,getChallengeStarter,getChallengeStatement,challengeLanguages,languageLabels } from '../data/challenges.js';
import { renderMarkdown } from '../lib/markdown.js';
import { readString,writeString } from '../lib/storage.js';
import { useSaved } from '../hooks/useSaved.js';
import Splitter from '../components/ui/Splitter.jsx';

const draftKey=(id,lang)=>'designlab:challenge-code:'+id+':'+lang;
export default function ChallengeDetail({challengeId,onBack}) {
  const task=getChallenge(challengeId);
  const [language,setLanguage]=useSaved('designlab:challenge-language','python');
  const lang=challengeLanguages.includes(language)?language:'python';
  const key=draftKey(challengeId,lang),starter=getChallengeStarter(challengeId,lang);
  const [code,setCode]=useState(()=>readString(key)??starter);
  const [output,setOutput]=useState('Run and Check are simulations. This preview does not execute code.');
  const [message,setMessage]=useState('');
  const [history,setHistory]=useSaved('designlab:challenge-attempts',[]);
  const [leftWidth,setLeftWidth]=useSaved('designlab:challenge-left-width',420);
  const [editorHeight,setEditorHeight]=useSaved('designlab:challenge-editor-height',330);
  const work=useRef(null),rows=useRef(null);
  const samples=getChallengeExamples(challengeId);
  const mine=history.filter(x=>x.challengeId===challengeId);
  useEffect(()=>{setCode(readString(key)??starter);setOutput('Run / Check are design-only controls—no program is executed.');setMessage('');},[key,starter]);
  const change=text=>{setCode(text);writeString(key,text);setMessage('Draft saved in this browser for '+languageLabels[lang]+'.');};
  const act=action=>{
    if(action==='Reset'){change(starter);setOutput('Starter restored; nothing was executed.');return;}
    if(action==='Save'){writeString(key,code);setMessage('Draft saved in this browser.');return;}
    if(action==='Submit'){setHistory(h=>[...h,{id:'demo-'+Date.now()+'-'+Math.random().toString(36).slice(2),challengeId,language:lang,code,submittedAt:new Date().toISOString()}]);setMessage('Demo hand-in recorded locally. No code was graded or delivered to a teacher.');return;}
    const cases=samples.map((e,i)=>'Example '+(i+1)+': input '+JSON.stringify(e.input)+' → expected '+JSON.stringify(e.expected)).join('\n');
    setOutput((action==='Check'?'Published checks (NOT run against your code):':'Published example outputs (your code was NOT executed):')+'\n\n'+cases);
  };
  const resizeCols=e=>{if(!work.current)return;const rect=work.current.getBoundingClientRect();setLeftWidth(Math.max(280,Math.min(rect.width-360,e.clientX-rect.left)));};
  const resizeRows=e=>{if(!rows.current)return;const rect=rows.current.getBoundingClientRect();setEditorHeight(Math.max(180,Math.min(rect.height-130,e.clientY-rect.top)));};
  if(!task)return <div className="main-content"><h1>Challenge not found</h1><button className="btn" onClick={onBack}>Back to bank</button></div>;
  return <div className="challenge-detail-page">
    <div className="challenge-breadcrumb"><button onClick={onBack}><ArrowLeft size={16}/> Challenge Bank</button><span>/</span><span>{task.title}</span></div>
    <header className="challenge-detail-heading surface-card"><div className="eyebrow">Shared challenge · {task.difficulty} · {task.points} points</div><h1>{task.title}</h1><p>{task.summary}</p>
      <div className="challenge-prerequisites"><strong>Prerequisites:</strong>{task.prerequisites.map(x=><span key={x}>{x}</span>)}</div>
    </header>
    <div className="challenge-workspace" ref={work} style={{'--challenge-left':leftWidth+'px'}}>
      <section className="challenge-instructions"><div className="pane-header"><strong><BookOpenText size={16}/> Problem &amp; examples</strong><span className="challenge-points">{task.points} pts</span></div><div className="markdown-preview challenge-markdown" dangerouslySetInnerHTML={{__html:renderMarkdown(getChallengeStatement(challengeId))}}/></section>
      <Splitter axis="columns" onDrag={resizeCols}/>
      <section className="challenge-editor-panel"><div className="pane-header"><strong><Code2 size={16}/> Solution editor</strong><label className="challenge-language-selector">Language <select aria-label="Solution language" value={lang} onChange={e=>setLanguage(e.target.value)}>{challengeLanguages.map(x=><option key={x} value={x}>{languageLabels[x]}</option>)}</select></label></div>
        <div className="challenge-code-layout" ref={rows} style={{'--challenge-editor-height':editorHeight+'px'}}>
          <textarea className="code-editor challenge-editor" spellCheck={false} aria-label={languageLabels[lang]+' solution editor'} value={code} onChange={e=>change(e.target.value)}/>
          <Splitter axis="rows" onDrag={resizeRows}/>
          <div className="console-pane"><div className="console-heading"><TerminalSquare size={15}/> Console <span>Design-only preview</span></div><pre role="status">{output}</pre></div>
        </div>
        <div className="editor-controls challenge-controls"><div><button className="btn" onClick={()=>act('Run')}>Run</button><button className="btn" onClick={()=>act('Check')}><Check size={15}/> Check</button><button className="btn" onClick={()=>act('Reset')}><RotateCcw size={15}/> Reset</button></div><div><button className="btn" onClick={()=>act('Save')}><Save size={15}/> Save</button><button className="btn primary" onClick={()=>act('Submit')}><Send size={15}/> Demo submit</button></div></div>
        <p className="challenge-editor-message" role="status">{message||'Resize the panels by dragging their gutters. Language drafts save separately in this browser.'}</p>
      </section>
    </div>
    {mine.length>0&&<section className="challenge-history surface-card"><h2>Demo hand-ins ({mine.length})</h2><p>These are saved only in your browser, not real grades.</p>{mine.slice().reverse().map(x=><details key={x.id}><summary>{languageLabels[x.language]} · {new Date(x.submittedAt).toLocaleString()}</summary><pre>{x.code}</pre></details>)}</section>}
  </div>;
}
