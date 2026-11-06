import { Calculator, Code2, Gamepad2, Rocket, Smartphone, Trophy } from 'lucide-react';
import { playgroundPath } from '../../lib/routes.js';
import { courseProgress } from '../../lib/completion.js';

const COURSE_ICONS = {
  'computer-science-1': Code2,
  'game-programming': Gamepad2,
  'mobile-app-dev': Smartphone,
  uil: Trophy,
  'tsi-math': Calculator,
  capstone: Rocket,
};

/** A single link makes the whole card work with mouse, keyboard, and new tabs. */
export default function CourseCard({ course, onOpen, completedLessons = [] }) {
  const { completed, total } = courseProgress(course, completedLessons);
  const CourseIcon = COURSE_ICONS[course.id] || Code2;
  function followLink(event) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onOpen();
  }

  return (
    <a className="course-card" data-course={course.id} href={playgroundPath(course)} onClick={followLink}>
      <div className="course-card-heading">
        <span className="course-glyph" aria-hidden="true"><CourseIcon size={24} strokeWidth={2.2} /></span>
        <div><h2>{course.label}</h2><p>{course.short}</p></div>
      </div>
      <p className="course-description">{course.description}</p>
      <div className="course-card-footer">
        <div className="course-meta"><span>{total} {total === 1 ? 'lesson' : 'lessons'}</span><span>{completed} completed</span></div>
        <progress className="course-progress-track" value={completed} max={Math.max(total, 1)}
          aria-label={`${course.label}: ${completed} of ${total} lessons completed`} />
      </div>
    </a>
  );
}
