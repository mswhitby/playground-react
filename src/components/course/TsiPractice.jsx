import { useState } from 'react';
import { BookOpen, Calculator, CheckCircle2, RotateCcw } from 'lucide-react';
import { tsiQuestions } from '../../data/tsiQuestions.js';

/** Original math practice questions for layout demonstration; no code editor or compiler. */
export default function TsiPractice({ lessonId }) {
  const question = tsiQuestions[lessonId];
  const [answer, setAnswer] = useState(null);
  const [checked, setChecked] = useState(false);
  return (
    <section className="tsi-practice" aria-label="TSIA2 sample practice">
      <div className="tsi-practice-heading"><Calculator size={20}/><div><h2>TSIA2 sample practice</h2><p>One original question · visual preview only</p></div></div>
      <div className="tsi-question-card">
        <div className="eyebrow">QUANTITATIVE REASONING · QUESTION 1</div>
        <h3>{question.prompt}</h3>
        <div className="tsi-answers" role="radiogroup" aria-label="Choose the correct answer">
          {question.options.map((option, i) => (
            <label key={option} className={`tsi-choice ${answer === i ? 'selected' : ''} ${checked && i === question.correct ? 'correct' : ''}`}>
              <input type="radio" name={`tsi-${lessonId}`} checked={answer === i} disabled={checked} onChange={() => setAnswer(i)} />
              <span className="tsi-letter">{String.fromCharCode(65 + i)}</span><span>{option}</span>
            </label>
          ))}
        </div>
        {checked && <div className="tsi-feedback" role="status">
          <strong><CheckCircle2 size={17}/> {answer === question.correct ? 'Correct!' : 'Review the solution'}</strong>
          <p>{question.explanation}</p>
        </div>}
        <div className="tsi-buttons">
          <button className="btn primary" disabled={answer === null || checked} onClick={() => setChecked(true)}>Check answer</button>
          <button className="btn" onClick={() => { setAnswer(null); setChecked(false); }}><RotateCcw size={15}/> Try again</button>
        </div>
      </div>
      <div className="tsi-practice-tip"><BookOpen size={18}/><p><strong>Need a refresher?</strong> Read the Learn tab on the left, then return to this question. No coding tools are needed.</p></div>
      <p className="hint">Sample content only. These are not official College Board TSIA2 questions, and answers are not submitted.</p>
    </section>
  );
}
