import { courses } from "../data/courses.js";
import CourseCard from "../components/home/CourseCard.jsx";
import TeacherShortcut from "../components/home/TeacherShortcut.jsx";
import { LibraryBig } from "lucide-react";

export default function Home({ openCourse, openTeacher, openChallenges }) {
  return (
    <div className="main-content">
      <div className="welcome">
        <div className="eyebrow">Local React design lab</div>
        <h1>Your playgrounds</h1>
        <p>
          These previews use fictional records and editable local Markdown. Changes here do not affect the
          live website.
        </p>
      </div>
      <div className="course-card-grid">
        {courses.map((c) => (
          <CourseCard key={c.id} course={c} onOpen={() => openCourse(c.id)} />
        ))}
      </div>
      <button type="button" className="wide-shortcut challenge-bank-shortcut" onClick={openChallenges}>
        <LibraryBig size={23}/><span><strong>Shared Challenge Bank</strong>
        <small>Practice one problem in Python, Java, JavaScript, or C#.</small></span>
        <span aria-hidden="true">→</span>
      </button>
      <TeacherShortcut onClick={openTeacher} />
    </div>
  );
}
