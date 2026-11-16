import {useEffect,useState} from 'react';
import SectionTitle from '../components/ui/SectionTitle.jsx';
import Chip from '../components/ui/Chip.jsx';
import AccountsTab from '../components/teacher/AccountsTab.jsx';
import GoogleSheetRosterPanel from '../components/teacher/GoogleSheetRosterPanel.jsx';
import {useTeacherIdentity,identityForStudent} from '../lib/teacherIdentity.js';
import {activeMemberships,buildSheetIndex,normalizeGithub,rosterPeriodsForStudent} from '../lib/rosterPeriods.js';

const bridge='/playground/integration/teacher-bridge.js';
export default function AdminReadOnly(){
 const [service,setService]=useState(null);
 const [state,setState]=useState('loading');
 const [sort,setSort]=useState('last');
 const [sheetRows,setSheetRows]=useState([]),[refreshToken,setRefreshToken]=useState(0);
 useEffect(()=>{let active=true;import(/* @vite-ignore */bridge).then(m=>m.teacherReadOnlyClient()).then(client=>{if(active){setService(client);setState(client.status)}}).catch(()=>{if(active)setState('unavailable')});return()=>{active=false}},[]);
 const identity=useTeacherIdentity(service,refreshToken);
 const transientSheet=buildSheetIndex(sheetRows);
 const students=identity.directory.map(p=>{
  const memberships=activeMemberships(p.memberships||[]);
  const savedSheet=identity.sheet?.get(p.user_id);
  const loadedSheet=transientSheet.byGithub.get(normalizeGithub(p.github_account));
  const effectiveSheet=loadedSheet||savedSheet;
  const base=identityForStudent(identity,p);
  return {
   id:p.user_id,...base,
   sheetName:effectiveSheet?.name||base.sheetName||'',
   sections:memberships.map(m=>m.class_id),
   memberships,
   periods:rosterPeriodsForStudent(effectiveSheet?.periods||[],memberships),
   sheetMatched:Boolean(effectiveSheet),
   kind:p.kind||'student'
  };
 });
 return <div className="main-content teacher-screen admin-screen">
  <SectionTitle eyebrow="Global management · Connected integration" actions={<Chip>Teacher/Admin · Read only</Chip>}>Admin dashboard</SectionTitle>
  <p className="page-subtitle">Connected account management for the current sole teacher/admin account. This integration remains read only; no account records can be changed here.</p>
  {state==='loading'?<p role="status">Checking access…</p>:state!=='ready'?<p role="alert">{state==='signed-out'?'Sign in through the current Playground first.':'Account directory is unavailable or access was denied.'}</p>:identity.loading?<p role="status">Loading account directory…</p>:identity.error?<p role="alert">{identity.error}</p>:<>
   <GoogleSheetRosterPanel onRows={setSheetRows}/>
   <AccountsTab students={students} sort={sort} setSort={setSort} readOnlyMode
    onRefresh={()=>setRefreshToken(value=>value+1)}
    sheetDuplicateCount={transientSheet.duplicates.size}/>
  </>}
 </div>;
}
