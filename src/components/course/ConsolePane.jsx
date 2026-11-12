import { Terminal } from 'lucide-react';
import { summarizeChecks } from '../../lib/previewChecks.js';

/** Shared functional Console / Checks cards / sandboxed web preview. Practice only. */
export default function ConsolePane({
  text='',checksText='',checkRows=null,points=null,language,activeTab,onTabChange,
  previewEnabled=false,previewDoc='',previewRef
}) {
  const tabs = previewEnabled ? ['Preview', 'Console', 'Checks'] : ['Console', 'Checks'];
  const checked=Array.isArray(checkRows);
  const {passed,total}=summarizeChecks(checkRows);
  const pointsValue=Number.isFinite(Number(points)) && points!==null && total
    ? (Number(points)*passed/total) : null;
  return <section className="console-pane" aria-label="Workspace output">
    <div className="console-heading">
      <div className="console-tabs" role="tablist" aria-label="Output views">
        {tabs.map(tab => <button key={tab} type="button" role="tab"
          aria-selected={activeTab===tab} className={activeTab===tab?'active':''}
          onClick={()=>onTabChange(tab)}>
          {tab==='Console' && <Terminal size={14}/>}
          {tab}
        </button>)}
      </div>
      <span>Practice · no submissions</span>
    </div>
    {(['html','css','javascript','jsx'].includes(language)) &&
      <div className="console-preview" hidden={!previewEnabled||activeTab!=='Preview'}>
        <iframe ref={previewRef} title="Live student code preview" className="live-preview-frame"
          sandbox="allow-scripts allow-forms" srcDoc={previewDoc || '<p>Choose Run to preview your code.</p>'}/>
      </div>}
    {activeTab==='Checks' ? <div className="practice-check-content" role="tabpanel" aria-label="Check feedback">
      {checked ? <>
        <p className="check-summary">Checks <strong>{passed} of {total} passing</strong></p>
        <p className="check-next">{passed===total?'All published practice checks passed.':'Revise your code, then check again.'}</p>
        <div className="practice-check-cards">
          {checkRows.map((row,i)=><article key={i}
            className={'practice-check-card '+(row.passed?'passed':'needs-revision')}>
            <header><code>{row.call || 'Example '+(i+1)}</code>
              <span>{row.passed?'Pass':'Review'}</span></header>
            <dl><dt>Expected</dt><dd><pre>{row.expected ?? ''}</pre></dd>
              <dt>{row.error?'Error':'Received'}</dt><dd><pre>{row.error || row.received || 'None'}</pre></dd></dl>
          </article>)}
        </div>
        {pointsValue!==null && <p className="check-practice-score">Public-check score: {Number(pointsValue.toFixed(2))}/{points} practice points · {passed}/{total} examples passed.</p>}
        <p className="check-disclaimer">Public examples only. These results do not award grades, completion, or earned points.</p>
      </> : <pre className="practice-check-message">{checksText}</pre>}
    </div> : activeTab==='Console' ? <pre role="tabpanel" aria-label="Console output">{text}</pre> : null}
  </section>;
}
