import { useRef, useState } from 'react';
import { getCourseLesson } from '../../lib/courseContent.js';
import { useSaved } from '../../hooks/useSaved.js';
import Splitter from '../ui/Splitter.jsx';
import LessonHeader from './LessonHeader.jsx';
import InstructionsPane from './InstructionsPane.jsx';
import CodePane from './CodePane.jsx';
import TsiPractice from './TsiPractice.jsx';

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
  if (!task?.ready) return <div className="lesson-screen">
    <LessonHeader task={task} unit={unit} unitNumber={unitNumber} isTsi={isTsi}
      isCompleted={isCompleted} assignment={assignment} grade={grade} onToggleCompleted={onToggleCompleted}/>
    <section className="lesson-content-pending surface-card">
      <h2>Lesson coming soon</h2>
      <p>The lesson materials are being prepared.</p>
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
        : <CodePane lessonId={lessonId} task={task}/>}
    </div>
  </div>;
}
