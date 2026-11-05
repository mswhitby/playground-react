import { useState } from 'react';
import { ChevronRight, Link2 } from 'lucide-react';
import { courses, getCourse } from '../data/courses.js';
import { playgroundPath } from '../lib/routes.js';
import CourseNavigation from '../components/course/CourseNavigation.jsx';
import LessonWorkspace from '../components/course/LessonWorkspace.jsx';

export default function CoursePage({ courseId, lessonId, openCourse }) {
  const course = getCourse(courseId) || courses[0];
  // The selected lesson is in the URL, so pasted links and browser history work.
  const selectedLesson = lessonId && course.lessons.includes(lessonId) ? lessonId : course.lessons[0];
  const [copyStatus, setCopyStatus] = useState('');

  async function copyCourseLink() {
    const url = new URL(playgroundPath(course), window.location.origin).href;
    try {
      await navigator.clipboard.writeText(url);
      setCopyStatus('Copied!');
    } catch {
      // If clipboard access is blocked, the URL still remains visible to copy.
      setCopyStatus('Copy the URL from your address bar');
    }
  }

  return (
    <div className="course-layout">
      <CourseNavigation
        course={course}
        selectedLesson={selectedLesson}
        setLesson={(id) => openCourse(course.id, id)}
      />
      <div className="course-main">
        <div className="course-breadcrumb">
          <button onClick={() => openCourse(null)}>All playgrounds</button>
          <ChevronRight size={14} />
          <span>{course.label}</span>
          <span className="course-link-spacer" />
          <button className="course-copy-link" type="button" onClick={copyCourseLink} title={playgroundPath(course)}>
            <Link2 size={14} /> {copyStatus || 'Copy playground link'}
          </button>
        </div>
        {/* A lesson-specific key preserves independent editor state per lesson. */}
        <LessonWorkspace key={selectedLesson} lessonId={selectedLesson} />
      </div>
    </div>
  );
}
