import { Terminal } from 'lucide-react';

const JSX_SAMPLES = {
  'react-components': { title: 'Score Card', subtitle: 'Player score', value: '18 points', action: 'View details' },
  'react-state': { title: 'Counter', subtitle: 'Current count', value: '0', action: 'Increase' },
  'web-layout': { title: 'Responsive page', subtitle: 'Welcome', value: 'Your page content', action: 'Explore' },
  'web-events': { title: 'Form button', subtitle: 'Contact form', value: 'Ready', action: 'Send' },
};

/** Tabbed results without executing student code in the design preview. */
export default function ConsolePane({ text, checksText, language, lessonId, activeTab, onTabChange }) {
  const tabs = language === 'jsx' ? ['Preview', 'Console', 'Checks'] : ['Console', 'Checks'];
  const sample = JSX_SAMPLES[lessonId] || JSX_SAMPLES['react-components'];
  return (
    <section className="console-pane" aria-label="Workspace output">
      <div className="console-heading">
        <div className="console-tabs" role="tablist" aria-label="Output views">
          {tabs.map(tab => (
            <button key={tab} type="button" role="tab" aria-selected={activeTab === tab}
              className={activeTab === tab ? 'active' : ''} onClick={() => onTabChange(tab)}>
              {tab === 'Console' && <Terminal size={14}/>}
              {tab}
            </button>
          ))}
        </div>
        <span>Demo</span>
      </div>
      {activeTab === 'Preview' && language === 'jsx' ? (
        <div className="console-preview" role="tabpanel" aria-label="Interface preview">
          <div className="console-preview-card">
            <small>{sample.title}</small>
            <strong>{sample.value}</strong>
            <p>{sample.subtitle}</p>
            <span className="console-preview-action">{sample.action}</span>
          </div>
          <p className="console-preview-note">Sample layout. Your code isn't rendered here yet.</p>
        </div>
      ) : (
        <pre role="tabpanel" aria-label={activeTab === 'Checks' ? 'Check feedback' : 'Console output'}>
          {activeTab === 'Checks' ? checksText : text}
        </pre>
      )}
    </section>
  );
}
