import { useMemo, useState } from 'react';
import { CheckCircle2, ClipboardPenLine, History, Save, Send, ShieldCheck } from 'lucide-react';
import { seedStudents } from '../data/students.js';
import { getCourse } from '../data/courses.js';
import { sections } from '../data/sections.js';
import { journalDraftId, journalWeekLabel, journalWeeks, validateJournal } from '../lib/journals.js';
import { useSaved } from '../hooks/useSaved.js';

const samplePrompts = {
  essay: 'Think about a time you solved a difficult problem. Explain what you tried first, how you changed your approach, and what you learned. Use specific evidence.',
  'logic-puzzle': 'A robot follows this pattern: 2, 6, 12, 20, 30, __. Find the next number. Explain the pattern and show why your answer fits.'
};
const emptyDraft = { response: '', type: 'essay', aiUse: '', aiDetails: '' };

/** Fully local student journal design preview; mock hand-ins can be reviewed in the teacher view. */
export default function Journals({ submissions, setSubmissions }) {
  const [sectionId, setSectionId] = useSaved('designlab:journal-section', sections[0].id);
  const validSection = sections.find(s => s.id === sectionId) || sections[0];
  const members = seedStudents.filter(s => s.sections.includes(validSection.id));
  const [studentId, setStudentId] = useSaved('designlab:journal-student', seedStudents[0].id);
  const validStudent = members.find(s => s.id === studentId) || members[0];
  const weeks = useMemo(() => journalWeeks(), []);
  const [week, setWeek] = useSaved('designlab:journal-week', weeks[0]);
  const activeWeek = weeks.includes(week) ? week : weeks[0];
  const [drafts, setDrafts] = useSaved('designlab:journal-drafts', {});
  const [status, setStatus] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const draftId = journalDraftId(validSection.id, validStudent.id, activeWeek);
  const draft = drafts[draftId] || emptyDraft;
  const mySubmissions = submissions.filter(s => s.studentId === validStudent.id && s.sectionId === validSection.id && s.week === activeWeek);
  const latest = mySubmissions.at(-1);
  const wordCount = draft.response.trim() ? draft.response.trim().split(/\s+/).length : 0;
  function update(key, value) { setDrafts(prev => ({ ...prev, [draftId]: { ...(prev[draftId] || emptyDraft), [key]: value } })); setStatus('Draft saved in this browser.'); }
  function submit(event) {
    event.preventDefault();
    const problem = validateJournal(draft);
    if (problem) { setStatus(problem); return; }
    const newSubmission = {
      id: `demo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      sectionId: validSection.id, studentId: validStudent.id,
      studentName: `${validStudent.first} ${validStudent.last}`, courseId: validSection.course,
      week: activeWeek, response: draft.response.trim(), type: draft.type,
      aiUse: draft.aiUse, aiDetails: draft.aiDetails.trim(), submittedAt: new Date().toISOString(),
    };
    setSubmissions(prev => [...prev, newSubmission]);
    setStatus('Demo submission saved locally. Check the Teacher dashboard → Journals tab to review it.');
  }
  return (
    <div className="main-content journal-screen">
      <div className="eyebrow">Your classes · Written work</div>
      <header className="journal-heading">
        <div><h1>Weekly Journals</h1><p>Essay responses, reflections, and logic puzzles—all in one place.</p></div>
        <span className="chip"><ShieldCheck size={14}/> Local demo only</span>
      </header>
      <section className="journal-card journal-selection" aria-label="Select a journal">
        <label>Class section
          <select value={validSection.id} onChange={e => { setSectionId(e.target.value); setStatus(''); }}>
            {sections.map(s => <option key={s.id} value={s.id}>{s.name} · {getCourse(s.course)?.label}</option>)}
          </select>
        </label>
        <label>Preview as student
          <select value={validStudent.id} onChange={e => { setStudentId(e.target.value); setStatus(''); }}>
            {members.map(s => <option key={s.id} value={s.id}>{s.first} {s.last} (sample)</option>)}
          </select>
        </label>
        <label>Journal week
          <select value={activeWeek} onChange={e => { setWeek(e.target.value); setStatus(''); }}>
            {weeks.map(w => <option key={w} value={w}>Week of {journalWeekLabel(w)}</option>)}
          </select>
        </label>
      </section>
      <section className="journal-card journal-editor-card">
        <div className="journal-section-heading">
          <div><div className="eyebrow">{getCourse(validSection.course)?.label} · {validSection.name}</div>
            <h2>Journal · Week of {journalWeekLabel(activeWeek)}</h2>
          </div>
          <span className={`journal-status-pill ${latest ? 'submitted' : ''}`}>{latest ? 'Submitted' : 'Not submitted'}</span>
        </div>
        <p className="journal-instructions">This is a fictional prompt for design testing. In production, your teacher would publish the weekly assignment.</p>
        <form onSubmit={submit}>
          <label>Response type
            <select value={draft.type} onChange={e => update('type', e.target.value)}>
              <option value="essay">Essay or written reflection</option>
              <option value="logic-puzzle">Logic puzzle or reasoning task</option>
            </select>
          </label>
          <div className="journal-prompt"><strong>Sample prompt</strong><p>{samplePrompts[draft.type]}</p></div>
          <label htmlFor="journal-answer">Your response</label>
          <textarea id="journal-answer" rows="13" maxLength="100000" spellCheck
            placeholder="Write your explanation here. Show steps and reasoning for logic puzzles."
            value={draft.response} onChange={e => update('response', e.target.value)}/>
          <div className="journal-writing-meta"><span>{wordCount} words</span><span><Save size={13}/> Autosaved in this browser</span></div>
          <div className="journal-integrity">
            <label>AI-use declaration
              <select value={draft.aiUse} onChange={e => update('aiUse', e.target.value)}>
                <option value="">Choose one</option>
                <option value="none">I did not use AI-generated content</option>
                <option value="disclosed">I used AI and will explain how</option>
              </select>
            </label>
            <p className="hint">This is a declaration for review, not an automatic grade. Follow your teacher's classroom AI policy.</p>
            {draft.aiUse === 'disclosed' && <label>Describe the AI assistance
              <textarea rows="3" value={draft.aiDetails} onChange={e => update('aiDetails', e.target.value)} placeholder="Identify which parts involved AI assistance."/>
            </label>}
          </div>
          <div className="journal-actions"><button type="button" className="btn" onClick={() => { setStatus('Draft saved in this browser.'); }}><Save size={15}/> Save draft</button>
            <button type="submit" className="btn submit"><Send size={15}/> Demo submit</button></div>
          <p role="status" className="journal-submit-status">{status}</p>
        </form>
        <div className="journal-bottom-row">
          <p className="hint">No real submissions are sent. Each demo submission records a separate copy; drafts remain editable.</p>
          <button type="button" className="btn" onClick={() => setShowHistory(v => !v)}><History size={15}/> {showHistory ? 'Hide history' : `Submission history (${mySubmissions.length})`}</button>
        </div>
        {showHistory && <div className="journal-history">
          {mySubmissions.length ? mySubmissions.map(s => <details key={s.id} className="journal-history-item"><summary><CheckCircle2 size={16}/> Submitted {new Date(s.submittedAt).toLocaleString()} · {s.type}</summary><div className="journal-history-answer">{s.response}</div></details>) : <p className="muted">No submissions yet for this week.</p>}
        </div>}
      </section>
    </div>
  );
}
