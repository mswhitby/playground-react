import { ChevronLeft, ChevronRight } from 'lucide-react';
import { courses, getCourse } from '../data/courses.js';
import { courseLessonIds, lessonIdsOf, lessonTitleOf, unitTitleOf } from '../lib/courseContent.js';
import CourseLanding from './CourseLanding.jsx';
import TestPrepCourse from './TestPrepCourse.jsx';
import LessonWorkspace from '../components/course/LessonWorkspace.jsx';
import ProjectWorkspace from '../components/course/ProjectWorkspace.jsx';

export default function CoursePage({ courseId, lessonId, projectId, projectStepId, availableCourses = courses, openCourse, openProject, openChallenges, completedLessons = [], assignments = [], grades = [], onToggleLessonComplete, courseColors = {}, onSetCourseColor, onResetCourseColor }) {
  const course = availableCourses.find(item=>item.id===courseId) || availableCourses[0];
  if (course.id === 'test-prep') return <TestPrepCourse lessonId={lessonId} openCourse={openCourse} completedLessons={completedLessons} onToggleLessonComplete={onToggleLessonComplete}/>;
  const project = (course.projects||[]).find(item=>item.id===projectId);
  const sequence = courseLessonIds(course);
  const unitIndex = course.units.findIndex(unit => lessonIdsOf(unit).includes(lessonId));
  const currentUnit = course.units[unitIndex];
  const lessonIndex = sequence.indexOf(lessonId);

  return (
    <div className="course-layout integrated-course" data-course={course.id}>
      <div className="course-main">
        <div className="course-breadcrumb">
          <button onClick={() => openCourse(null)}>All playgrounds</button><ChevronRight size={14}/>
          {(lessonId || project) ? <><button onClick={() => openCourse(course.id)}>{course.label}</button><ChevronRight size={14}/><span className="breadcrumb-unit-name" title={currentUnit ? unitTitleOf(currentUnit) : ''}>{currentUnit ? unitTitleOf(currentUnit) : project?.title || ''}</span></> : <span>{course.label}</span>}
        </div>
        {project ? <ProjectWorkspace key={project.id} course={course} project={project}
            stepId={projectStepId} openProject={openProject}/> : lessonId ? (
          <>
            <div className="lesson-mobile-navigation">
              <label htmlFor="lesson-select">Lesson</label>
              <select id="lesson-select" value={lessonId} onChange={e => openCourse(course.id, e.target.value)}>
                {course.units.map((unit, i) => (
                  <optgroup key={unit.id} label={`Unit ${i + 1} · ${unitTitleOf(unit)}`}>
                    {lessonIdsOf(unit).map(id => <option key={id} value={id}>{lessonTitleOf(course,id)}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
            <LessonWorkspace key={lessonId} lessonId={lessonId} course={course} unit={currentUnit} unitNumber={unitIndex + 1} isCompleted={completedLessons.includes(lessonId)} assignment={assignments.find(a=>a.id==='lesson:'+lessonId)} grade={grades.find(g=>g.id==='lesson:'+lessonId)} onToggleCompleted={() => onToggleLessonComplete?.(lessonId)}/>
            <nav className="lesson-next-bar" aria-label="Lesson sequence">
              {lessonIndex > 0 && <button type="button" className="lesson-nav-link previous"
                onClick={() => openCourse(course.id, sequence[lessonIndex - 1])}>
                <ChevronLeft size={16} aria-hidden="true"/>
                <span>Prev: {lessonTitleOf(course, sequence[lessonIndex - 1])}</span>
              </button>}
              {lessonIndex >= 0 && lessonIndex < sequence.length - 1 && <button type="button" className="lesson-nav-link next"
                onClick={() => openCourse(course.id, sequence[lessonIndex + 1])}>
                <span>Next: {lessonTitleOf(course, sequence[lessonIndex + 1])}</span>
                <ChevronRight size={16} aria-hidden="true"/>
              </button>}
            </nav>
          </>
        ) : <CourseLanding course={course} openCourse={openCourse} openProject={openProject} openChallenges={openChallenges} completedLessons={completedLessons} assignments={assignments} grades={grades} courseColors={courseColors} onSetCourseColor={onSetCourseColor} onResetCourseColor={onResetCourseColor} />}
      </div>
    </div>
  );
}
