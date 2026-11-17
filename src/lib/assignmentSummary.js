export function assignmentKind(entry={}) {
  const type=String(entry.type||entry.activity_kind||'').trim().toLowerCase();
  const id=String(entry.id||entry.activity_id||'').trim().toLowerCase();
  if(type.includes('challenge')||id.startsWith('challenge:'))return 'challenge';
  if(type.includes('lesson')||id.startsWith('lesson:'))return 'lesson';
  return 'other';
}

export function summarizeAssignments(entries=[]) {
  const empty=()=>({completed:0,graded:0,tracked:0,earned:0,possible:0});
  const summary={lessons:empty(),challenges:empty(),other:empty()};
  for(const entry of entries||[]){
    const kind=assignmentKind(entry);
    const bucket=kind==='lesson'?summary.lessons:kind==='challenge'?summary.challenges:summary.other;
    bucket.tracked++;
    if(entry.status==='Completed'||entry.status==='Practice completed')bucket.completed++;
    if(entry.score!==null&&entry.score!==undefined){
      bucket.graded++;
      const earned=Number(entry.score),possible=Number(entry.possible);
      if(Number.isFinite(earned))bucket.earned+=earned;
      if(Number.isFinite(possible))bucket.possible+=possible;
    }
  }
  return summary;
}
