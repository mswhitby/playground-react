export const normalizeGithub=value=>{
  const text=String(value||'').trim();
  const match=text.match(/^https?:\/\/(?:www\.)?github\.com\/([^/?#\s]+)\/?$/i);
  return (match?match[1]:text).replace(/^@/,'').trim().toLowerCase();
};
const periodNumber=value=>{
  const raw=String(value??'').trim();
  if(!/^\d{1,2}$/.test(raw))return null;
  return String(Number(raw));
};
export function periodFromSectionName(name){
  const match=String(name??'').match(/\bperiod\s*#?\s*(\d{1,2})\b/i);
  return match?periodNumber(match[1]):null;
}
export function activeMemberships(memberships=[]){
  return (Array.isArray(memberships)?memberships:[]).filter(m=>m.status==='approved'||m.status==='pending');
}
export function rosterPeriodsForStudent(sheetPeriods=[],memberships=[]){
  const periods=[
    ...(Array.isArray(sheetPeriods)?sheetPeriods:[]).map(periodNumber),
    ...activeMemberships(memberships).map(m=>periodFromSectionName(m.name))
  ];
  return [...new Set(periods.filter(Boolean))].sort((a,b)=>Number(a)-Number(b));
}
export function availableRosterPeriods(students=[]){
  return [...new Set((students||[]).flatMap(s=>Array.isArray(s.periods)?s.periods.map(periodNumber):[]).filter(Boolean))]
    .sort((a,b)=>Number(a)-Number(b));
}
export function buildSheetIndex(rows=[]){
  const byGithub=new Map(),duplicates=new Set();
  for(const row of Array.isArray(rows)?rows:[]){
    const github=normalizeGithub(row?.github);
    if(!github)continue;
    if(byGithub.has(github)){duplicates.add(github);byGithub.delete(github);}
    else if(!duplicates.has(github))byGithub.set(github,row);
  }
  return {byGithub,duplicates};
}
