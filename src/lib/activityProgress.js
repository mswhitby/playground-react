/** Separate lesson and challenge progress without changing stored activity IDs. */
export function activityKind(id, explicitKind='') {
 const kind=String(explicitKind).toLowerCase();
 if(kind==='lesson'||kind==='challenge')return kind;
 const raw=String(id||'');
 if(raw.startsWith('lesson:'))return 'lesson';
 if(raw.startsWith('challenge:'))return 'challenge';
 return null; // unprefixed legacy records require catalog lookup; never guess
}
export function splitActivityProgress({lessons=[],challenges=[],grades=[],completedLessons=[],completedChallenges=[]}={}) {
 const result={lessons:{available:lessons.length,completed:0,earned:0,possible:0,graded:0},
 challenges:{available:challenges.length,completed:0,earned:0,possible:0,graded:0}};
 const completed={lesson:new Set(completedLessons),challenge:new Set(completedChallenges)};
 const known={lesson:new Set(lessons.map(x=>typeof x==='string'?x:x.id)),
 challenge:new Set(challenges.map(x=>typeof x==='string'?x:x.id))};
 const best=new Map();
 for(const grade of grades){
  const raw=String(grade.activity_id||grade.id||'');
  const prefix=raw.match(/^(lesson|challenge):/);
  const id=prefix?raw.slice(prefix[0].length):raw;
  const kind=activityKind(raw,grade.activity_kind||grade.kind)||
   (known.lesson.has(id)&&!known.challenge.has(id)?'lesson':known.challenge.has(id)&&!known.lesson.has(id)?'challenge':null);
  if(!kind)continue;
  const key=kind+':'+id;
  const earned=Number(grade.earned??grade.points??0),possible=Number(grade.possible??0);
  if(!Number.isFinite(earned)||!Number.isFinite(possible))continue;
  const previous=best.get(key);
  if(!previous||earned>previous.earned)best.set(key,{kind,id,earned,possible});
 }
 for(const item of best.values()){
  const bucket=result[item.kind==='lesson'?'lessons':'challenges'];
  bucket.earned+=item.earned;bucket.possible+=item.possible;bucket.graded++;
  completed[item.kind].add(item.id);
 }
 result.lessons.completed=completed.lesson.size;
 result.challenges.completed=completed.challenge.size;
 return result;
}
