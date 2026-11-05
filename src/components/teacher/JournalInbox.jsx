import { useState } from 'react';
import { ClipboardPenLine } from 'lucide-react';
import { journalWeekLabel, journalWeeks } from '../../lib/journals.js';

/** Teacher-facing demo: latest submission per student/week, with receipts. */
export default function JournalInbox({ section, students, submissions }) {
  const [week, setWeek] = useState(journalWeeks()[0]);
  const [show, setShow] = useState(null);
  const recentWeeks = journalWeeks();
  const rows = students.map(student => {
    const copies = submissions.filter(s => s.studentId === student.id && s.sectionId === section.id && s.week === week);
    return {student, copies, latest: copies.at(-1)};
  });
  const handedIn = rows.filter(r => r.latest).length;
  return <section className="panel journal-inbox">
    <div className="section-heading">
      <div><div className="eyebrow">Teacher review · Sample records</div><h2><ClipboardPenLine size={19}/> Weekly journal submissions</h2>
        <p>Review essays and logic puzzles from this section. Journals are never automatically graded.</p></div>
      <label>Journal week <select value={week} onChange={event => {setWeek(event.target.value);setShow(null);}}>
        {recentWeeks.map(date => <option key={date} value={date}>{journalWeekLabel(date)}</option>)}
      </select></label>
    </div>
    <div className="stat-grid">
      <div className="stat-card"><strong>{handedIn}</strong><span>Submitted</span></div>
      <div className="stat-card"><strong>{rows.length - handedIn}</strong><span>Missing</span></div>
      <div className="stat-card"><strong>{rows.length}</strong><span>Students in section</span></div>
    </div>
    <div className="journal-inbox-rows">
      {rows.map(({student, latest, copies}) => <div key={student.id} className="journal-inbox-row">
        <div><strong>{student.first} {student.last}</strong><small>@{student.github}</small></div>
        <span className={`journal-status-pill ${latest ? 'submitted' : ''}`}>{latest ? 'Submitted' : 'Missing'}</span>
        <span className="journal-inbox-date">{latest ? new Date(latest.submittedAt).toLocaleString() : '—'}</span>
        <button className="btn" disabled={!latest} onClick={() => setShow(show === student.id ? null : student.id)}>{show === student.id ? 'Close' : 'Review'}</button>
        {show === student.id && latest && <div className="journal-review-detail">
          <div className="eyebrow">{latest.type.replace('-', ' ')} · {copies.length} {copies.length === 1 ? 'hand-in' : 'hand-ins'} · Manual review</div>
          <div className="journal-history-answer">{latest.response}</div>
          <p className="hint">AI declaration: {latest.aiUse === 'none' ? 'No AI reported' : `Disclosed · ${latest.aiDetails}`}</p>
        </div>}
      </div>)}
    </div>
    <p className="hint">This inbox uses fictional students and demo submissions created in this browser. No grades or messages are sent.</p>
  </section>;
}
