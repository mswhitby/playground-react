import { ArrowUpRight, BookOpen, Calculator, Code2, Gamepad2, Rocket, Smartphone, Trophy } from "lucide-react";
import { playgroundPath } from "../../lib/routes.js";

const COURSE_ICONS = {
  "computer-science-1": Code2,
  "game-programming": Gamepad2,
  "mobile-app-dev": Smartphone,
  uil: Trophy,
  "tsi-math": Calculator,
  capstone: Rocket,
};

export default function CourseCard({ course, onOpen }) {
  const count = course.lessons.length;
  const CourseIcon = COURSE_ICONS[course.id] || Code2;
  return (
    <article className="course-card" style={{ "--course-color": course.color }}>
      <div className="course-card-heading">
        <span className="course-glyph" aria-hidden="true">
          <CourseIcon size={24} strokeWidth={2.2} />
        </span>
        <div>
          <h2>{course.label}</h2>
          <p>{course.short}</p>
        </div>
      </div>
      <p className="course-description">{course.description}</p>
      <div className="course-meta">
        <span>{count} sample {count === 1 ? "lesson" : "lessons"}</span>
        <span>Markdown</span>
      </div>
      <div className="course-card-footer">
        <span className="course-color-bar" aria-hidden="true" />
        <a
          className="course-open-link"
          href={playgroundPath(course)}
          onClick={(event) => {
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            onOpen();
          }}
        >
          <BookOpen size={15} /> View course <ArrowUpRight size={15} />
        </a>
      </div>
    </article>
  );
}
