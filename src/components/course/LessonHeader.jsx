import { CircleCheck, Circle } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle.jsx';
import { dueLabel, statusFor } from '../../lib/gradebook.js';

export default function LessonHeader({ task, unit, unitNumber, isTsi, isCompleted = false, assignment = null, grade = null, onToggleCompleted }) {
  const state=statusFor('lesson:'+assignment?.id?.replace(/^lesson:/,''),{assignments:assignment?[assignment]:[],grades:grade?[grade]:[],completedLessons:isCompleted?[assignment?.id?.replace(/^lesson:/,'')]:[]});
  return <div className="lesson-header">
    <div className="eyebrow">Unit {unitNumber} · {unit.title} <span className="dot">·</span> {task.kind}</div>
    <SectionTitle actions={<div className="lesson-heading-actions">
      {!isTsi && <span className="points-tag">{grade ? `${grade.earned} / ${grade.possible} pts` : `${task.points} points available`}</span>}
      <button type="button" className={`btn completion-toggle ${isCompleted ? 'completed' : ''}`}
        aria-pressed={isCompleted} onClick={onToggleCompleted}>
        {isCompleted ? <CircleCheck size={16}/> : <Circle size={16}/>}
        {isCompleted ? 'Completed' : 'Mark complete'}
      </button>
    </div>}>
      {task.title}
    </SectionTitle>
    <p>{task.challenge}</p>
    {assignment?.dueDate && <div className="lesson-assignment-info"><span className={`assignment-status ${state.state}`}>{state.state==='completed'?'Completed':state.state==='overdue'?'Overdue':'Assigned'}</span><span>Due {dueLabel(assignment.dueDate)}</span></div>}
  </div>;
}
