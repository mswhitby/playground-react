import { ArrowUpRight, BookOpen, ChevronRight, Layers3, LibraryBig } from 'lucide-react';
import { lessons } from '../data/lessons.js';
import { courseProgress } from '../lib/completion.js';
import { challengesPath, playgroundPath } from '../lib/routes.js';

export default function CourseLanding({ course, openCourse, openChallenges, completedLessons = [] }) {
  const progress = courseProgress(course, completedLessons);
  return (
    <div className="course-landing">
      <header className="course-hero surface-card">
        <div className="eyebrow">Course overview</div>
        <h1>{course.label}</h1>
        <p>{course.description}</p>
        <div className="course-hero-stats">
          <span><Layers3 size={16} /> {course.units.length} units</span>
          <span><BookOpen size={16} /> {course.lessons.length} lessons</span>
        </div>
        <button className="btn primary" onClick={() => openCourse(course.id, course.lessons[0])}>
          Start learning <ChevronRight size={16} />
        </button>
      </header>
      <p className="course-landing-progress">{progress.completed} of {progress.total} lessons completed · {progress.percent}%</p>
      <div className="course-landing-heading">
        <div><h2>Units &amp; lessons</h2><p>Choose a unit or jump directly into a lesson.</p></div>

      </div>
      <div className="unit-card-grid">
        {course.units.map((unit, index) => (
          <section className="unit-card surface-card" key={unit.id}>
            <header className="unit-card-header">
              <span className="unit-badge">UNIT {String(index + 1).padStart(2, '0')}</span>
              <h3>{unit.title}</h3>
              <p>{unit.description}</p>
            </header>
            <div className="unit-lessons">
              {unit.lessons.map((id, i) => (
                <a key={id} className="unit-lesson-link" href={playgroundPath(course, id)} onClick={event => {
                  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                  event.preventDefault(); openCourse(course.id, id);
                }}>
                  <span className="unit-lesson-index">{i + 1}</span>
                  <span className="unit-lesson-label"><strong>{lessons[id].title}</strong><small>{lessons[id].kind} · {lessons[id].difficulty}</small></span>
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
