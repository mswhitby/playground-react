/** Resolve historical activity IDs to a catalog lesson without rewriting grades. */
export function createLessonIdentityResolver(catalog) {
  const records=catalog?.lessonRecords||{};
  const aliases=new Map();
  for(const [key,row] of Object.entries(records)){
    const stable=row.stableId||row.id||key;
    for(const alias of [key,row.id,stable,...(row.legacyIds||[])].filter(Boolean)){
      if(aliases.has(alias)&&aliases.get(alias)!==key)throw Error('Ambiguous lesson alias: '+alias);
      aliases.set(alias,key);
    }
  }
  function resolve(activityId){
    const raw=String(activityId||'').trim();
    const stripped=raw.replace(/^(lesson|challenge|project):/,'');
    const key=aliases.get(raw)||aliases.get(stripped);
    return key?{key,record:records[key],stableId:records[key].stableId||key}:null;
  }
  return {resolve,canonicalId:(id)=>resolve(id)?.stableId||id,title:(id)=>resolve(id)?.record.title||null};
}
