import { BookOpen } from "lucide-react";
import { playgroundPath } from "../../lib/routes.js";

export default function CourseCard({ course, onOpen }) {
  const count = course.lessons.length;
  return (
    <article className="course-card">
      <div className="course-card-heading">
        <span className="course-glyph" style={{ background: course.color }}>
          {course.glyph}
        </span>
        <div>
          <h2>{course.label}</h2>
          <p>{course.short}</p>
        </div>
      </div>
      <p className="course-description">{course.description}</p>
      <div className="course-meta">
        <span>
          {count} preview {count === 1 ? "lesson" : "lessons"}
        </span>
        <span>Markdown</span>
      </div>
      <a
        className="btn primary"
        href={playgroundPath(course)}
        onClick={(event) => {
          // Keep normal link behaviors: open in a new tab, copy address, etc.
          if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          onOpen();
        }}
      >
        <BookOpen size={16} /> Open preview
      </a>
    </article>
  );
}
