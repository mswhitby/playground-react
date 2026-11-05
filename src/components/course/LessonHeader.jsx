import SectionTitle from '../ui/SectionTitle.jsx';

export default function LessonHeader({ task, unit, unitNumber, isTsi }) {
  return <div className="lesson-header">
    <div className="eyebrow">Unit {unitNumber} · {unit.title} <span className="dot">·</span> {task.kind}</div>
    <SectionTitle actions={<div className="points-tag">{isTsi ? 'Sample practice' : `${task.points} possible demo points`}</div>}>
      {task.title}
    </SectionTitle>
    <p>{task.challenge}</p>
  </div>;
}
