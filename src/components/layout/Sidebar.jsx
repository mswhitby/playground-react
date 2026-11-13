import { BookOpen, ChevronDown, CircleHelp, ClipboardPenLine, House, LayoutDashboard, LibraryBig, GraduationCap, ShieldCheck } from 'lucide-react';
import { courses, getCourse } from '../../data/courses.js';
import { lessonIdsOf, lessonTitleOf, unitNumberOf, unitTitleOf } from '../../lib/courseContent.js';
import { cn } from '../../lib/cn.js';
import { statusFor } from '../../lib/gradebook.js';

const MENU = [
  ['home', 'Home', House],
  ['challenges', 'Challenge Bank', LibraryBig],
  ['journals', 'Weekly journals', ClipboardPenLine],
  ['grades', 'Grades', GraduationCap],
  ['teacher', 'Teacher dashboard', LayoutDashboard],
  ['admin', 'Admin dashboard', ShieldCheck],
];

/** One shared sidebar: Explore → current course outline → all playgrounds. */
export default function Sidebar({ open, page, courseId, lessonId, setPage, openCourse, onOpenProject, availableCourses = courses, completedLessons = [], assignments = [], grades = [] }) {
  const course = page === 'course' ? availableCourses.find(item=>item.id===courseId) : null;
  return (
    <aside className={cn('main-sidebar', !open && 'collapsed')} aria-label="Playground navigation">
      <div className="side-title">EXPLORE</div>
      {MENU.map(([id, label, Icon]) => (
        <button key={id} className={cn('nav-item', (page === id || (id === 'challenges' && page === 'challenge')) && 'active')}
          onClick={() => setPage(id)} title={label}>
          <Icon size={19} /><span>{label}</span>
        </button>
      ))}

      {course && (
        <section className="course-outline" data-course={course.id} aria-label={`${course.label} outline`}>
          <div className="side-rule" />
          <div className="side-title">COURSE CONTENT</div>
          <button className={cn('outline-overview', !lessonId && 'active')} onClick={() => openCourse(course.id)}>
            <BookOpen size={16} /><span>Course overview</span>
          </button>
          {course.units.map((unit, index) => (
            <details key={`${course.id}-${unit.id}-${lessonId || 'overview'}`} className="outline-unit"
              open={lessonIdsOf(unit).includes(lessonId) || (!lessonId && index === 0) ? true : undefined}>
              <summary><span className="outline-unit-number">{String(unitNumberOf(unit,index + 1)).padStart(2, '0')}</span><span className="outline-unit-title" title={unitTitleOf(unit)}>{unitTitleOf(unit)}</span><ChevronDown size={14} /></summary>
              <div className="outline-lesson-list">
                {lessonIdsOf(unit).map(id => {
                  const title = lessonTitleOf(course,id);
                  const activity = statusFor('lesson:'+id,{assignments,grades,completedLessons});
                  const state = activity.completed ? 'completed' : activity.dueDate ? activity.state : '';
                  const statusText = state==='completed' ? 'Completed' : state==='overdue' ? 'Overdue' : state==='assigned' ? 'Assigned' : '';
                  return (
                    <button key={id} onClick={() => openCourse(course.id, id)}
                      className={cn('outline-lesson', id === lessonId && 'selected')}
                      aria-label={statusText ? `${title}, ${statusText.toLowerCase()}` : title}
                      title={statusText ? `${title} · ${statusText}` : title}
                      aria-current={id === lessonId ? 'page' : undefined}>
                      <span className="outline-lesson-name">{title}</span>
                      {statusText && <span className={`assignment-dot ${state}`} aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            </details>
          ))}
          {!!course.projects?.length && <>
            <div className="side-section-title">PROJECTS</div>
            {course.projects.map(project => <button type="button" key={project.id}
              className="outline-lesson" title={project.title} onClick={()=>onOpenProject?.(course.id,project.id)}>
              <span className="outline-lesson-name">{project.title}</span>
            </button>)}
          </>}
        </section>
      )}

      <div className="side-rule" />
      <div className="side-title">PLAYGROUNDS</div>
      {availableCourses.filter((c) => c.id !== 'tsi-math').map((c) => (
        <button key={c.id} data-course={c.id}
          className={cn('nav-item course-nav-item', page === 'course' && courseId === c.id && 'active')}
          onClick={() => openCourse(c.id)} title={c.label}>
          <span className="nav-dot" /><span>{c.label}</span>
        </button>
      ))}
      <div className="sidebar-bottom"><CircleHelp size={17}/><span>Your learning spaces</span></div>
    </aside>
  );
}
