import { useEffect, useMemo, useState } from 'react';
import { BookOpen, ExternalLink, LockKeyhole } from 'lucide-react';
import { getCourse } from '../../data/courses.js';
import { getCourseLesson, lessonIdsOf, lessonTitleOf, normalizeImportedOutline, unitNumberOf, unitTitleOf } from '../../lib/courseContent.js';
import { playgroundPath } from '../../lib/routes.js';
import { niceName } from '../../lib/students.js';
import {
  matchingPreviewAssignment, previewAssignment, upsertPreviewAssignment
} from '../../lib/previewAssignments.js';

const sourceUrl = '/playground/data/computer-science-1/course.json';
const previewCourse = getCourse('computer-science-1');

/** Read-only public catalog + draft assignment UI. Never bundles or fetches solutions. */
export default function TeacherCurriculum({ section, students = [], assignments = [], setAssignments }) {
  const [live, setLive] = useState(null);
  const [loadStatus, setLoadStatus] = useState('loading');
  const [selected, setSelected] = useState(previewCourse.lessons[0]);
  const [scope, setScope] = useState('section');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [dueDate, setDueDate] = useState('');
  const [points, setPoints] = useState('');
  const [codeView, setCodeView] = useState('starter');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const abort = new AbortController();
    fetch(sourceUrl, {signal:abort.signal, cache:'no-store'})
      .then(response => {
        if (!response.ok) throw new Error('Curriculum unavailable');
        return response.json();
      })
      .then(catalog => {
        if (!Array.isArray(catalog.lessons) || !catalog.lessons.length) throw new Error('Unexpected curriculum response');
        setLive(normalizeImportedOutline(catalog));
        setLoadStatus('live');
      })
      .catch(error => { if (error.name !== 'AbortError') setLoadStatus('snapshot'); });
    return () => abort.abort();
  }, []);

  const course = useMemo(() => live ? {...previewCourse, ...live} : previewCourse, [live]);
  const ids = course.lessons;
  const chosenId = ids.includes(selected) ? selected : ids[0];
  const row = getCourseLesson(course, chosenId);
  const possiblePoints = ids.reduce((total, id) => total + (Number(getCourseLesson(course,id)?.points) || 0),0);
  const isInPreview = previewCourse.lessons.includes(chosenId);
  const isCs1Section = section?.course === 'computer-science-1';
  const existing = matchingPreviewAssignment(assignments, section?.id, chosenId);
  const sectionStudents = students.filter(student => student.sections.includes(section?.id));

  useEffect(() => {
    const saved = matchingPreviewAssignment(assignments,section?.id,chosenId);
    setScope(saved?.scope || 'section');
    setSelectedStudents(saved?.studentIds || []);
    setDueDate(saved?.dueDate || '');
    setPoints(String(saved?.points ?? getCourseLesson(course,chosenId)?.points ?? 0));
    setFeedback('');
    setCodeView('starter');
  // Only reset draft when the user switches to another lesson or class section.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenId,section?.id]);

  function saveAssignment(event) {
    event.preventDefault();
    try {
      const record = previewAssignment({
        sectionId:section?.id, sectionCourseId:section?.course, lessonId:chosenId,
        scope, studentIds:selectedStudents, dueDate, points
      },sectionStudents);
      setAssignments?.(previous => upsertPreviewAssignment(previous,record));
      setFeedback('Preview assignment saved in this browser. No students were notified.');
    } catch(error) { setFeedback(error.message); }
  }

  function removeAssignment() {
    setAssignments?.(previous => (previous||[]).filter(record => record.id !== existing?.id));
    setFeedback('Preview assignment cleared. Live student records were not changed.');
  }

  return <section className="panel curriculum-panel" aria-label="Published curriculum">
    <div className="section-heading">
      <div>
        <h2><BookOpen size={18}/> Computer Science I curriculum</h2>
        <p>{course.units.length} original units · {ids.length} lessons · {possiblePoints} available lesson points</p>
      </div>
      <span className="curriculum-source" role="status">
        {loadStatus === 'live' ? 'Published course • current'
          : loadStatus === 'loading' ? 'Checking published course…' : 'Bundled preview snapshot'}
      </span>
    </div>
    <p className="curriculum-explanation">
      Lesson titles, published points, starter code, and unit order come from the real CS1 catalog.
      Assignment controls below are a browser-only preview and do not affect live students.
    </p>
    <div className="curriculum-grid">
      <div className="curriculum-units" aria-label="Unit and lesson list">
        {course.units.map((unit,index) => <details key={unit.id} open={lessonIdsOf(unit).includes(chosenId) || index===0}>
          <summary>Unit {unitNumberOf(unit,index+1)} · {unitTitleOf(unit)}</summary>
          <div>
            {lessonIdsOf(unit).map(id => <button type="button" key={id}
              className={id===chosenId?'curriculum-lesson selected':'curriculum-lesson'}
              aria-current={id===chosenId?'true':undefined}
              onClick={() => setSelected(id)}>
              {lessonTitleOf(course,id)}
              {matchingPreviewAssignment(assignments,section?.id,id) && <small> · Assigned in preview</small>}
            </button>)}
          </div>
        </details>)}
      </div>
      <article className="curriculum-lesson-preview">
        <div className="eyebrow">Published lesson</div>
        <h3>{row.title}</h3>
        <p>{row.summary || row.challenge || 'Practice the skills from this unit.'}</p>
        <div className="curriculum-meta">
          <span>{row.points ?? 0} published points</span>
          <span>{row.mode === 'function' ? 'Function' : 'Script'} · Python</span>
        </div>

        <div className="curriculum-code-tabs" role="tablist" aria-label="Lesson code">
          <button type="button" role="tab" aria-selected={codeView==='starter'}
            className={codeView==='starter'?'active':''} onClick={() => setCodeView('starter')}>
            Starter code
          </button>
          <button type="button" role="tab" aria-selected={codeView==='solution'}
            className={codeView==='solution'?'active':''} onClick={() => setCodeView('solution')}>
            <LockKeyhole size={14}/> Solution
          </button>
        </div>
        {codeView === 'starter' ? <pre className="curriculum-code"><code>{row.starter || '# No starter code provided'}</code></pre>
          : <div className="curriculum-solution-locked" role="status">
            <LockKeyhole size={20}/>
            <div>
              <strong>Teacher-only solutions</strong>
              <p>Solutions must be loaded from protected storage after teacher sign-in and authorization. Answer keys are not included in the public React preview.</p>
            </div>
          </div>}
        {isInPreview ?
          <a className="btn" href={playgroundPath(previewCourse,chosenId)}>
            Open lesson in React preview <ExternalLink size={14}/>
          </a> :
          <p className="muted">This newer published lesson is not yet in the React snapshot.</p>}

        <div className="curriculum-assignment-editor">
          <h4>Assign lesson</h4>
          {!isCs1Section ? <p className="curriculum-assignment-warning">
            {section?.name || 'This section'} uses a different course. Choose a Computer Science I section to assign CS1 lessons.
          </p> : <>
            <p className="curriculum-assignment-warning">
              Preview only. Assignments are saved in this browser, not sent to students or the live gradebook.
            </p>
            <form onSubmit={saveAssignment} className="curriculum-assignment-form">
              <label>Assign to
                <select value={scope} onChange={event => setScope(event.target.value)}>
                  <option value="section">Whole class · {sectionStudents.length} sample students</option>
                  <option value="selected">Selected students</option>
                </select>
              </label>
              {scope === 'selected' && <fieldset className="curriculum-recipient-picker">
                <legend>Choose students</legend>
                {sectionStudents.length ? sectionStudents.map(student => <label key={student.id}>
                  <input type="checkbox" checked={selectedStudents.includes(student.id)}
                    onChange={event => setSelectedStudents(current => event.target.checked
                      ? [...current,student.id] : current.filter(id => id!==student.id))}/>
                  <span>{niceName(student)}</span>
                </label>) : <p>No sample students are enrolled in this section.</p>}
              </fieldset>}
              <div className="curriculum-assignment-fields">
                <label>Due date
                  <input type="date" required value={dueDate} onChange={event => setDueDate(event.target.value)}/>
                </label>
                <label>Points
                  <input type="number" required min="0" max="1000" step="1"
                    value={points} onChange={event => setPoints(event.target.value)}/>
                </label>
              </div>
              <div className="curriculum-assignment-actions">
                <button type="submit" className="btn primary">{existing ? 'Update preview assignment' : 'Save preview assignment'}</button>
                {existing && <button type="button" className="btn" onClick={removeAssignment}>Remove assignment</button>}
              </div>
            </form>
            {existing && <p className="curriculum-current-assignment">
              Saved for {existing.scope === 'section' ? 'whole class' : existing.studentIds.length+' selected students'}
              {' · '}Due {existing.dueDate} · {existing.points} points
            </p>}
            {feedback && <p className="curriculum-assignment-feedback" role="status">{feedback}</p>}
          </>}
        </div>
      </article>
    </div>
  </section>;
}
