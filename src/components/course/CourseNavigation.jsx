import { lessons } from "../../data/lessons.js";
import { cn } from "../../lib/cn.js";
import Chip from "../ui/Chip.jsx";

/** Left column on the course page: lesson list and topic chips. */
export default function CourseNavigation({ course, selectedLesson, setLesson }) {
  return (
    <div className="course-navigation">
      <div className="eyebrow">Course content</div>
      <h3>{course.label}</h3>
      <p className="muted">
        Choose a lesson to read, explore, and try.
      </p>

      <div className="side-section-title">Lessons</div>
      {course.lessons.map((id, i) => (
        <button
          key={id}
          className={cn("lesson-item", selectedLesson === id && "selected")}
          onClick={() => setLesson(id)}
        >
          <span className="lesson-index">{String(i + 1).padStart(2, "0")}</span>
          <span>
            {lessons[id].title}
            <small>
              {lessons[id].kind} · {lessons[id].difficulty}
            </small>
          </span>
        </button>
      ))}

      <div className="side-section-title">Topics</div>
      <div className="topic-chips">
        {course.topics.map((t) => (
          <Chip key={t}>{t}</Chip>
        ))}
      </div>
    </div>
  );
}
