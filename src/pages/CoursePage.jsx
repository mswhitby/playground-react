import { useState } from 'react';
import { ChevronRight, Link2 } from 'lucide-react';
import { courses, getCourse } from '../data/courses.js';
import { lessons } from '../data/lessons.js';
import { playgroundPath } from '../lib/routes.js';
import CourseLanding from './CourseLanding.jsx';
import LessonWorkspace from '../components/course/LessonWorkspace.jsx';

export default function CoursePage({ courseId, lessonId, openCourse, openChallenges }) {
  const course = getCourse(courseId) || courses[0];
  const [copyStatus, setCopyStatus] = useState('');
  const unitIndex = course.units.findIndex((unit) => unit.lessons.includes(lessonId));
  const currentUnit = course.units[unitIndex];
  const lessonIndex = course.lessons.indexOf(lessonId);

  async function copyCourseLink() {
    const url = new URL(playgroundPath(course, lessonId), window.location.origin).href;
    try { await navigator.clipboard.writeText(url); setCopyStatus('Copied!'); }
    catch { setCopyStatus('Copy the URL from your address bar'); }
  }

  return (
    <div className="course-layout integrated-course" style={{ '--course-color': course.color }}>
      <div className="course-main">
        <div className="course-breadcrumb">
          <button onClick={() => openCourse(null)}>All playgrounds</button><ChevronRight size={14}/>
          {lessonId ? <><button onClick={() => openCourse(course.id)}>{course.label}</button><ChevronRight size={14}/><span>{currentUnit?.title}</span></> : <span>{course.label}</span>}
          <span className="course-link-spacer" />
          <button className="course-copy-link" type="button" onClick={copyCourseLink} title={playgroundPath(course, lessonId)}>
            <Link2 size={14}/> {copyStatus || 'Copy link'}
          </button>
        </div>
        {lessonId ? (
          <>
            <div className="lesson-mobile-navigation">
              <label htmlFor="lesson-select">Lesson</label>
              <select id="lesson-select" value={lessonId} onChange={e => openCourse(course.id, e.target.value)}>
                {course.units.map((unit, i) => (
                  <optgroup key={unit.id} label={`Unit ${i + 1} · ${unit.title}`}>
                    {unit.lessons.map(id => <option key={id} value={id}>{lessons[id].title}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
            <LessonWorkspace key={lessonId} lessonId={lessonId} course={course} unit={currentUnit} unitNumber={unitIndex + 1}/>
            <nav className="lesson-next-bar" aria-label="Lesson sequence">
              <button className="btn" onClick={() => openCourse(course.id, lessonIndex > 0 ? course.lessons[lessonIndex - 1] : undefined)}>
                {lessonIndex > 0 ? `← ${lessons[course.lessons[lessonIndex - 1]].title}` : '← Course overview'}
              </button>
              {lessonIndex < course.lessons.length - 1 && <button className="btn primary" onClick={() => openCourse(course.id, course.lessons[lessonIndex + 1])}>
                Next: {lessons[course.lessons[lessonIndex + 1]].title} <ChevronRight size={16}/>
              </button>}
            </nav>
          </>
        ) : <CourseLanding course={course} openCourse={openCourse} openChallenges={openChallenges} />}
      </div>
    </div>
  );
}
