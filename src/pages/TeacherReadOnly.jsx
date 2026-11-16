import {useEffect,useState} from 'react';
import {BookOpen, ClipboardPenLine} from 'lucide-react';
import SectionTitle from '../components/ui/SectionTitle.jsx';
import Chip from '../components/ui/Chip.jsx';
import TeacherToolbar from '../components/teacher/TeacherToolbar.jsx';
import TeacherTabs from '../components/teacher/TeacherTabs.jsx';
import TeacherCurriculum from '../components/teacher/TeacherCurriculum.jsx';
import RosterPanel from '../components/teacher/RosterPanel.jsx';
import WeeklyPointsPanel from '../components/teacher/WeeklyPointsPanel.jsx';
import {getCourse} from '../data/courses.js';
import {getCourseLesson,normalizeImportedOutline} from '../lib/courseContent.js';
import {sortStudent} from '../lib/students.js';
import SectionBanner from '../components/teacher/SectionBanner.jsx';

const bridge='/playground/integration/teacher-bridge.js';
function titleFor(id,course=getCourse('computer-science-1')){
 const raw=String(id||'');
 const variants=[raw,raw.replace(/^lesson:/,''),raw.split('/').at(-1)];
 for(const key of variants){const lesson=getCourseLesson(course,key);if(lesson?.title)return lesson.title;}
 return raw.replace(/^(lesson|challenge|project):/,'').split('/').at(-1).replace(/^\\d+-/,'').replace(/[-_]/g,' ').replace(/\\b\\w/g,c=>c.toUpperCase());
}
function weekOf(value){if(!value||Number.isNaN(Date.parse(value)))return null;const p=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(value)).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));const d=new Date(p.year+'-'+p.month+'-'+p.day+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-(d.getUTCDay()+6)%7);return d.toISOString().slice(0,10)}
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
 const [snapshot,setSnapshot]=useState(null),[weekly,setWeekly]=useState(null),[catalog,setCatalog]=useState(null);
 const [week,setWeek]=useState(currentWeek),[sort,setSort]=useState('last'),[expanded,setExpanded]=useState(null),[history,setHistory]=useState(null),[error,setError]=useState('');
 useEffect(()=>{let active=true;fetch('/playground/data/computer-science-1/course.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('catalog');return r.json()}).then(data=>{if(active)setCatalog(normalizeImportedOutline(data))}).catch(()=>{});return()=>{active=false}},[]);
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
 const students=approved.map(r=>({
  id:r.user_id,studentName:r.display_name||r.github_account||'Student',github:r.github_account||'',sections:[sectionId],
  status:'Not connected',current:'—',weekly:Object.fromEntries((weekly?.weeks||[]).filter(w=>w.user_id===r.user_id).map(w=>[w.week_start,Number(w.points)||0])),
  weeklyAssignments:Object.fromEntries((weekly?.weeks||[]).filter(w=>w.user_id===r.user_id).map(w=>[w.week_start,Number(w.assignments)||0])),
  assignments:expanded===r.user_id&&history&&!history.error?toAssignments(history,catalog):[],
  practiceCount:Number(checks.get(r.user_id)?.checks)||0,
  handinCount:expanded===r.user_id&&history&&!history.error?(history.submissions||[]).length:null
 })).sort((a,b)=>sortStudent(a,b,sort));
 const selectedSection=section?{id:section.id,name:section.name,course:section.course_id,join_code:section.join_code}:null;
 return <div className="main-content teacher-screen">
  <SectionTitle eyebrow="Your classroom · Connected integration"
   actions={<Chip>Authorized teacher · Read only</Chip>}>Teacher dashboard</SectionTitle>
  <p className="page-subtitle">The original React dashboard layout, connected to your existing authorized class data. No student records can be changed here.</p>
  {state==='loading'?<p role="status">Checking your teacher session…</p>:
   state==='signed-out'?<p>Sign in through the <a href="/playground/">current Playground</a>, then return here.</p>:
   state==='forbidden'?<p role="alert">This account does not have teacher access.</p>:
   state!=='ready'?<p role="alert">Teacher data is unavailable.</p>:<>
    <TeacherToolbar sectionId={sectionId} sections={service.classes.map(s=>({id:s.id,name:s.name,course:s.course_id,join_code:s.join_code}))}
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
      <WeeklyPointsPanel students={students} week={week} setWeek={setWeek} readOnlyMode availableWeeks={weeks.map(w=>({key:w,label:weekLabel(w)}))} />
      <RosterPanel students={students} week={week} sort={sort} setSort={setSort} expanded={expanded} setExpanded={setExpanded} readOnlyMode historyLoading={Boolean(expanded&&!history)} />
     </>}
     {tab==='curriculum'&&<><SectionBanner section={selectedSection} />
       {selectedSection?.course==='computer-science-1'?<TeacherCurriculum section={selectedSection} students={students} assignments={[]} readOnlyMode />:<section className="panel"><h2><BookOpen size={18}/> Curriculum</h2><p>Course-specific assignments will be connected after authorization and content verification.</p></section>}
     </>}
     {tab==='journals'&&<section className="panel"><div className="section-heading"><h2><ClipboardPenLine size={18}/> Weekly journal submissions</h2></div><p>Journal access will be connected to authorized section records. No fictional student submissions are shown.</p></section>}
    </>}
   </>}
 </div>;
}
function toAssignments(history,catalog){
 const groups=new Map();
 for(const item of history.practice||[]){
  const id=item.activity_id;if(!id)continue;
  const row=groups.get(id)||{id,name:titleFor(id,catalog||getCourse('computer-science-1')),type:item.activity_kind||'Lesson',status:'Started',score:null,possible:null,submitted:'—'};
  if(item.status==='completed')row.status='Practice completed';
  else if(item.status==='needs_revision'&&row.status==='Started')row.status='Needs revision';
  row.submitted=item.updated_at||row.submitted;groups.set(id,row);
 }
 for(const sub of history.submissions||[]){
  const id=sub.activity_id;if(!id)continue;
  const row=groups.get(id)||{id,name:titleFor(id,catalog||getCourse('computer-science-1')),type:sub.activity_kind||'Lesson',status:'Submitted',score:null,possible:null,submitted:'—'};
  if(sub.grade_status==='graded'&&Number.isFinite(Number(sub.points))&&Number.isFinite(Number(sub.possible))){
   if(row.score===null||Number(sub.points)>row.score){row.score=Number(sub.points);row.possible=Number(sub.possible);}
   row.status='Completed';
  }else if(row.score===null)row.status='Submitted';
  if(!row.submitted||row.submitted==='—'||Date.parse(sub.submitted_at)>Date.parse(row.submitted))row.submitted=sub.submitted_at;
  groups.set(id,row);
 }
 for(const item of history.checks||[]){
  const id=item.activity_id;if(!id)continue;
  if(!groups.has(id))groups.set(id,{id,name:titleFor(id,catalog||getCourse('computer-science-1')),type:'Practice',status:'Started',score:null,possible:null,submitted:item.last_check||'—'});
 }
 return [...groups.values()].sort((a,b)=>Date.parse(b.submitted||0)-Date.parse(a.submitted||0)).map(r=>({...r,week:weekOf(r.submitted),submitted:r.submitted==='—'?'—':new Date(r.submitted).toLocaleDateString('en-US')}));
}
