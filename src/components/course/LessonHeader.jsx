import SectionTitle from "../ui/SectionTitle.jsx";

export default function LessonHeader({ task }) {
  return (
    <div className="lesson-header">
      <div className="eyebrow">
        {task.kind} <span className="dot">·</span> {task.difficulty}
      </div>
      <SectionTitle actions={<div className="points-tag">{task.points} possible points</div>}>
        {task.title}
      </SectionTitle>
      <p>{task.challenge}</p>
    </div>
  );
}
