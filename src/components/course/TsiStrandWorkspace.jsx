import { useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, RotateCcw } from 'lucide-react';
import { renderMarkdown } from '../../lib/markdown.js';
import { parseTsiStrandLesson } from '../../lib/tsiStrandPractice.js';

/**
 * Preview-only layout for the four published TSI instructional strand drafts.
 * Questions and worked explanations share a view; no verified grades are written.
 */
export default function TsiStrandWorkspace({ task }) {
  const lesson = useMemo(() => parseTsiStrandLesson(task.markdownSource), [task.markdownSource]);
  const answers = task.tsiKey?.items || [];
  const [selected, setSelected] = useState({});
  const [checked, setChecked] = useState(false);
  const count = lesson.questions.filter(q => selected[q.number] === answers.find(a => a.question === q.number)?.correct).length;
  const complete = lesson.questions.length === 4 && lesson.questions.every(q => q.options.length === 4);
  const canCheck = complete && answers.length === 4 && Object.keys(selected).length === 4;

  if (!complete) return <section className="surface-card tsi-strand-error" role="alert">
    <h2>Practice questions unavailable</h2>
    <p>This draft lesson's multiple-choice questions could not be loaded. No sample questions were substituted.</p>
  </section>;

  return <div className="tsi-strand-workspace">
    <section className="surface-card tsi-strand-questions" aria-label="TSI math questions">
      <div className="tsi-strand-panel-heading">
        <span className="eyebrow">Practice</span>
        <h2>Questions</h2>
        <p>Solve each problem, then check your answers against the explanations on the right.</p>
      </div>
      <form onSubmit={event => {event.preventDefault(); if (canCheck) setChecked(true);}}>
        {lesson.questions.map(q => {
          const correct = answers.find(a => a.question === q.number)?.correct;
          return <fieldset className="tsi-strand-question" key={q.number} disabled={checked}>
            <legend><span className="tsi-strand-question-number">{q.number}</span> {q.prompt}</legend>
            <div className="tsi-strand-options">
              {q.options.map(option => <label className={[
                'tsi-strand-option',
                selected[q.number] === option.letter ? 'selected' : '',
                checked && correct === option.letter ? 'correct' : ''
              ].filter(Boolean).join(' ')} key={option.letter}>
                <input type="radio" name={task.id + '-q' + q.number}
                  value={option.letter} checked={selected[q.number] === option.letter}
                  onChange={() => {setSelected(current => ({...current,[q.number]:option.letter}));setChecked(false);}}/>
                <span className="tsi-strand-letter">{option.letter}</span><span>{option.text}</span>
              </label>)}
            </div>
            {checked && <p className="tsi-strand-question-status" role="status">
              {selected[q.number] === correct ? 'Correct' : 'Review question ' + q.number + ' on the right'}
            </p>}
          </fieldset>;
        })}
        <div className="tsi-strand-actions">
          <button type="submit" className="btn primary" disabled={!canCheck || checked}>Check answers</button>
          <button type="button" className="btn" onClick={() => {setSelected({});setChecked(false);}}><RotateCcw size={15}/> Try again</button>
        </div>
        <p className="tsi-strand-progress" role="status">{checked ? count + ' of 4 correct · instructional practice only' : Object.keys(selected).length + ' of 4 answered'}</p>
      </form>
    </section>
    <section className="surface-card tsi-strand-explanations" aria-label="Math explanations">
      <div className="tsi-strand-panel-heading">
        <span className="eyebrow">Learn</span>
        <h2><BookOpen size={20} aria-hidden="true"/> Worked explanations</h2>
      </div>
      <div className="markdown-preview" dangerouslySetInnerHTML={{__html:renderMarkdown(lesson.learn)}}/>
      <div className="tsi-strand-review" aria-live="polite">
        <h3>{checked ? <><CheckCircle2 size={18}/> Answer explanations</> : 'Review your answers'}</h3>
        {checked
          ? lesson.questions.map(q => {
              const key=answers.find(a => a.question === q.number);
              return <article key={q.number} className="tsi-strand-answer">
                <h4>Question {q.number} · {selected[q.number] === key?.correct ? 'Correct' : 'Needs review'}</h4>
                <p>Your choice: {selected[q.number]} · Correct: {key?.correct}</p>
                <p>{key?.explanation || 'A worked explanation is not yet available.'}</p>
              </article>;
            })
          : <p>Complete all four questions and choose <strong>Check answers</strong> to see the explanations for each.</p>}
      </div>
      {lesson.reflect && <div className="tsi-strand-reflect markdown-preview"
        dangerouslySetInnerHTML={{__html:renderMarkdown(lesson.reflect)}}/>}
    </section>
    <p className="tsi-strand-disclaimer">Draft TSI instructional practice · 30 minutes · Not an official TSIA2 assessment. Answers in this React preview are not submitted or graded.</p>
  </div>;
}
