/**
 * Read-only CS1 integration probe. It reuses the existing Playground browser session
 * but NEVER creates a Supabase client, refreshes a token or mutates server state.
 * Use only in the opt-in production-integration build, not in the public design lab.
 */
const PROJECT_URL = 'https://lndzhmwvooqfrqcafhut.supabase.co';
const PUBLISHABLE_KEY = 'sb_publishable_o5PgBG-pF2GzPZxTv4oRmA_s0OeJ9OM';
const SESSION_KEY = 'playground-auth-v1';
const COURSE_ID = 'computer-science-1';

export function readExistingSession(storage, at=Date.now()) {
  let session;
  try { session = JSON.parse(storage?.getItem(SESSION_KEY) || 'null'); } catch { return {state:'signed-out'}; }
  if (!session?.access_token || typeof session.access_token !== 'string') return {state:'signed-out'};
  if (Number(session.expires_at) > 0 && Number(session.expires_at) * 1000 <= at)
    return {state:'expired'};
  return {state:'available',accessToken:session.access_token};
}

function urlFor(path, params={}) {
  const url = new URL(path, PROJECT_URL);
  for (const [key,value] of Object.entries(params)) url.searchParams.set(key,String(value));
  return url.toString();
}

async function readJson(path,params,token,fetchImpl,signal) {
  const response = await fetchImpl(urlFor(path,params),{
    method:'GET',signal,cache:'no-store',
    headers:{'Accept':'application/json','apikey':PUBLISHABLE_KEY,'Authorization':'Bearer '+token}
  });
  if (!response?.ok) throw new Error('Read-only account request failed (' + (response?.status || 'network') + ').');
  return response.json();
}

export function verifiedScore(grade) {
  if (grade?.status !== 'graded' || !['grader_tests','published_tests','teacher'].includes(grade.scope) ||
    !Number.isFinite(grade.points) || !Number.isFinite(grade.possible) ||
    grade.possible <= 0 || grade.points < 0 || grade.points > grade.possible) return null;
  return {points:grade.points,possible:grade.possible};
}

function centralDate(iso) {
  const at = new Date(iso);
  if (Number.isNaN(at.getTime())) return null;
  const parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{
    timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'
  }).formatToParts(at).filter(p=>p.type !== 'literal').map(p=>[p.type,p.value]));
  return parts.year+'-'+parts.month+'-'+parts.day;
}

export function mapVerifiedCs1History(submissions, gradeRows) {
  const bySubmission=new Map((gradeRows||[]).map(g=>[g.submission_id,g]));
  const best=new Map();
  const submitted=new Set();
  for(const row of submissions||[]) {
    if(row.course_id!==COURSE_ID || typeof row.activity_id!=='string' ||
       !/^(lesson|challenge):/.test(row.activity_id) || !row.id) continue;
    submitted.add(row.activity_id);
    const g=bySubmission.get(row.id),score=verifiedScore(g);
    if(!score)continue;
    const gradedAt=centralDate(g.graded_at || row.submitted_at);
    if(!gradedAt)continue;
    const result={id:row.activity_id,courseId:COURSE_ID,earned:score.points,
      possible:score.possible,gradedAt,submissionId:row.id};
    const old=best.get(row.activity_id);
    if(!old || result.earned > old.earned ||
        (result.earned===old.earned && result.gradedAt > old.gradedAt)) best.set(row.activity_id,result);
  }
  return {grades:[...best.values()],submittedActivities:[...submitted]};
}

export async function loadReadOnlyCs1({storage=(typeof window==='undefined'?null:window.localStorage),
  fetchImpl=fetch,at=Date.now(),signal}={}) {
  const session=readExistingSession(storage,at);
  if(session.state!=='available')return {status:session.state,grades:[],submittedActivities:[]};
  const token=session.accessToken;
  // Validate with Auth, not user-editable localStorage metadata, before querying user-owned rows.
  const user=await readJson('/auth/v1/user',{},token,fetchImpl,signal);
  if(typeof user?.id!=='string' || !user.id)throw Error('Could not verify the signed-in account.');
  const rows=[];
  for(let offset=0;offset<20000;offset+=200){
    const batch=await readJson('/rest/v1/playground_submissions',{
      select:'id,course_id,activity_id,submitted_at',
      user_id:'eq.'+user.id,course_id:'eq.'+COURSE_ID,
      order:'submitted_at.desc,id.desc',limit:200,offset
    },token,fetchImpl,signal);
    if(!Array.isArray(batch))throw Error('Invalid submission response.');
    rows.push(...batch);
    if(batch.length<200)break;
    if(offset===19800)throw Error('Submission history exceeds safe read limit.');
  }
  const grades=[];
  for(let offset=0;offset<rows.length;offset+=80){
    const ids=rows.slice(offset,offset+80).map(row=>row.id).filter(id=>typeof id==='string'&&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));
    if(!ids.length)continue;
    const batch=await readJson('/rest/v1/playground_grades',{
      select:'submission_id,status,points,possible,scope,graded_at',
      submission_id:'in.('+ids.join(',')+')'
    },token,fetchImpl,signal);
    if(!Array.isArray(batch))throw Error('Invalid grade response.');
    grades.push(...batch);
  }
  return {status:'connected',...mapVerifiedCs1History(rows,grades)};
}
