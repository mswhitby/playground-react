import { normalizeImportedOutline } from './courseContent.js';

// The production Playground publishes STUDENT-SAFE curriculum files at this path.
// Same-origin relative requests work under /playground/preview/ without a CDN or credentials.
const ROOT = '/playground/data';
const PUBLISHED = new Set(['game-programming', 'mobile-app-dev', 'uil', 'tsi-math']);
function safePath(path) {
  if (typeof path !== 'string' || !path || path.startsWith('/') ||
      path.includes('\\') || path.includes('?') || path.includes('#') ||
      path.split('/').some(part => part === '..' || part === '.' || part === '')) {
    throw new Error('Invalid curriculum resource path');
  }
  return path;
}
export function publicResourceUrl(courseId, path) {
  if (!PUBLISHED.has(courseId)) throw new Error('Unknown published course');
  return ROOT + '/' + courseId + '/' + safePath(path);
}
async function request(courseId, path, fetchImpl, signal, json = false) {
  const response = await fetchImpl(publicResourceUrl(courseId, path), {signal, cache:'no-store'});
  if (!response.ok) throw new Error('Published ' + courseId + ' resource unavailable: ' + path);
  return json ? response.json() : response.text();
}
function publishedLesson(row, markdownSource, starter, language, courseId) {
  return {
    ...row,
    markdownSource, starter: starter ?? '', language,
    markdownUrl: publicResourceUrl(courseId,row.markdown),
    kind: 'Lesson',
    challenge: row.exercise?.prompt || row.summary || row.objective || row.title || '',
    points: row.points ?? null,
    cases: row.exercise?.examples || row.cases || [],
    hints: row.exercise?.hints || row.hints || [],
    mode: row.exercise ? 'function' : 'script'
  };
}
async function gameCourse(fetchImpl, signal) {
  const id = 'game-programming';
  const manifest = await request(id,'course.json',fetchImpl,signal,true);
  const units = await Promise.all(manifest.units.map(async unit => ({
    id:unit.id, number:unit.number, title:unit.title, description:unit.summary || '',
    lessons:await Promise.all(unit.lessons.map(async row => {
      const markdownSource = await request(id,row.markdown,fetchImpl,signal);
      const lesson = publishedLesson(row,markdownSource,row.exercise?.starter,'csharp',id);
      return {...lesson, starter:row.exercise?.starter || '', kind:'Lesson', exerciseId:row.exercise?.id,
        challenge:row.exercise?.prompt || row.title, unityTask:row.unityTask || [],
        markdownSource:markdownSource + (row.unityTask?.length
          ? '\n\n### Unity activity\n' + row.unityTask.map(task=>'- '+task).join('\n') : '')};
    }))
  })));
  return {...normalizeImportedOutline({units}), source:'published', projects:[]};
}
async function mobileCourse(fetchImpl, signal) {
  const id='mobile-app-dev';
  const manifest=await request(id,'course.json',fetchImpl,signal,true);
  const lessons=await Promise.all(manifest.lessons.map(async row => {
    const [markdownSource,starter]=await Promise.all([
      request(id,row.markdown,fetchImpl,signal),request(id,row.starterFile,fetchImpl,signal)
    ]);
    return publishedLesson(row,markdownSource,starter,row.language==='react'?'jsx':row.language,id);
  }));
  const projects=await Promise.all((manifest.projects||[]).map(async project => {
    // Finished examples are deliberately NOT loaded into the preview.
    const starter=await request(id,project.starterFile,fetchImpl,signal);
    const steps=await Promise.all(project.steps.map(async step => ({
      ...step,
      // Honor the published focus so the matching file tab is prominent on each step.
      focus:step.focus||step.title,
      markdownSource:await request(id,step.markdown,fetchImpl,signal),
      markdownUrl:publicResourceUrl(id,step.markdown),
    })));
    return {id:project.id,title:project.title,summary:project.summary,skills:project.skills||[],
      starter,language:'html',steps};
  }));
  return {...normalizeImportedOutline({lessons}),projects,source:'published'};
}
async function uilCourse(fetchImpl, signal) {
  const id='uil';
  const manifest=await request(id,'course.json',fetchImpl,signal,true);
  const written=await request(id,manifest.written.markdown,fetchImpl,signal);
  const questions=await request(id,manifest.written.practice,fetchImpl,signal,true);
  // Public question prompts/options only; never append keys or explanations to student copy.
  const questionList=Array.isArray(questions) ? questions : (questions.questions || []);
  const questionsMarkdown=questionList.map((item,i)=>{
    const options=item.choices || item.options || [];
    return '### Practice question '+(i+1)+'\n\n'+String(item.prompt||item.question||'')+
      '\n\n'+options.map((choice,index)=>String.fromCharCode(65+index)+'. '+choice).join('\n\n');
  }).join('\n\n');
  const writtenLesson={id:'written',title:'Written practice',language:'text',
    markdown:manifest.written.markdown,markdownSource:written+'\n\n## Published practice questions\n\n'+questionsMarkdown,
    markdownUrl:publicResourceUrl(id,manifest.written.markdown),
    starter:'',kind:'Practice',challenge:'Review Java reasoning and the published written-practice questions.'};
  const programming=await Promise.all(manifest.lessons.map(async row=>{
    const [markdownSource,starter]=await Promise.all([
      request(id,row.markdown,fetchImpl,signal),request(id,row.starterFile,fetchImpl,signal)
    ]);
    return publishedLesson(row,markdownSource,starter,'java',id);
  }));
  const units=[
    {id:'written-preparation',number:1,title:'Written preparation',lessons:[writtenLesson]},
    {id:'programming-practice',number:2,title:'Java programming practice',lessons:programming}
  ];
  return {...normalizeImportedOutline({units}),source:'published',projects:[]};
}
async function tsiCourse(fetchImpl,signal) {
  const id='tsi-math';
  const [plan, draft, diagnostic, locator] = await Promise.all([
    request(id,'content/20-day-program.json',fetchImpl,signal,true),
    request(id,'content/strand-lessons-v1.json',fetchImpl,signal,true),
    request(id,'content/diagnostic-24-mc-v2.json',fetchImpl,signal,true),
    request(id,'content/math-locator-profiles.json',fetchImpl,signal,true)
  ]);
  // Keep original 20-day IDs and explicit unpublished placeholders.
  const schedule=(plan.days||[]).map(day=>({
    id:day.id,title:day.title,challenge:'Day '+day.day+' · '+day.strand+' · 30 minutes',
    kind:'Planned session',language:'text',starter:'',ready:false,
    status:'planned'
  }));
  const strands=await Promise.all((draft.lessons||[]).map(async row=>({
    id:row.id,title:row.title,kind:'Draft practice',status:'draft',language:'text',
    markdown:row.student_lesson,
    markdownUrl:publicResourceUrl(id,row.student_lesson),
    markdownSource:await request(id,row.student_lesson,fetchImpl,signal),
    starter:'',challenge:'Currently authored draft lesson · '+row.minutes+' minutes',
  })));
  return {...normalizeImportedOutline({units:[
    {id:'study-schedule',number:1,title:'20-day study schedule (in development)',lessons:schedule},
    {id:'authored-strands',number:2,title:'Available draft strand lessons',lessons:strands}
  ]}),source:'published-draft',projects:[],tsiDraft:true,
    diagnosticItems:diagnostic.items||[],locatorProfiles:locator.profiles||[]};
}
/**
 * Reads only student-facing content already published by the main Playground.
 * Missing resources fail closed: never silently substitute fictional lesson text.
 */
export async function loadPublishedCourse(courseId, {fetchImpl=fetch,signal}={}) {
  if (courseId==='game-programming') return gameCourse(fetchImpl,signal);
  if (courseId==='mobile-app-dev') return mobileCourse(fetchImpl,signal);
  if (courseId==='uil') return uilCourse(fetchImpl,signal);
  if (courseId==='tsi-math') return tsiCourse(fetchImpl,signal);
  throw new Error('Unknown published course');
}
