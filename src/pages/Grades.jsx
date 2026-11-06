import { useState } from 'react';
import { BookOpen, CalendarDays, ChartNoAxesColumnIncreasing, Trophy } from 'lucide-react';
import { courses, getCourse } from '../data/courses.js';
import { lessons } from '../data/lessons.js';
import { getChallenge } from '../data/challenges.js';
import { assignedWork } from '../data/assignedWork.js';
import { dueLabel, gradeTotals, gradeFor, statusFor, weeklyGrades } from '../lib/gradebook.js';
import { journalWeekLabel } from '../lib/journals.js';

function titleFor(id) {
  const [kind,...parts]=id.split(':');
  const name=parts.join(':');
  return kind==='lesson' ? lessons[name]?.title||name : getChallenge(name)?.title||name;
}

export default function Grades({ grades=[], completedLessons=[] }) {
  const [filter,setFilter]=useState('all');
  const filtered=filter==='all'?grades:grades.filter(g=>g.courseId===filter);
  const overall=gradeTotals(filtered);
  const weeks=weeklyGrades(filtered);
  const current=weeks[0];
  const courseBreakdown=courses.map(course=>({
    ...course, ...gradeTotals(grades.filter(g=>g.courseId===course.id))
  }));
  const pending=assignedWork.filter(a=>filter==='all'||a.courseId===filter)
    .map(a=>({...a,status:statusFor(a.id,{assignments:assignedWork,grades,completedLessons})}))
    .filter(a=>a.status.state==='assigned'||a.status.state==='overdue')
    .sort((a,b)=>a.dueDate.localeCompare(b.dueDate));

  return <div className="main-content grades-screen">
    <header className="grades-heading">
      <div>
        <div className="eyebrow">Your progress</div>
        <h1>Grades</h1>
        <p>See your earned points, weekly scores, and work still due.</p>
      </div>
      <label className="grades-filter">Course
        <select value={filter} onChange={event=>setFilter(event.target.value)}>
          <option value="all">All courses</option>
          {courses.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </label>
    </header>
    <p className="grades-preview-note">These are sample scores to help preview the page. Only graded work counts toward earned points.</p>
    <div className="grades-summary">
      <div className="grades-stat surface-card">
        <ChartNoAxesColumnIncreasing size={19}/><span>Points earned</span>
        <strong>{overall.earned} <small>/ {overall.possible}</small></strong>
        <p>{overall.percent===null?'No graded work yet':`${overall.percent}% of graded points`}</p>
      </div>
      <div className="grades-stat surface-card">
        <Trophy size={19}/><span>Graded activities</span><strong>{overall.count}</strong><p>Lessons and challenges</p>
      </div>
      <div className="grades-stat surface-card">
        <CalendarDays size={19}/><span>Most recent scored week</span>
        <strong>{current ? `${current.earned} / ${current.possible}` : '—'}</strong>
        <p>{current ? `Week of ${journalWeekLabel(current.week)}` : 'No scores yet'}</p>
      </div>
    </div>
    <section className="grades-panel surface-card">
      <h2>Weekly scores</h2>
      {weeks.length ? <div className="grades-weeks">
        {weeks.map(w=><div className="grades-week" key={w.week}>
          <div><strong>Week of {journalWeekLabel(w.week)}</strong><small>{w.count} scored {w.count===1?'activity':'activities'}</small></div>
          <div className="grades-week-score"><strong>{w.earned} / {w.possible} pts</strong>
            <progress value={w.earned} max={Math.max(w.possible,1)} aria-label={`Week of ${journalWeekLabel(w.week)}: ${w.earned} of ${w.possible} points`}/>
          </div>
        </div>)}
      </div> : <p>No graded work in this selection.</p>}
    </section>
    {filter==='all'&&<section className="grades-panel surface-card">
      <h2>By course</h2>
      <div className="grades-course-list">
        {courseBreakdown.map(course=><div className="grades-course-row" key={course.id} data-course={course.id}>
          <span className="grades-course-dot" aria-hidden="true"/>
          <strong>{course.label}</strong>
          <span>{course.count ? `${course.earned} / ${course.possible} pts`:'No grades yet'}</span>
        </div>)}
      </div>
    </section>}
    <section className="grades-panel surface-card">
      <h2>Scored work</h2>
      {filtered.length?<div className="grades-entries">{filtered.slice().sort((a,b)=>b.gradedAt.localeCompare(a.gradedAt)).map(g=>
        <div className="grades-entry" key={g.id}>
          <div><strong>{titleFor(g.id)}</strong><small><BookOpen size={13}/>{getCourse(g.courseId)?.label||g.courseId} · {dueLabel(g.gradedAt)}</small></div>
          <strong>{g.earned} / {g.possible} pts</strong>
        </div>)}</div>:<p>No scored lessons or challenges yet.</p>}
    </section>
    <section className="grades-panel surface-card">
      <h2>Still to complete</h2>
      {pending.length?<div className="grades-entries">{pending.map(a=>
        <div className="grades-entry" key={a.id}>
          <div><strong>{titleFor(a.id)}</strong><small>{getCourse(a.courseId)?.label||a.courseId}</small></div>
          <div className="grades-due-meta"><span className={`assignment-status ${a.status.state}`}>{a.status.state==='overdue'?'Overdue':'Assigned'}</span><small>Due {dueLabel(a.dueDate)}</small></div>
        </div>)}</div>:<p>Nothing outstanding in this selection.</p>}
    </section>
  </div>;
}
