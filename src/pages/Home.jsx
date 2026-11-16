import { courses } from "../data/courses.js";
import CourseCard from "../components/home/CourseCard.jsx";
import TeacherShortcut from "../components/home/TeacherShortcut.jsx";
import { LibraryBig } from "lucide-react";

export default function Home({ openCourse, openTeacher, openChallenges, availableCourses = courses, completedLessons = [], readOnlyMode = false }) {
  return (
    <div className="main-content">
      <div className="welcome">
        <div className="eyebrow">Your learning spaces</div>
        <h1>Your playgrounds</h1>
        <p>
          Choose a course to continue learning. {readOnlyMode ? 'Review Computer Science I lessons and your existing verified results. Practice is local to this test build.' : 'Complete lessons to fill your progress bars.'}
        </p>
      </div>
      <div className="course-card-grid">
        {availableCourses.filter((c) => c.id !== 'tsi-math').map((c) => (
          <CourseCard key={c.id} course={c} completedLessons={completedLessons} onOpen={() => openCourse(c.id)} />
        ))}
      </div>
      {!readOnlyMode && <button type="button" className="wide-shortcut challenge-bank-shortcut" onClick={openChallenges}>
        <LibraryBig size={23}/><span><strong>Shared Challenge Bank</strong>
        <small>Practice one problem in Python, Java, JavaScript, or C#.</small></span>
        <span aria-hidden="true">→</span>
      </button>}
      {!readOnlyMode && <TeacherShortcut onClick={openTeacher} />}
    </div>
  );
}
