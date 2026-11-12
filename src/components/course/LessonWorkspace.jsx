import { useRef, useState } from 'react';
import { getCourseLesson } from '../../lib/courseContent.js';
import { useSaved } from '../../hooks/useSaved.js';
import Splitter from '../ui/Splitter.jsx';
import LessonHeader from './LessonHeader.jsx';
import InstructionsPane from './InstructionsPane.jsx';
import CodePane from './CodePane.jsx';
import WebFilesPane from './WebFilesPane.jsx';
import TsiPractice from './TsiPractice.jsx';
import TsiDiagnostic from './TsiDiagnostic.jsx';
import { tsiQuestions } from '../../data/tsiQuestions.js';
import { renderMarkdown } from '../../lib/markdown.js';

/** Unit-aware lesson layout; TSIA2 uses questions rather than the coding editor. */
export default function LessonWorkspace({ lessonId, course, unit, unitNumber, isCompleted = false, assignment = null, grade = null, onToggleCompleted }) {
  const task = getCourseLesson(course,lessonId);
  const workspace = useRef(null);
  const [tsiAnswer, setTsiAnswer] = useState(null);
  const [leftWidth, setLeftWidth] = useSaved('designlab:left-width', 420);
  function resizeColumns(event) {
    if (!workspace.current) return;
    const rect = workspace.current.getBoundingClientRect();
    setLeftWidth(Math.max(260, Math.min(rect.width - 340, event.clientX - rect.left)));
  }
  const isTsi = course.id === 'tsi-math';
  if (isTsi && lessonId === 'tsi-20d-d01' && course.diagnosticItems?.length) {
    return <div className="lesson-screen">
      <header className="lesson-header"><div className="eyebrow">Day 1 · TSI Math Advisory</div>
        <h1>{task.title}</h1><p>Diagnostic placement · 30-minute advisory plan</p>
      </header>
      <TsiDiagnostic items={course.diagnosticItems} profiles={course.locatorProfiles}/>
    </div>;
  }
  if (!task?.ready) return <div className="lesson-screen">
    <LessonHeader task={task} unit={unit} unitNumber={unitNumber} isTsi={isTsi}
      isCompleted={isCompleted} assignment={assignment} grade={grade} onToggleCompleted={onToggleCompleted}/>
    <section className="lesson-content-pending surface-card">
      <h2>Lesson coming soon</h2>
      <p>This scheduled lesson has not been authored yet. No practice or scores are available.</p>
    </section>
  </div>;
  if (task.language === 'text' && !isTsi) return <div className="lesson-screen">
    <LessonHeader task={task} unit={unit} unitNumber={unitNumber} isTsi={false}
      isCompleted={isCompleted} assignment={assignment} grade={grade}
      onToggleCompleted={onToggleCompleted}/>
    <section className="surface-card published-reading">
      <p className="muted">Published written-practice material. Answer checking and verified scores remain on the current Playground.</p>
      <div className="markdown-preview" dangerouslySetInnerHTML={{__html:renderMarkdown(task.markdownSource)}}/>
    </section>
  </div>;
  // TSI currently publishes an outline plus four Markdown draft lessons.
  // The old fictional TSI multiple-choice IDs must not be substituted for those lessons.
  if (isTsi && !tsiQuestions[lessonId]) return <div className="lesson-screen">
    <LessonHeader task={task} unit={unit} unitNumber={unitNumber} isTsi isCompleted={isCompleted}
      assignment={assignment} grade={grade} onToggleCompleted={onToggleCompleted}/>
    <section className="surface-card published-reading">
      <p className="muted">Published draft lesson · practice shown for learning, not an official TSIA2 score predictor.</p>
      <div className="markdown-preview" dangerouslySetInnerHTML={{__html:renderMarkdown(task.markdownSource)}}/>
    </section>
  </div>;
  return <div className="lesson-screen">
    <LessonHeader task={task} unit={unit} unitNumber={unitNumber} isTsi={isTsi} isCompleted={isCompleted} assignment={assignment} grade={grade} onToggleCompleted={onToggleCompleted}/>
    <div className={`workspace-grid ${isTsi ? 'tsi-workspace' : ''}`} ref={workspace} style={{ '--left-pane': `${leftWidth}px` }}>
      {isTsi
        ? <TsiPractice lessonId={lessonId} onAnswerChecked={setTsiAnswer}/>
        : <InstructionsPane lessonId={lessonId} task={task}/>}
      <Splitter axis="columns" onDrag={resizeColumns}/>
      {isTsi
        ? <InstructionsPane lessonId={lessonId} task={task} isTsi tsiAnswer={tsiAnswer}/>
        : course.id==='mobile-app-dev' && ['html','css','javascript','jsx'].includes(task.language)
          ? <WebFilesPane key={lessonId} lessonId={lessonId} task={{...task,lessonFocus:lessonId}}/>
          : <CodePane lessonId={lessonId} task={task}/>}
    </div>
  </div>;
}
