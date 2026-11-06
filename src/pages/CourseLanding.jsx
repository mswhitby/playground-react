import { useState } from 'react';
import { ArrowUpRight, BookOpen, ChevronRight, Layers3, LibraryBig, Settings2, X } from 'lucide-react';
import { courseLessonIds, getCourseLesson, lessonIdsOf, lessonTitleOf, unitNumberOf, unitTitleOf } from '../lib/courseContent.js';
import { courseProgress } from '../lib/completion.js';
import { selectedCourseColor } from '../lib/courseColors.js';
import { statusFor,dueLabel } from '../lib/gradebook.js';
import { challengesPath, playgroundPath } from '../lib/routes.js';

export default function CourseLanding({ course, openCourse, openChallenges, completedLessons = [], assignments = [], grades = [], courseColors = {}, onSetCourseColor, onResetCourseColor }) {
  const progress = courseProgress(course, completedLessons);
  const [editingColor, setEditingColor] = useState(false);
  const color = selectedCourseColor(course, courseColors);
  return (
    <div className="course-landing">
      <header className="course-hero surface-card">
        <button type="button" className="icon-button course-color-settings"
          onClick={() => setEditingColor(value => !value)}
          aria-label={editingColor ? 'Close course color settings' : `Change ${course.label} color`}
          title={editingColor ? 'Close settings' : 'Course color'}
          aria-expanded={editingColor} aria-controls="course-color-controls">
          {editingColor ? <X size={17}/> : <Settings2 size={17}/>}
        </button>
        <div className="eyebrow">Course overview</div>
        <h1>{course.label}</h1>
        <p>{course.description}</p>
        <div className="course-hero-stats">
          <span><Layers3 size={16} /> {course.units.length} units</span>
          <span><BookOpen size={16} /> {courseLessonIds(course).length} lessons</span>
        </div>
        <button className="btn primary" onClick={() => openCourse(course.id, courseLessonIds(course)[0])}>
          Start learning <ChevronRight size={16} />
        </button>
        {editingColor && <section id="course-color-controls" className="course-color-controls" aria-label="Choose a course color">
          <div className="course-color-control-copy">
            <strong>Course color</strong>
            <p>Make this course your own. The color updates throughout your Playground.</p>
          </div>
          <label className="course-color-picker">
            <input type="color" value={color} onChange={event => onSetCourseColor?.(course.id, event.target.value)}
              aria-label={`Choose a color for ${course.label}`}/>
            <span>Choose color</span>
          </label>
          <button type="button" className="btn" onClick={() => onResetCourseColor?.(course.id)}>Reset to default</button>
          <button type="button" className="btn" onClick={() => setEditingColor(false)}>Done</button>
        </section>}
      </header>
      {course.publishedContent && <p className="course-published-note">
        Explore the complete Computer Science I lessons. Practice here won't change your grades.
      </p>}
      <p className="course-landing-progress">{progress.completed} of {progress.total} lessons {course.publishedContent ? 'marked complete in preview' : 'completed'} · {progress.percent}%</p>
      <div className="course-landing-heading">
        <div><h2>Units &amp; lessons</h2><p>Choose a unit or jump directly into a lesson.</p></div>

      </div>
      <div className="unit-card-grid">
        {course.units.map((unit, index) => (
          <section className="unit-card surface-card" key={unit.id}>
            <header className="unit-card-header">
              <span className="unit-badge">UNIT {String(unitNumberOf(unit,index+1)).padStart(2,'0')}</span>
              <h3 title={unitTitleOf(unit)}>{unitTitleOf(unit)}</h3>
              {unit.description && <p>{unit.description}</p>}
            </header>
            <div className="unit-lessons">
              {lessonIdsOf(unit).map((id, i) => (
                <a key={id} className="unit-lesson-link" href={playgroundPath(course, id)} onClick={event => {
                  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                  event.preventDefault(); openCourse(course.id, id);
                }}>
                  <span className="unit-lesson-index">{i + 1}</span>
                  <span className="unit-lesson-label"><strong title={lessonTitleOf(course,id)}>{lessonTitleOf(course,id)}</strong>
                    {(() => { const a=statusFor('lesson:'+id,{assignments,grades,completedLessons});
                      return (a.dueDate || a.completed) ? <span className="unit-assignment-meta">
                        <span className={`assignment-status ${a.state}`}>{a.completed?'Completed':a.state==='overdue'?'Overdue':'Assigned'}</span>
                        {a.dueDate && <small>Due {dueLabel(a.dueDate)}</small>}
                        {a.grade&&<small>{a.grade.earned} / {a.grade.possible} pts</small>}
                      </span> : <small>{getCourseLesson(course,id)?.kind}{getCourseLesson(course,id)?.difficulty ? ` · ${getCourseLesson(course,id).difficulty}` : ''}</small>;
                    })()}
                  </span>
                  <ArrowUpRight size={16}/>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
      <section className="course-challenges-shelf surface-card">
        <div><div className="eyebrow">Shared practice library</div><h2>Related programming challenges</h2><p>Browse reusable problems suited to this course. Review each challenge's prerequisites before recommending it to students.</p></div>
        <a href={challengesPath(course.id)} className="btn" onClick={event => { if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); openChallenges(course.id); }}><LibraryBig size={16}/> Browse challenges</a>
      </section>
    </div>
  );
}
