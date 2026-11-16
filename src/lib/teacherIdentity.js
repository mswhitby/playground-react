import {useEffect,useState} from 'react';

const empty=()=>({teacher:new Map(),sheet:new Map(),directory:[],loading:true,error:''});
const normalizeGithub=value=>String(value||'').trim().replace(/^@/,'').toLowerCase();

export function buildTeacherIdentity(names=[],sheets=[],directory=[]){
 const teacher=new Map((Array.isArray(names)?names:[]).filter(n=>n.user_id&&n.display_name?.trim()).map(n=>[n.user_id,n.display_name.trim()]));
 const sheet=new Map((Array.isArray(sheets)?sheets:[]).filter(n=>n.user_id&&n.name?.trim()).map(n=>[n.user_id,n]));
 const people=Array.isArray(directory)?directory:[];
 const byId=new Map(people.filter(p=>p.user_id).map(p=>[p.user_id,p]));
 const byGithub=new Map(people.filter(p=>p.github_account).map(p=>[normalizeGithub(p.github_account),p]));
 return {teacher,sheet,directory:people,byId,byGithub,loading:false,error:''};
}
export function identityForStudent(identity,member){
 const userId=member.user_id||member.id;
 const person=identity.byId?.get(userId)||identity.byGithub?.get(normalizeGithub(member.github_account||member.github))||{};
 const resolvedId=person.user_id||userId;
 const github=member.github_account||person.github_account||member.github||'';
 const sheet=identity.sheet?.get(resolvedId);
 return {
  teacherName:identity.teacher?.get(resolvedId)||'',
  sheetName:sheet?.name||'',
  studentName:person.student_name||member.student_name||member.display_name||'',
  github
 };
}
export function useTeacherIdentity(service){
 const [identity,setIdentity]=useState(empty);
 useEffect(()=>{
  if(service?.status!=='ready'){setIdentity(empty());return}
  let active=true;
  Promise.all([
   service.rpc('playground_teacher_names'),
   service.rpc('playground_teacher_sheet_roster'),
   service.rpc('playground_teacher_directory')
  ]).then(([names,sheets,directory])=>{
   if(active)setIdentity(buildTeacherIdentity(names,sheets,directory));
  }).catch(()=>{
   if(active)setIdentity({...empty(),loading:false,error:'Names and account directory could not be loaded.'});
  });
  return()=>{active=false};
 },[service]);
 return identity;
}
