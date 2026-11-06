import { useEffect, useMemo, useState } from 'react';
import { FileText } from 'lucide-react';
import { tsiQuestions } from '../../data/tsiQuestions.js';
import { cn } from '../../lib/cn.js';
import { localMarkdown, renderMarkdown, splitLesson, guidedSteps } from '../../lib/markdown.js';
import { publishedSolveSupplement, resolvePublishedLinks } from '../../lib/publishedLessons.js';
import { readString, removeKey, storageKeys, writeString } from '../../lib/storage.js';

/** Solve first; Learn provides full explanations and optional step-by-step pages. */
export default function InstructionsPane({ lessonId, task, isTsi = false, tsiAnswer = null }) {
  const sourceMarkdown = task?.markdownSource || localMarkdown(lessonId);
  const draftKey = storageKeys.markdown(lessonId);
  const [doc, setDoc] = useState(sourceMarkdown);
  const [tab, setTab] = useState(isTsi ? 'learn' : 'solve');
  const [step, setStep] = useState(0);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setDoc(readString(draftKey) ?? sourceMarkdown);
    setTab(isTsi ? 'learn' : 'solve');
    setStep(0);
    setEditing(false);
  }, [draftKey,sourceMarkdown,isTsi]);

  const parts = useMemo(() => {
    const split = splitLesson(doc, task);
    const solve = split.solve + publishedSolveSupplement(task, split.solve);
    return {
      solve: resolvePublishedLinks(solve, task?.markdown),
      learn: resolvePublishedLinks(split.learn, task?.markdown),
    };
  }, [doc, task]);
  const guide = useMemo(() => guidedSteps(parts.learn), [parts.learn]);
  const isGuide = !isTsi && tab === 'learn' && guide.steps.length>0;
  const page = Math.min(step,Math.max(0,guide.steps.length-1));
  const markdown = isTsi ? parts.learn : tab === 'solve' ? parts.solve
    : isGuide ? guide.intro+'\n\n'+guide.steps[page] : parts.learn;
  const html = useMemo(() => renderMarkdown(markdown), [markdown]);

  return (
    <section className="instructions-pane">
      <div className="pane-header">
        {isTsi ? <strong className="tsi-learn-title">Learn</strong> : (
          <div className="tabs compact" role="tablist" aria-label="Lesson views">
            <button role="tab" aria-selected={tab==='solve'} className={tab==='solve'?'active':''}
              onClick={() => {setTab('solve');setStep(0);}}>Solve</button>
            <button role="tab" aria-selected={tab==='learn'} className={tab==='learn'?'active':''}
              onClick={() => {setTab('learn');setStep(0);}}>Learn</button>
          </div>
        )}
        <button type="button" className={cn('icon-button',editing&&'active')}
          title="Edit lesson text" aria-label="Edit lesson text" onClick={() => setEditing(!editing)}>
          <FileText size={16}/>
        </button>
      </div>
      {editing ? (
        <div className="markdown-source">
          <p className="hint">Try editing these instructions. Changes here are just for your preview.</p>
          <textarea aria-label="Markdown source" value={doc}
            onChange={event=>{setDoc(event.target.value);setStep(0);writeString(draftKey,event.target.value);}}/>
          <button type="button" className="btn" onClick={()=>{
            removeKey(draftKey);setDoc(sourceMarkdown);setStep(0);
          }}>Reset lesson text</button>
        </div>
      ) : <>
        <div className="markdown-preview" role="tabpanel">
          <div dangerouslySetInnerHTML={{__html:html}}/>
          {isTsi && tsiAnswer && <section className="tsi-worked-solution" role="status">
            <h3>{tsiAnswer.correct?'Why that works':'Review the solution'}</h3>
            <p>{tsiQuestions[lessonId]?.explanation}</p>
          </section>}
        </div>
        {isGuide && <nav className="lesson-step-controls" aria-label="Learning steps">
          <button type="button" className="step-link" disabled={page===0} onClick={()=>setStep(v=>Math.max(0,v-1))}>Previous</button>
          <span>Step {page+1} of {guide.steps.length}</span>
          <button type="button" className="step-link" disabled={page===guide.steps.length-1}
            onClick={()=>setStep(v=>Math.min(guide.steps.length-1,v+1))}>Next</button>
        </nav>}
      </>}
    </section>
  );
}
