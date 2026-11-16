import {useEffect,useState} from 'react';
import {BookOpen, ClipboardPenLine} from 'lucide-react';
import SectionTitle from '../components/ui/SectionTitle.jsx';
import Chip from '../components/ui/Chip.jsx';
import TeacherToolbar from '../components/teacher/TeacherToolbar.jsx';
import TeacherTabs from '../components/teacher/TeacherTabs.jsx';
import TeacherCurriculum from '../components/teacher/TeacherCurriculum.jsx';
import SectionBanner from '../components/teacher/SectionBanner.jsx';

const bridge='/playground/integration/teacher-bridge.js';
function weekLabel(start){
 const date=new Date(start+'T12:00:00Z');
 if(Number.isNaN(date.getTime()))return start;
 const end=new Date(date);end.setUTCDate(end.getUTCDate()+6);
 const fmt=new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',timeZone:'UTC'});
 return fmt.format(date)+' – '+fmt.format(end)+', '+end.getUTCFullYear();
}
function currentWeek(){
 const parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
 const date=new Date(parts.year+'-'+parts.month+'-'+parts.day+'T12:00:00Z');
 date.setUTCDate(date.getUTCDate()-(date.getUTCDay()+6)%7);
 return date.toISOString().slice(0,10);
}
export default function TeacherReadOnly(){
 const [service,setService]=useState(null),[state,setState]=useState('loading');
 const [sectionId,setSectionId]=useState(''),[tab,setTab]=useState('overview');
 const [snapshot,setSnapshot]=useState(null),[weekly,setWeekly]=useState(null);
 const [week,setWeek]=useState(currentWeek),[expanded,setExpanded]=useState(null),[history,setHistory]=useState(null),[error,setError]=useState('');
 useEffect(()=>{let active=true;import(/* @vite-ignore */bridge).then(m=>m.teacherReadOnlyClient()).then(s=>{
  if(!active)return;setService(s);setState(s.status);if(s.status==='ready')setSectionId(s.classes[0]?.id||'');
 }).catch(()=>{if(active)setState('unavailable')});return()=>{active=false}},[]);
 useEffect(()=>{if(!sectionId||service?.status!=='ready')return;let active=true;
  setSnapshot(null);setWeekly(null);setExpanded(null);setHistory(null);setError('');
  Promise.all([service.rpc('playground_teacher_snapshot',{p_class:sectionId}),service.rpc('playground_teacher_weekly_points',{p_class:sectionId})])
   .then(([s,w])=>{if(active){setSnapshot(s);setWeekly(w)}})
   .catch(()=>{if(active)setError('Could not load this section. No records were changed.')});
  return()=>{active=false};
 },[sectionId,service]);
 useEffect(()=>{if(!expanded||!sectionId||!service)return;let active=true;setHistory(null);
  service.rpc('playground_teacher_student_history',{p_class:sectionId,p_student:expanded})
   .then(h=>{if(active)setHistory(h)}).catch(()=>{if(active)setHistory({error:'Student history unavailable'})});
  return()=>{active=false};
 },[expanded,sectionId,service]);
 const section=service?.classes?.find(s=>s.id===sectionId);
 const approved=(snapshot?.roster||[]).filter(r=>r.status==='approved');
 const pending=(snapshot?.roster||[]).filter(r=>r.status==='pending');
 const weeks=[...new Set([week,...(weekly?.weeks||[]).map(w=>w.week_start)])].sort().reverse();
 const points=new Map((weekly?.weeks||[]).filter(w=>w.week_start===week).map(w=>[w.user_id,w]));
 const checks=new Map((snapshot?.checks||[]).map(r=>[r.user_id,r]));
 const students=approved.map(r=>({id:r.user_id,first:(r.display_name||r.github_account||'Student').split(' ')[0],
  last:(r.display_name||'').split(' ').slice(1).join(' '),github:r.github_account||'',sections:[sectionId]}));
 const selectedSection=section?{id:section.id,name:section.name,course:section.course_id,join_code:section.join_code}:null;
 return <div className="main-content teacher-screen">
  <SectionTitle eyebrow="Your classroom · Connected integration"
   actions={<Chip>Authorized teacher · Read only</Chip>}>Teacher dashboard</SectionTitle>
  <p className="page-subtitle">The original React dashboard layout, connected to your existing authorized class data. No student records can be changed here.</p>
  {state==='loading'?<p role="status">Checking your teacher session…</p>:
   state==='signed-out'?<p>Sign in through the <a href="/playground/">current Playground</a>, then return here.</p>:
   state==='forbidden'?<p role="alert">This account does not have teacher access.</p>:
   state!=='ready'?<p role="alert">Teacher data is unavailable.</p>:<>
    <TeacherToolbar sectionId={sectionId} sections={service.classes.map(s=>({id:s.id,name:s.name,course:s.course_id}))}
     onSectionChange={id=>{setSectionId(id);setExpanded(null)}} readOnlyMode />
    <TeacherTabs tab={tab} onChange={next=>{setTab(next);setExpanded(null)}} />
    {error?<p role="alert">{error}</p>:!snapshot||!weekly?<p role="status">Loading section information…</p>:<>
     {tab==='overview'&&<>
      <SectionBanner section={selectedSection} />
      <div className="stat-grid">
       <div className="stat-card"><strong>{approved.length}</strong><span>Enrolled students</span></div>
       <div className="stat-card"><strong>{pending.length}</strong><span>Pending enrollment requests</span></div>
       <div className="stat-card"><strong>{approved.reduce((n,r)=>n+(Number(points.get(r.user_id)?.points)||0),0)}</strong><span>Verified weekly points</span></div>
      </div>
      <section className="panel"><div className="section-heading"><div><h2>Weekly points</h2><p>Server-verified improvements · Monday–Sunday in Central Time</p></div>
       <label>Week <select value={week} onChange={e=>setWeek(e.target.value)}>{weeks.map(w=><option key={w} value={w}>{weekLabel(w)}</option>)}</select></label></div>
       <div className="overflow"><table className="data-table"><thead><tr><th>Student</th><th>Weekly points</th><th>Improved assignments</th></tr></thead>
        <tbody>{approved.map(r=><tr key={r.user_id}><th>{r.display_name||r.github_account||'Student'}</th><td><strong>{Number(points.get(r.user_id)?.points)||0}</strong></td><td>{Number(points.get(r.user_id)?.assignments)||0}</td></tr>)}</tbody></table></div>
      </section>
      <section className="panel"><div className="section-heading"><div><h2>Section roster & activity</h2><p>Select a student to expand verified submission history.</p></div></div>
       <div className="overflow"><table className="data-table roster-table"><thead><tr><th>Student</th><th>Activity signal</th><th>Current activity</th><th>Practice</th><th>Hand-ins</th></tr></thead><tbody>
       {approved.map(r=><FragmentRow key={r.user_id} row={r} expanded={expanded} setExpanded={setExpanded} history={history} checks={checks}/>)}
       </tbody></table></div>
      </section>
     </>}
     {tab==='curriculum'&&<><SectionBanner section={selectedSection} />
       {selectedSection?.course==='computer-science-1'?<TeacherCurriculum section={selectedSection} students={students} assignments={[]} readOnlyMode />:<section className="panel"><h2><BookOpen size={18}/> Curriculum</h2><p>Course-specific assignments will be connected after authorization and content verification.</p></section>}
     </>}
     {tab==='journals'&&<section className="panel"><div className="section-heading"><h2><ClipboardPenLine size={18}/> Weekly journal submissions</h2></div><p>Journal access will be connected to authorized section records. No fictional student submissions are shown.</p></section>}
    </>}
   </>}
 </div>;
}
function FragmentRow({row,expanded,setExpanded,history,checks}){
 const open=expanded===row.user_id;
 return <><tr className={open?'selected-row':''}><th><button className="student-name-button" aria-expanded={open} onClick={()=>setExpanded(open?null:row.user_id)}>{open?'⌄':'›'} {row.display_name||row.github_account||'Student'}</button><small>@{row.github_account||'—'}</small></th>
 <td><Chip>Not connected</Chip></td><td>—</td><td>{Number(checks.get(row.user_id)?.checks)||0} checks</td><td>View history</td></tr>
 {open&&<tr className="expansion-row"><td colSpan="5">{!history?<p>Loading verified history…</p>:history.error?<p role="alert">{history.error}</p>:
 <div><strong>Submission history</strong><div className="overflow"><table className="data-table"><thead><tr><th>Activity</th><th>Submitted</th><th>Verified grade</th></tr></thead><tbody>
 {(history.submissions||[]).map(s=><tr key={s.id}><td>{s.activity_id}</td><td>{new Date(s.submitted_at).toLocaleString()}</td><td>{s.grade_status==='graded'?s.points+' / '+s.possible:'Not graded'}</td></tr>)}
 </tbody></table></div></div>}</td></tr>}</>;
}
