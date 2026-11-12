// Reuse the production Playground's public browser runtimes from the same origin.
// Static imports would attempt to bundle the multi-megabyte compiler assets.
// These modules execute students' code in workers, not in the React app.
const source='/playground/';
export async function createLanguageRunner(language,onStatus=()=>{}) {
  if(language==='python') {
    const {PythonRunner}=await import('./pythonRunner.js');
    return {kind:'python',instance:new PythonRunner({onStatus})};
  }
  if(language==='java') {
    const {JavaRunner}=await import(/* @vite-ignore */ source+'java-runner.mjs');
    return {kind:'java',instance:new JavaRunner(onStatus)};
  }
  if(language==='csharp') {
    const [{CSharpRunner},protocol]=await Promise.all([
      import(/* @vite-ignore */ source+'csharp-runner.mjs'),
      import(/* @vite-ignore */ source+'csharp-protocol.mjs'),
    ]);
    return {kind:'csharp',instance:new CSharpRunner({onStatus}),protocol};
  }
  throw Error('No code compiler for '+language);
}

export function csharpClassName(code) {
  return /\b(?:public\s+)?(?:static\s+)?class\s+([A-Za-z_]\w*)/.exec(String(code||''))?.[1] || '';
}
const consoleFixture='<main class="event-card"><h1>Robotics meetup</h1><p>Thursday at 4 PM in the lab.</p><p>Attendees: <span id="count">0</span></p><button id="join">Join</button></main>';
const safeScript = value=>JSON.stringify(String(value)).replace(/</g,'\\u003c');
const scriptTag = value=>'<script>'+String(value).replace(/<\\/script/gi,'<\\\\/script')+'<\\/script>';
function rulesForLesson(lesson) {
  if(lesson==='html')return `(()=>{
   const rows=[{label:'Heading',pass:!!document.querySelector('h1')?.textContent.trim()},
     {label:'Meeting details',pass:!!document.querySelector('p')?.textContent.trim()},
     {label:'Working link',pass:!!document.querySelector('a[href]')}];
   send('checks',{results:rows});
  })();`;
  if(lesson==='css')return `(()=>{
   const card=document.querySelector('.event-card'),s=card&&getComputedStyle(card);
   const rows=[{label:'Visible padding',pass:!!s&&parseFloat(s.paddingTop)>0},
     {label:'Maximum width',pass:!!s&&s.maxWidth!=='none'},
     {label:'Visible border',pass:!!s&&parseFloat(s.borderTopWidth)>0},
     {label:'Background color',pass:!!s&&s.backgroundColor!=='rgba(0, 0, 0, 0)'}];
   send('checks',{results:rows});
  })();`;
  return `(()=>{
   const button=document.querySelector('#join'),count=document.querySelector('#count');
   if(!button||!count){send('checks',{results:[{label:'Join button and attendee count',pass:false}]});return;}
   const before=Number(count.textContent);
   button.click();
   setTimeout(()=>send('checks',{results:[{label:'Join increments the attendee count',pass:Number(count.textContent)===before+1}]}),150);
  })();`;
}
function challengeJavascript(source,task,check) {
  const rows=(task.challengeExamples||[]).slice(0,check?undefined:1);
  if(!rows.length)throw Error('No public challenge examples were published.');
  const name=/\b(?:export\s+)?function\s+([\w$]+)\s*\(/.exec(source)?.[1];
  if(!name)throw Error('Define and export the challenge function.');
  const javascript=String(source).replace(/\bexport\s+(?=(?:async\s+)?function|const|let|class)/g,'');
  return `(()=>{
    const cases=${JSON.stringify(rows)};
    const results=[];
    try{
      const fn=new Function(${safeScript(javascript+'; return '+name+';')})();
      for(const row of cases){
        try{
          const got=fn(...row.input);
          const expected=row.expected;
          const pass=JSON.stringify(got)===JSON.stringify(expected);
          results.push({label:${safeScript(name)}+'('+row.input.map(x=>JSON.stringify(x)).join(', ')+')',
            expected:JSON.stringify(expected),received:JSON.stringify(got),pass});
        }catch(e){results.push({label:${safeScript(name)}+'(...)',expected:JSON.stringify(row.expected),
          received:'',error:e.name+': '+e.message,pass:false});}
      }
      send('checks',{results});
    }catch(e){send('error',{text:e.name+': '+e.message});}
  })();`;
}
function bridgeScript(bridge) {
  return '<script>'+bridge.replace(/<\/script/gi,'<\\/script')+'<\/script>';
}
export async function browserPreviewSource({code,language,lessonId,task={},token,check=true}) {
  if(!token)throw Error('A preview token is required.');
  if(task.projectId) {
    const {buildProjectPreview}=await import(/* @vite-ignore */ source+'project-preview.mjs');
    return buildProjectPreview(code,{token,step:task.stepId,projectId:task.projectId,check});
  }
  const {previewConsoleBridge}=await import(/* @vite-ignore */ source+'console-drawer.mjs');
  const bridge=bridgeScript(previewConsoleBridge(token));
  const encode=safeScript;
  let body='',javascript='',runtime='';
  if(task.isChallenge && language==='javascript'){
    body='<main><h2>JavaScript challenge</h2><p>See the Checks and Console tabs for actual function results.</p></main>';
    javascript=challengeJavascript(code,task,check);
  }else if(language==='html')body=String(code);
  else if(language==='css')body='<style>'+String(code).replace(/<\/style/gi,'')+'</style>'+consoleFixture;
  else if(language==='javascript'){body=consoleFixture;javascript=code;}
  else if(language==='jsx') {
    body='<div id="root"></div>';
    if(typeof window.PlaygroundJSX!=='function') {
      await new Promise((resolve,reject)=>{
        const element=document.createElement('script');element.src=source+'vendor/learning/jsx.js';
        element.onload=resolve;element.onerror=()=>reject(Error('React JSX compiler could not load.'));
        document.head.append(element);
      });
    }
    javascript=window.PlaygroundJSX(code);
    runtime='<script src="'+source+'vendor/learning/react.js"><\/script>';
  }else throw Error('Preview is not supported for '+language);
  const checkScript=task.isChallenge&&language==='javascript'?'':rulesForLesson(lessonId);
  const end=task.isChallenge&&language==='javascript'
    ? '<script>try{'+javascript+';send("ready");}catch(e){send("error",{text:e.name+": "+e.message})}<\/script>'
    : '<script>try{(0,eval)('+encode(javascript)+');setTimeout(()=>{send("ready");'+(check?checkScript:'')+'},180)}catch(e){send("error",{text:e.name+": "+e.message})}<\/script>';
  // The sandboxed frame has a unique opaque origin; it cannot read Playground
  // cookies, DOM or localStorage. Neither Run nor Check sends work to a grader.
  const head='<meta charset="utf-8">'+
    '<meta http-equiv="Content-Security-Policy" content="form-action &apos;none&apos;">'+
    '<style>body{font:16px/1.55 system-ui,sans-serif;padding:16px}button{padding:8px 15px}</style>'+bridge+runtime;
  if(language==='html') {
    const documentSource=String(body).replace(/^\s*<!doctype[^>]*>/i,'');
    const initial=/<head(?:\s[^>]*)?>/i.test(documentSource)
      ? documentSource.replace(/<head(?:\s[^>]*)?>/i,m=>m+head)
      : '<head>'+head+'</head>'+documentSource;
    return '<!doctype html>'+initial+end;
  }
  return '<!doctype html><html><head>'+head+'</head><body>'+body+end+'</body></html>';
}
