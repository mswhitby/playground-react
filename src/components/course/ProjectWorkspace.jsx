import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSaved } from '../../hooks/useSaved.js';
import { renderMarkdown } from '../../lib/markdown.js';
import Splitter from '../ui/Splitter.jsx';
import WebFilesPane from './WebFilesPane.jsx';

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
    starter:project.starter||'',starterFiles:project.starterFiles||null,challenge:project.summary||'',console:'Run to see your actual page. Check tests the published step requirements in a sandboxed browser preview.',
    projectDraft:true,isPublished:false,projectId:project.id,stepId:current.id,focus:current.focus,
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
      <p className="muted">Run renders your actual project and Check tests the current step. Drafts save in this browser; Submit and verified grading remain disabled.</p>
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
        <p className="web-files-reading-note">This published walkthrough was originally written for one HTML file.
          When it says to add a &lt;style&gt; or &lt;script&gt; block, put that code in
          <code>styles.css</code> or <code>script.js</code> instead. Keep the file links in
          <code>index.html</code>; Run connects them automatically.</p>
        <div className="markdown-preview" dangerouslySetInnerHTML={{__html:renderMarkdown(current.markdownSource)}}/>
      </section>
      <Splitter axis="columns" onDrag={resizeColumns}/>
      <WebFilesPane lessonId={draftId} task={task}/>
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
