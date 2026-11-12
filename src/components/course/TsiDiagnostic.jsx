import { useMemo, useState } from 'react';
import { useSaved } from '../../hooks/useSaved.js';

const STRANDS = [
  ['quantitative','Quantitative Reasoning'],
  ['algebraic','Algebraic Reasoning'],
  ['geometry','Geometric and Spatial Reasoning'],
  ['statistics','Probabilistic and Statistical Reasoning'],
];

// Matches the existing published Playground diagnostic's numeric distractor rule.
export function diagnosticOptions(question) {
  const a=question.answer;
  const delta=Number.isInteger(a) ? Math.max(1,Math.round(Math.abs(a)*0.15))
    : Math.max(.125,Math.round(Math.abs(a)*.2*1000)/1000);
  const values=[a+delta,a-delta,a+2*delta].map(value=>Number(value.toFixed(4)));
  values.splice(question.correct_index??0,0,a);
  return values;
}
export function diagnosticPlacement(items,answers) {
  return Object.fromEntries(STRANDS.map(([id])=>{
    const questions=items.filter(q=>q.strand===id);
    const correct=questions.filter(q=>answers[q.id] !== 'skip' &&
      Number(answers[q.id])===q.answer).length;
    return [id,{correct,total:questions.length,level:correct===questions.length?'Advanced':
      correct>=Math.ceil(questions.length*.6)?'Proficient':'Basic'}];
  }));
}

export default function TsiDiagnostic({items=[],profiles=[]}) {
  const [responses,setResponses]=useState({});
  const [code,setCode]=useState('');
  const [message,setMessage]=useState('');
  const [history,setHistory]=useSaved('designlab:tsi-math-placement', {});
  const [result,setResult]=useState(null);
  const grouped=useMemo(()=>STRANDS.map(([id,title])=>({id,title,items:items.filter(q=>q.strand===id)})),[items]);
  const currentPlacement=result || (history.diagnostic?.latest && history.diagnostic.latest.placement);

  function applyCode(event) {
    event.preventDefault();
    const matched=profiles.find(p=>p.code===code.trim().toUpperCase());
    if (!matched){setMessage('Enter a valid MATH01–MATH81 study code.');return;}
    setHistory(previous=>({...previous,code:matched.code,levels:matched.levels}));
    setMessage('Study code applied in this browser. It does not enroll you in a class.');
  }
  function submit(event) {
    event.preventDefault();
    if (items.some(q=>responses[q.id]===undefined)) {
      setMessage('Answer or select Not sure for every question.');return;
    }
    const placement=diagnosticPlacement(items,responses);
    const levels=Object.fromEntries(Object.entries(placement).map(([id,score])=>[id,score.level]));
    const attempt={at:new Date().toISOString(),placement,levels,answers:responses};
    setHistory(previous=>({...previous,levels,diagnostic:{
      first:previous.diagnostic?.first||attempt,latest:attempt}}));
    setResult(placement);
    setMessage('Your recommended starting levels are ready. Results are stored in this browser only.');
  }

  return <div className="published-reading surface-card tsi-diagnostic">
    <h2>Find your starting point</h2>
    <p>This is the existing 24-question, four-strand practice diagnostic. It suggests what to study;
      it does not predict an official TSIA2 score or assign an enrolled class.</p>
    <form onSubmit={applyCode} className="tsi-code-entry">
      <label htmlFor="math-locator-code">Pearson study code (MATH01–MATH81)</label>
      <input id="math-locator-code" type="text" placeholder="MATH01" maxLength={6}
        value={code} onChange={event=>setCode(event.target.value)} />
      <button className="btn" type="submit">Apply code</button>
    </form>
    {!!history.code && <p role="status">Current code: <strong>{history.code}</strong>.
      {' '}Recommended levels: {STRANDS.map(([id,title])=>title+': '+history.levels?.[id]).join(' · ')}</p>}
    <form onSubmit={submit}>
      <h3>Take the diagnostic</h3>
      <p>Choose one answer or Not sure for all {items.length} questions. This open practice records
        your first and latest attempts in this browser, not the live gradebook.</p>
      {grouped.map(group=><section key={group.id} className="tsi-diagnostic-strand">
        <h3>{group.title}</h3>
        {group.items.map(question=><fieldset key={question.id} className="tsi-question">
          <legend>{question.prompt}</legend>
          <div className="tsi-answers">
            {diagnosticOptions(question).map((option,index)=><label className="tsi-choice" key={index}>
              <input type="radio" name={question.id} value={option} checked={responses[question.id]===String(option)}
                onChange={()=>setResponses(old=>({...old,[question.id]:String(option)}))}/>
              <span className="tsi-letter">{String.fromCharCode(65+index)}</span><span>{option}</span>
            </label>)}
            <label className="tsi-choice">
              <input type="radio" name={question.id} value="skip" checked={responses[question.id]==='skip'}
                onChange={()=>setResponses(old=>({...old,[question.id]:'skip'}))}/>
              <span>Not sure</span>
            </label>
          </div>
        </fieldset>)}
      </section>)}
      <button type="submit" className="btn primary">Get my recommended levels</button>
    </form>
    {!!message && <p role="status">{message}</p>}
    {currentPlacement && <section className="tsi-diagnostic-results" aria-label="Diagnostic results">
      <h3>Recommended starting levels</h3>
      {STRANDS.map(([id,title])=><p key={id}>
        <strong>{title}: {currentPlacement[id].level}</strong> ({currentPlacement[id].correct} of {currentPlacement[id].total} correct)
      </p>)}
      <p>This diagnostic is instructional, not a verified measure of college readiness.
        All published lessons remain available regardless of recommendation.</p>
      {!!history.diagnostic?.first && !!history.diagnostic?.latest &&
        <p>First attempt: {new Date(history.diagnostic.first.at).toLocaleDateString()} ·
          Latest: {new Date(history.diagnostic.latest.at).toLocaleDateString()}</p>}
    </section>}
  </div>;
}
