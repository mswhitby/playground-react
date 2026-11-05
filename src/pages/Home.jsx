import { courses } from "../data/courses.js";
import CourseCard from "../components/home/CourseCard.jsx";
import TeacherShortcut from "../components/home/TeacherShortcut.jsx";

export default function Home({ openCourse, openTeacher }) {
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
      <TeacherShortcut onClick={openTeacher} />
    </div>
  );
}
