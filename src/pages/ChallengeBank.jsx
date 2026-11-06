import { useMemo, useState } from 'react';
import { ArrowUpRight, Filter, LibraryBig, Search, X } from 'lucide-react';
import { courses, getCourse } from '../data/courses.js';
import { challengeCatalog, challengeLanguages, challengeTopics, difficultyOrder, filterChallenges, languageLabels } from '../data/challenges.js';
import { challengePath } from '../lib/routes.js';

export default function ChallengeBank({ filterCourse, onSelect, onBrowseCourse }) {
  const [query,setQuery]=useState('');
  const [difficulty,setDifficulty]=useState('all');
  const [topic,setTopic]=useState('all');
  const [language,setLanguage]=useState('all');
  const course=filterCourse||'all';
  const visible=useMemo(()=>filterChallenges({query,difficulty,topic,language,course}),[query,difficulty,topic,language,course]);
  const clear=()=>{setQuery('');setDifficulty('all');setTopic('all');setLanguage('all');onBrowseCourse(null);};
  return <div className="main-content challenge-bank-screen">
    <header className="challenge-bank-intro"><div className="eyebrow"><LibraryBig size={15}/> Shared programming practice</div>
      <h1>Challenge Bank</h1>
      <p>One problem library for every class. Choose Python, Java, JavaScript, or C# when solving—without duplicating problems across courses.</p>
      <div className="challenge-summary"><strong>{challengeCatalog.length}</strong> original challenges · <strong>4</strong> languages · <strong>1</strong> shared library</div>
    </header>
    <section className="challenge-filters surface-card" aria-label="Filter challenges">
      <div className="filter-title"><Filter size={17}/><strong>Find a challenge</strong><button type="button" className="filter-clear" onClick={clear}><X size={14}/> Clear filters</button></div>
      <div className="challenge-filter-grid">
        <label className="challenge-search-label">Search<span className="challenge-search"><Search size={16}/><input type="search" value={query} placeholder="Problem, skill, or topic" onChange={e=>setQuery(e.target.value)}/></span></label>
        <label>Course view<select value={course} onChange={e=>onBrowseCourse(e.target.value==='all'?null:e.target.value)}><option value="all">All courses</option>{courses.filter(c=>c.id!=='tsi-math').map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select></label>
        <label>Difficulty<select value={difficulty} onChange={e=>setDifficulty(e.target.value)}><option value="all">Any difficulty</option>{difficultyOrder.map(d=><option key={d} value={d}>{d}</option>)}</select></label>
        <label>Topic<select value={topic} onChange={e=>setTopic(e.target.value)}><option value="all">Any topic</option>{challengeTopics.map(t=><option key={t} value={t}>{t}</option>)}</select></label>
        <label>Language<select value={language} onChange={e=>setLanguage(e.target.value)}><option value="all">Any language</option>{challengeLanguages.map(l=><option key={l} value={l}>{languageLabels[l]}</option>)}</select></label>
      </div><p className="challenge-filter-note">Course matching is informational. Confirm students have learned the prerequisite skills before assigning problems.</p>
    </section>
    <div className="challenge-results-heading"><h2>Available challenges <span>({visible.length})</span></h2><span>Alphabetical order</span></div>
    {visible.length?<div className="challenge-card-grid">{visible.map(c=><a key={c.id} className="challenge-card surface-card" href={challengePath(c.id)}
      onClick={e=>{if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();onSelect(c.id);}}>
      <div className="challenge-card-top"><span className={'challenge-level level-'+c.difficulty.toLowerCase().replace(' ','-')}>{c.difficulty}</span><span className="challenge-points">{c.points} pts</span></div>
      <h3>{c.title}</h3><p>{c.summary}</p>
      <div className="challenge-tags">{c.tags.map(t=><span key={t}>{t}</span>)}</div>
      <div className="challenge-course-tags">{c.suggestedCourses.slice(0,3).map(id=><span title={getCourse(id)?.label} key={id}>{getCourse(id)?.short||id}</span>)}{c.suggestedCourses.length>3&&<span>+{c.suggestedCourses.length-3}</span>}</div>
      <span className="challenge-open">Open challenge <ArrowUpRight size={16}/></span>
    </a>)}</div>:<div className="challenge-empty surface-card"><h3>No matching challenges</h3><p>Try a broader topic or clear the filters.</p><button className="btn" onClick={clear}>Show all challenges</button></div>}
    <p className="hint challenge-bottom-note">Static student-facing content from the private Challenge Bank. Run, Check and Submit are simulated in the React design lab; no code is executed or graded.</p>
  </div>;
}
