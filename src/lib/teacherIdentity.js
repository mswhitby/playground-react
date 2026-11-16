import {useEffect,useState} from 'react';

export function useTeacherIdentity(service){
 const [identity,setIdentity]=useState({teacher:new Map(),sheet:new Map(),directory:[],loading:true,error:''});
 useEffect(()=>{
  if(service?.status!=='ready')return;
  let active=true;
  Promise.all([
   service.rpc('playground_teacher_names'),
   service.rpc('playground_teacher_sheet_roster'),
   service.rpc('playground_teacher_directory')
  ]).then(([names,sheets,directory])=>{
   if(!active)return;
   setIdentity({
    teacher:new Map((names||[]).map(n=>[n.user_id,n.display_name])),
    sheet:new Map((sheets||[]).map(n=>[n.user_id,n])),
    directory:Array.isArray(directory)?directory:[],loading:false,error:''
   });
  }).catch(()=>{if(active)setIdentity({teacher:new Map(),sheet:new Map(),directory:[],loading:false,error:'Names and account directory could not be loaded.'})});
  return()=>{active=false};
 },[service]);
 return identity;
}
