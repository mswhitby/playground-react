import { useRef } from 'react';
import { ArrowLeft, BookOpenText } from 'lucide-react';
import { getChallenge,getChallengeExamples,getChallengeStarter,getChallengeStatement,challengeLanguages,languageLabels } from '../data/challenges.js';
import { renderMarkdown } from '../lib/markdown.js';
import { useSaved } from '../hooks/useSaved.js';
import Splitter from '../components/ui/Splitter.jsx';
import CodePane from '../components/course/CodePane.jsx';

const draftKey=(id,lang)=>'designlab:challenge-code:'+id+':'+lang;
export default function ChallengeDetail({challengeId,onBack}) {
  const task=getChallenge(challengeId);
  const [language,setLanguage]=useSaved('designlab:challenge-language','python');
  const lang=challengeLanguages.includes(language)?language:'python';
  const [leftWidth,setLeftWidth]=useSaved('designlab:challenge-left-width',420);
  const work=useRef(null);
  if(!task)return <div className="main-content"><h1>Challenge not found</h1>
    <button className="btn" onClick={onBack}>Back to bank</button></div>;
  const starter=getChallengeStarter(challengeId,lang);
  const challengeTask={
    id:challengeId,title:task.title,language:lang,starter,kind:'Challenge',
    challenge:task.summary,points:task.points,console:'Run or Check executes published examples in your selected language.',
    storageKey:draftKey(challengeId,lang),challengeExamples:getChallengeExamples(challengeId),
    isChallenge:true,isPublished:false
  };
  const resizeCols=event=>{
    if(!work.current)return;
    const rect=work.current.getBoundingClientRect();
    setLeftWidth(Math.max(280,Math.min(rect.width-360,event.clientX-rect.left)));
  };
  return <div className="challenge-detail-page">
    <div className="challenge-breadcrumb">
      <button onClick={onBack}><ArrowLeft size={16}/> Challenge Bank</button><span>/</span><span>{task.title}</span>
    </div>
    <header className="challenge-detail-heading surface-card">
      <div className="eyebrow">Shared challenge · {task.difficulty} · {task.points} available points in the published contract</div>
      <h1>{task.title}</h1>
      <p>{task.summary}</p>
      <p>Run and Check execute student code using only published examples.
        No submissions, student records, official points or hidden grading are connected here.</p>
      <div className="challenge-prerequisites"><strong>Prerequisites:</strong>
        {task.prerequisites.map(value=><span key={value}>{value}</span>)}
      </div>
    </header>
    <div className="challenge-workspace" ref={work} style={{'--challenge-left':leftWidth+'px'}}>
      <section className="challenge-instructions">
        <div className="pane-header"><strong><BookOpenText size={16}/> Problem &amp; examples</strong>
          <span className="challenge-points">Practice only</span></div>
        <div className="markdown-preview challenge-markdown"
          dangerouslySetInnerHTML={{__html:renderMarkdown(getChallengeStatement(challengeId))}}/>
      </section>
      <Splitter axis="columns" onDrag={resizeCols}/>
      <section className="challenge-editor-panel">
        <div className="challenge-runtime-toolbar">
          <label className="challenge-language-selector">Language
            <select aria-label="Solution language" value={lang} onChange={event=>setLanguage(event.target.value)}>
              {challengeLanguages.map(x=><option key={x} value={x}>{languageLabels[x]}</option>)}
            </select>
          </label>
          <span>Live public-example checks</span>
        </div>
        <CodePane key={challengeId+':'+lang} lessonId={'challenge:'+challengeId+':'+lang}
          task={challengeTask}/>
      </section>
    </div>
  </div>;
}
