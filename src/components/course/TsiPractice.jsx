import { useState } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { tsiQuestions } from '../../data/tsiQuestions.js';

/** Guided math question; the Learn pane shows the worked explanation. */
export default function TsiPractice({ lessonId, onAnswerChecked }) {
  const question = tsiQuestions[lessonId];
  const [answer, setAnswer] = useState(null);
  const [checked, setChecked] = useState(false);
  function checkAnswer() {
    setChecked(true);
    onAnswerChecked?.({ selected: answer, correct: answer === question.correct });
  }
  function retry() {
    setAnswer(null);
    setChecked(false);
    onAnswerChecked?.(null);
  }
  return (
    <section className="tsi-practice" aria-label="Math question">
      <div className="tsi-practice-heading">
        <Calculator size={20} />
        <div><h2>Try this question</h2><p>Choose an answer, then review the explanation on the right.</p></div>
      </div>
      <div className="tsi-question-card">
        <div className="eyebrow">Question</div>
        <h3>{question.prompt}</h3>
        <div className="tsi-answers" role="radiogroup" aria-label="Choose the correct answer">
          {question.options.map((option, i) => (
            <label key={option} className={`tsi-choice ${answer === i ? 'selected' : ''} ${checked && i === question.correct ? 'correct' : ''}`}>
              <input type="radio" name={`tsi-${lessonId}`} checked={answer === i} disabled={checked} onChange={() => setAnswer(i)} />
              <span className="tsi-letter">{String.fromCharCode(65 + i)}</span><span>{option}</span>
            </label>
          ))}
        </div>
        {checked && <p className="tsi-answer-status" role="status">
          {answer === question.correct ? 'Correct! Read why on the right.' : 'Not quite. Review the explanation on the right.'}
        </p>}
        <div className="tsi-buttons">
          <button className="btn primary" disabled={answer === null || checked} onClick={checkAnswer}>Check answer</button>
          <button className="btn" onClick={retry}><RotateCcw size={15}/> Try again</button>
        </div>
      </div>
    </section>
  );
}
