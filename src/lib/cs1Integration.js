// This bridge is built from the canonical mswhitby/playground source, not from
// the React design lab. VITE_READONLY_INTEGRATION enables it only in an isolated build.
export const cs1IntegrationMode = import.meta.env?.VITE_READONLY_INTEGRATION === 'true';

export async function loadCs1ReadOnlyAccount(){
  if(!cs1IntegrationMode)return {status:'disabled',grades:[],weeklyPoints:[]};
  const bridgeUrl = '/playground/integration/' + 'account-bridge.js';
  const {readOnlyCs1Snapshot}=await import(/* @vite-ignore */ bridgeUrl);
  return readOnlyCs1Snapshot();
}


const CS1_CATALOG_URL='/playground/integration/data/computer-science-1/course.json';

export async function loadCs1PublishedCatalog({fetchImpl=fetch,signal}={}){
  if(!cs1IntegrationMode)return null;
  const response=await fetchImpl(CS1_CATALOG_URL,{signal,cache:'no-store'});
  if(!response.ok)throw new Error('Published Computer Science I catalog is unavailable.');
  return response.json();
}

export function applyCs1PublishedMetadata(course,catalog){
  if(!course||!Array.isArray(catalog?.lessons))return course;
  const metadata=new Map(catalog.lessons.filter(row=>row?.id).map(row=>[row.id,row]));
  const lessonRecords=Object.fromEntries(Object.entries(course.lessonRecords||{}).map(([id,record])=>[
    id,{...record,...(metadata.get(id)||{}),id}
  ]));
  const units=(course.units||[]).map(unit=>{
    const firstId=(unit.lessons||[])[0];
    const row=metadata.get(firstId);
    return {...unit,title:row?.unitName||unit.title};
  });
  return {...course,units,lessonRecords,publishedContent:true};
}
