import { weekStart } from './journals.js';

const dayParts = new Intl.DateTimeFormat('en-US', {
  timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'
});

export function centralDate(at = new Date()) {
  const values = Object.fromEntries(dayParts.formatToParts(at)
    .filter(part => part.type !== 'literal').map(part => [part.type,part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function dueLabel(value) {
  if (!value) return '';
  return new Date(value+'T12:00:00Z').toLocaleDateString('en-US',{
    month:'short',day:'numeric',year:'numeric',timeZone:'UTC'
  });
}

export function gradeFor(id,grades=[]) {
  return grades.find(record => record.id === id) || null;
}

export function dueFor(id,assignments=[]) {
  return assignments.find(record => record.id === id) || null;
}

export function statusFor(id,{assignments=[],grades=[],completedLessons=[],today=centralDate()}={}) {
  const assignment=dueFor(id,assignments);
  const grade=gradeFor(id,grades);
  const marked=id.startsWith('lesson:') && completedLessons.includes(id.slice('lesson:'.length));
  const completed=Boolean(grade)||marked;
  if (!assignment?.dueDate) return {state:completed?'completed':'unassigned',dueDate:null,grade,completed};
  return {state:completed?'completed':assignment.dueDate<today?'overdue':'assigned',
    dueDate:assignment.dueDate,grade,completed};
}

export function gradeTotals(records=[]) {
  const earned=records.reduce((sum,x)=>sum+x.earned,0);
  const possible=records.reduce((sum,x)=>sum+x.possible,0);
  return {earned,possible,percent:possible?Math.round(100*earned/possible):null,count:records.length};
}

export function weeklyGrades(grades=[]) {
  const grouped=new Map();
  grades.forEach(record=>{
    const week=weekStart(new Date(record.gradedAt+'T12:00:00Z'));
    if(!grouped.has(week))grouped.set(week,[]);
    grouped.get(week).push(record);
  });
  return [...grouped.entries()].map(([week,records])=>({week,...gradeTotals(records)}))
    .sort((a,b)=>b.week.localeCompare(a.week));
}

export function completionIds(completedLessons=[],grades=[]) {
  return [...new Set([...(Array.isArray(completedLessons)?completedLessons:[]),
    ...grades.filter(g=>g.id.startsWith('lesson:')).map(g=>g.id.slice('lesson:'.length))])];
}
