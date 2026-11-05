import { BookOpen, ChevronDown, CircleHelp, ClipboardPenLine, House, LayoutDashboard, LibraryBig } from 'lucide-react';
import { courses, getCourse } from '../../data/courses.js';
import { lessons } from '../../data/lessons.js';
import { cn } from '../../lib/cn.js';

const MENU = [
  ['home', 'Home', House],
  ['challenges', 'Challenge Bank', LibraryBig],
  ['journals', 'Weekly journals', ClipboardPenLine],
  ['teacher', 'Teacher dashboard', LayoutDashboard],
];

/** One shared sidebar: Explore → current course outline → all playgrounds. */
export default function Sidebar({ open, page, courseId, lessonId, setPage, openCourse }) {
  const course = page === 'course' ? getCourse(courseId) : null;
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
        <section className="course-outline" style={{ '--course-color': course.color }} aria-label={`${course.label} outline`}>
          <div className="side-rule" />
          <div className="side-title">COURSE CONTENT</div>
          <button className={cn('outline-overview', !lessonId && 'active')} onClick={() => openCourse(course.id)}>
            <BookOpen size={16} /><span>Course overview</span>
          </button>
          {course.units.map((unit, index) => (
            <details key={`${course.id}-${unit.id}-${lessonId || 'overview'}`} className="outline-unit"
              open={unit.lessons.includes(lessonId) || (!lessonId && index === 0) ? true : undefined}>
              <summary><span className="outline-unit-number">{String(index + 1).padStart(2, '0')}</span><span>{unit.title}</span><ChevronDown size={14} /></summary>
              <div className="outline-lesson-list">
                {unit.lessons.map((id) => (
                  <button key={id} onClick={() => openCourse(course.id, id)} title={lessons[id].title}
                    className={cn('outline-lesson', id === lessonId && 'selected')} aria-current={id === lessonId ? 'page' : undefined}>
                    <span>{lessons[id].title}</span>
                  </button>
                ))}
              </div>
            </details>
          ))}
        </section>
      )}

      <div className="side-rule" />
      <div className="side-title">PLAYGROUNDS</div>
      {courses.map((c) => (
        <button key={c.id}
          className={cn('nav-item course-nav-item', page === 'course' && courseId === c.id && 'active')}
          onClick={() => openCourse(c.id)} title={c.label}>
          <span className="nav-dot" style={{ background: c.color }} /><span>{c.label}</span>
        </button>
      ))}
      <div className="sidebar-bottom"><CircleHelp size={17}/><span>Frontend-only preview</span></div>
    </aside>
  );
}
