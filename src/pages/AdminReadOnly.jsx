import {useEffect,useState} from 'react';
import SectionTitle from '../components/ui/SectionTitle.jsx';
import Chip from '../components/ui/Chip.jsx';
import AccountsTab from '../components/teacher/AccountsTab.jsx';
import {useTeacherIdentity,identityForStudent} from '../lib/teacherIdentity.js';

const bridge='/playground/integration/teacher-bridge.js';
export default function AdminReadOnly(){
 const [service,setService]=useState(null);
 const [state,setState]=useState('loading');
 const [sort,setSort]=useState('last');
 useEffect(()=>{let active=true;import(/* @vite-ignore */bridge).then(m=>m.teacherReadOnlyClient()).then(client=>{if(active){setService(client);setState(client.status)}}).catch(()=>{if(active)setState('unavailable')});return()=>{active=false}},[]);
 const identity=useTeacherIdentity(service);
 const students=identity.directory.map(p=>({
  id:p.user_id,...identityForStudent(identity,p),
  sections:(p.memberships||[]).filter(m=>m.status==='approved').map(m=>m.class_id)
 }));
 return <div className="main-content teacher-screen admin-screen">
  <SectionTitle eyebrow="Global management · Connected integration" actions={<Chip>Authorized · Read only</Chip>}>Admin dashboard</SectionTitle>
  <p className="page-subtitle">Existing React account management layout with teacher-authorized account records. No changes can be made in this integration.</p>
  {state==='loading'?<p role="status">Checking access…</p>:state!=='ready'?<p role="alert">{state==='signed-out'?'Sign in through the current Playground first.':'Account directory is unavailable or access was denied.'}</p>:identity.loading?<p role="status">Loading account directory…</p>:identity.error?<p role="alert">{identity.error}</p>:<AccountsTab students={students} sort={sort} setSort={setSort} readOnlyMode/>}
 </div>;
}
