import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSaved } from '../../hooks/useSaved.js';
import { renderMarkdown } from '../../lib/markdown.js';
import Splitter from '../ui/Splitter.jsx';
import CodePane from './CodePane.jsx';

/**
 * Student-facing project steps from the existing Mobile App & Web manifest.
 * All steps in a project share ONE browser-only draft, as the old Playground does.
 * Real submissions/grades and production editor runtimes are not connected here.
 */
export default function ProjectWorkspace({course, project, stepId, openProject}) {
  const steps=project.steps || [];
  const stepIndex=Math.max(0,steps.findIndex(item=>item.id===stepId));
  const current=steps[stepIndex];
  const layout=useRef(null);
  const [leftWidth,setLeftWidth]=useSaved('designlab:project-left-width',430);
  const draftId='project:'+course.id+':'+project.id;
  const task={
    id:draftId,title:project.title,language:project.language||'html',
    starter:project.starter||'',challenge:project.summary||'',console:'Try editing the project. Run and Check are preview-only until the real runtime is connected.',
    projectDraft:true,isPublished:false,
  };
  function resizeColumns(event) {
    if (!layout.current) return;
    const rect=layout.current.getBoundingClientRect();
    setLeftWidth(Math.max(260,Math.min(rect.width-340,event.clientX-rect.left)));
  }
  return <div className="lesson-screen project-workspace">
    <header className="lesson-header">
      <div className="eyebrow">Published guided project · {steps.length} steps</div>
      <h1>{project.title}</h1>
      <p>{project.summary}</p>
      <p className="muted">The walkthrough is published course content. Code edits are saved only in this browser; Run, Check and Submit are not connected to production grading.</p>
    </header>
    <nav className="project-step-list" aria-label="Project steps">
      {steps.map((step,i)=><button type="button" key={step.id} aria-current={i===stepIndex?'step':undefined}
        className={i===stepIndex?'btn primary':'btn'} onClick={()=>openProject(course.id,project.id,step.id)}>
        {i+1}. {step.title}
      </button>)}
    </nav>
    <div className="workspace-grid" ref={layout} style={{'--left-pane':leftWidth+'px'}}>
      <section className="instructions-pane project-reading">
        <div className="pane-header"><strong>Step {stepIndex+1}: {current.title}</strong></div>
        <div className="markdown-preview" dangerouslySetInnerHTML={{__html:renderMarkdown(current.markdownSource)}}/>
      </section>
      <Splitter axis="columns" onDrag={resizeColumns}/>
      <CodePane lessonId={draftId} task={task}/>
    </div>
    <nav className="lesson-next-bar" aria-label="Project step navigation">
      {stepIndex>0 && <button type="button" className="lesson-nav-link previous"
        onClick={()=>openProject(course.id,project.id,steps[stepIndex-1].id)}>
        <ChevronLeft size={16}/> <span>Prev: {steps[stepIndex-1].title}</span>
      </button>}
      {stepIndex<steps.length-1 && <button type="button" className="lesson-nav-link next"
        onClick={()=>openProject(course.id,project.id,steps[stepIndex+1].id)}>
        <span>Next: {steps[stepIndex+1].title}</span> <ChevronRight size={16}/>
      </button>}
    </nav>
  </div>;
}
