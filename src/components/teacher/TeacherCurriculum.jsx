import { useEffect, useMemo, useState } from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';
import { getCourse } from '../../data/courses.js';
import { getCourseLesson, lessonIdsOf, lessonTitleOf, normalizeImportedOutline, unitNumberOf, unitTitleOf } from '../../lib/courseContent.js';
import { playgroundPath } from '../../lib/routes.js';

const sourceUrl = '/playground/data/computer-science-1/course.json';
const previewCourse = getCourse('computer-science-1');

/** Public curriculum data may be read without opening private student or grade APIs. */
export default function TeacherCurriculum() {
  const [live, setLive] = useState(null);
  const [loadStatus, setLoadStatus] = useState('loading');
  const [selected, setSelected] = useState(previewCourse.lessons[0]);
  useEffect(() => {
    const abort = new AbortController();
    fetch(sourceUrl, {signal: abort.signal, cache:'no-store'})
      .then(result => {
        if (!result.ok) throw new Error('Curriculum unavailable');
        return result.json();
      })
      .then(result => {
        if (!Array.isArray(result.lessons) || !result.lessons.length) throw new Error('Unexpected curriculum response');
        setLive(normalizeImportedOutline(result));
        setLoadStatus('live');
      })
      .catch(error => { if (error.name !== 'AbortError') setLoadStatus('snapshot'); });
    return () => abort.abort();
  }, []);
  const course = useMemo(() => live ? {...previewCourse, ...live} : previewCourse, [live]);
  const ids = course.lessons;
  const chosenId = ids.includes(selected) ? selected : ids[0];
  const row = getCourseLesson(course, chosenId);
  const scoreTotal = ids.reduce((total, id) => total + (getCourseLesson(course,id)?.points||0),0);
  const isInPreview = previewCourse.lessons.includes(chosenId);
  return <section className="panel curriculum-panel" aria-label="Published curriculum">
    <div className="section-heading">
      <div>
        <h2><BookOpen size={18}/> Computer Science I curriculum</h2>
        <p>{course.units.length} original units · {ids.length} lessons · {scoreTotal} available lesson points</p>
      </div>
      <span className="curriculum-source" role="status">
        {loadStatus === 'live' ? 'Published course • current' : loadStatus === 'loading' ? 'Checking published course…' : 'Bundled preview snapshot'}
      </span>
    </div>
    <p className="curriculum-explanation">This reads the public course catalog used by the live Playground. All names, points, and lesson order come from the published content. Student records and grades are not connected.</p>
    <div className="curriculum-grid">
      <div className="curriculum-units" aria-label="Unit and lesson list">
        {course.units.map((unit,index)=><details key={unit.id} open={lessonIdsOf(unit).includes(chosenId) || index===0}>
          <summary>Unit {unitNumberOf(unit,index+1)} · {unitTitleOf(unit)}</summary>
          <div>
            {lessonIdsOf(unit).map(id=><button type="button" key={id}
              className={id===chosenId?'curriculum-lesson selected':'curriculum-lesson'}
              aria-current={id===chosenId?'true':undefined}
              onClick={()=>setSelected(id)}>{lessonTitleOf(course,id)}</button>)}
          </div>
        </details>)}
      </div>
      <article className="curriculum-lesson-preview">
        <div className="eyebrow">Published lesson</div>
        <h3>{row.title}</h3>
        <p>{row.summary || row.challenge || 'Practice the skills from this unit.'}</p>
        <div className="curriculum-meta"><span>{row.points ?? 0} possible points</span><span>{row.mode === 'function' ? 'Function' : 'Script'} · Python</span></div>
        {row.starter && <><h4>Starter code</h4><pre><code>{row.starter}</code></pre></>}
        {isInPreview ?
          <a className="btn" href={playgroundPath(previewCourse,chosenId)}>Open lesson in React preview <ExternalLink size={14}/></a> :
          <p className="muted">This lesson is new in the published catalog and is not yet included in this React snapshot.</p>}
      </article>
    </div>
  </section>;
}
