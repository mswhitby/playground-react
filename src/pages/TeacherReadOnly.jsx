import {useEffect,useState} from 'react';
import SectionTitle from '../components/ui/SectionTitle.jsx';
const bridge='/playground/integration/teacher-bridge.js';
const weekStart=()=>{const d=new Date();const p=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(d).filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));const day=new Date(p.year+'-'+p.month+'-'+p.day+'T12:00:00Z');day.setUTCDate(day.getUTCDate()-(day.getUTCDay()+6)%7);return day.toISOString().slice(0,10)};
export default function TeacherReadOnly(){
 const [service,setService]=useState(null),[state,setState]=useState('loading');
 const [section,setSection]=useState(''),[snapshot,setSnapshot]=useState(null),[weekly,setWeekly]=useState(null);
 const [week,setWeek]=useState(weekStart),[student,setStudent]=useState(null),[history,setHistory]=useState(null);
 const [error,setError]=useState('');
 useEffect(()=>{let alive=true;import(/* @vite-ignore */bridge).then(m=>m.teacherReadOnlyClient()).then(s=>{if(!alive)return;setService(s);setState(s.status);if(s.status==='ready')setSection(s.classes[0]?.id||'')}).catch(()=>{if(alive)setState('unavailable')});return()=>{alive=false}},[]);
 useEffect(()=>{if(!section||service?.status!=='ready')return;let alive=true;setSnapshot(null);setWeekly(null);setStudent(null);setHistory(null);setError('');Promise.all([
  service.rpc('playground_teacher_snapshot',{p_class:section}),
  service.rpc('playground_teacher_weekly_points',{p_class:section})
 ]).then(([s,w])=>{if(alive){setSnapshot(s);setWeekly(w)}}).catch(()=>{if(alive)setError('Section data could not be loaded. No records were changed.')});return()=>{alive=false}},[section,service]);
 useEffect(()=>{if(!student||!section||!service)return;let alive=true;setHistory(null);service.rpc('playground_teacher_student_history',{p_class:section,p_student:student})
 .then(h=>{if(alive)setHistory(h)}).catch(()=>{if(alive)setHistory({error:'History unavailable'})});return()=>{alive=false}},[student,section,service]);
 const approved=(snapshot?.roster||[]).filter(r=>r.status==='approved');
 const pending=(snapshot?.roster||[]).filter(r=>r.status==='pending');
 const weeks=[...new Set([week,...(weekly?.weeks||[]).map(x=>x.week_start)])].sort().reverse();
 const points=new Map((weekly?.weeks||[]).filter(x=>x.week_start===week).map(x=>[x.user_id,x]));
 const checks=new Map((snapshot?.checks||[]).map(x=>[x.user_id,x]));
 return <div className="main-content teacher-screen">
  <SectionTitle eyebrow="Authorized teacher · Read-only integration">Teacher dashboard</SectionTitle>
  <p className="page-subtitle">Existing sections, verified weekly points and student assignment history. No approvals, assignments, edits or student data changes are enabled.</p>
  {state==='loading'?<p role="status">Checking your existing teacher session…</p>
   :state==='signed-out'?<p>Sign in through the <a href="/playground/">current Playground</a>, then return here.</p>
   :state==='forbidden'?<p role="alert">This account does not have teacher access.</p>
   :state!=='ready'?<p role="alert">Teacher data is unavailable. Please try again later.</p>
   :<><div className="surface-card" style={{padding:20,marginBottom:18}}>
    <label>Class section <select value={section} onChange={e=>setSection(e.target.value)}>
      {service.classes.map(c=><option key={c.id} value={c.id}>{c.name} · {c.course_id}</option>)}
    </select></label>
    <label style={{marginLeft:16}}>Week <select value={week} onChange={e=>setWeek(e.target.value)}>{weeks.map(w=><option key={w} value={w}>{w}</option>)}</select></label>
   </div>
   {error?<p role="alert">{error}</p>:!snapshot||!weekly?<p role="status">Loading authorized section information…</p>:<>
    <div className="progress-grid">
     <div className="stat"><strong>{approved.length}</strong><span>Enrolled students</span></div>
     <div className="stat"><strong>{pending.length}</strong><span>Pending requests · view only</span></div>
     <div className="stat"><strong>{approved.reduce((total,r)=>total+(Number(points.get(r.user_id)?.points)||0),0)}</strong><span>Verified points this week</span></div>
    </div>
    <section className="surface-card" style={{padding:20,marginTop:18}}>
     <h2>Section roster and verified scores</h2>
     <p>Weekly points count only improvements on server-graded submissions. Practice checks do not earn points.</p>
     <div className="teacher-table-wrap"><table className="teacher-table"><thead><tr><th>Student</th><th>GitHub</th><th>Practice checks</th><th>Weekly points</th><th>Improved assignments</th></tr></thead><tbody>
     {approved.map(r=><tr key={r.user_id}><th scope="row"><button className="teacher-student-name" onClick={()=>setStudent(s=>s===r.user_id?null:r.user_id)}>{r.display_name||r.github_account||'Student'}</button></th><td>{r.github_account||'—'}</td><td>{Number(checks.get(r.user_id)?.checks)||0}</td><td>{Number(points.get(r.user_id)?.points)||0}</td><td>{Number(points.get(r.user_id)?.assignments)||0}</td></tr>)}
     </tbody></table></div>
    </section>
    {student&&<section className="surface-card" style={{padding:20,marginTop:18}}><h2>Assignment history</h2>
      {!history?<p role="status">Loading history…</p>:history.error?<p role="alert">{history.error}</p>:<><p>{(history.submissions||[]).length} saved hand-ins · {(history.checks||[]).reduce((n,r)=>n+(Number(r.checks)||0),0)} practice checks</p>
       <div className="teacher-table-wrap"><table className="teacher-table"><thead><tr><th>Activity</th><th>Submitted</th><th>Verified grade</th></tr></thead><tbody>{(history.submissions||[]).map(r=><tr key={r.id}><td>{r.activity_id}</td><td>{new Date(r.submitted_at).toLocaleString()}</td><td>{r.grade_status==='graded'?r.points+' / '+r.possible:'Not graded'}</td></tr>)}</tbody></table></div>
      </>}
    </section>}
   </>}
   </>}
 </div>
}
