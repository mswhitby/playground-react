import { CircleCheck, Circle } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle.jsx';

export default function LessonHeader({ task, unit, unitNumber, isTsi, isCompleted = false, onToggleCompleted }) {
  return <div className="lesson-header">
    <div className="eyebrow">Unit {unitNumber} · {unit.title} <span className="dot">·</span> {task.kind}</div>
    <SectionTitle actions={<div className="lesson-heading-actions">
      {!isTsi && <span className="points-tag">{task.points} points</span>}
      <button type="button" className={`btn completion-toggle ${isCompleted ? 'completed' : ''}`}
        aria-pressed={isCompleted} onClick={onToggleCompleted}>
        {isCompleted ? <CircleCheck size={16}/> : <Circle size={16}/>}
        {isCompleted ? 'Completed' : 'Mark complete'}
      </button>
    </div>}>
      {task.title}
    </SectionTitle>
    <p>{task.challenge}</p>
  </div>;
}
