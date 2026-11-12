// The React preview's browser-local, three-file web workspace.
// Curriculum sources are unchanged: one-file starters are split once, and
// the published project/lesson IDs and the original draft remain intact.
export const WEB_FILE_NAMES = Object.freeze(['index.html','styles.css','script.js']);
export const REACT_FILE_NAMES = Object.freeze(['index.html','styles.css','App.jsx']);
export const fileNamesFor = language => language === 'jsx' ? REACT_FILE_NAMES : WEB_FILE_NAMES;

const HTML_FOR_WIDGET = '<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <title>Robotics meetup</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <main class="event-card"><h1>Robotics meetup</h1><p>Thursday at 4 PM in the lab.</p><p>Attendees: <span id="count">0</span></p><button id="join">Join</button></main>\n  <script src="script.js" defer></script>\n</body>\n</html>';
const HTML_FOR_REACT = '<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <title>React meetup</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <div id="root"></div>\n  <script src="App.jsx" defer></script>\n</body>\n</html>';

export function fileLanguage(fileName) {
  if(fileName.endsWith('.html'))return 'html';
  if(fileName.endsWith('.css'))return 'css';
  if(fileName.endsWith('.jsx'))return 'jsx';
  return 'javascript';
}
export function initialFocus(language, focus='') {
  const normalized=String(focus).toLowerCase();
  if(language==='jsx'||normalized==='react')return 'App.jsx';
  if(language==='css'||/css|style|readable|responsive/.test(normalized))return 'styles.css';
  if(language==='javascript'||/\bjs\b|javascript|script|function|array|object|dom|event|state|team|matchup|pick|scor|leaderboard|test|integrat|interact/.test(normalized))return 'script.js';
  return 'index.html';
}
function ensureReferences(source, scriptName='script.js') {
  if(!source.trim())return '';
  let html=source;
  if(!/<link\b[^>]*href\s*=\s*["']styles\.css["'][^>]*>/i.test(html)) {
    const link='  <link rel="stylesheet" href="styles.css">\n';
    html=/<\/head\s*>/i.test(html) ? html.replace(/<\/head\s*>/i,link+'</head>') : link+html;
  }
  if(!html.includes('src="'+scriptName+'"') && !html.includes("src='"+scriptName+"'")) {
    const script='  <script src="'+scriptName+'" defer></script>\n';
    html=/<\/body\s*>/i.test(html) ? html.replace(/<\/body\s*>/i,script+'</body>') : html+'\n'+script;
  }
  return html;
}
/** Extract actual inline style and script blocks from the previous one-file starter/draft.
 * Leave scripts with src and non-JavaScript MIME types untouched.
 */
export function splitEmbeddedWebSource(source) {
  let html=String(source??'');
  const css=[],js=[];
  html=html.replace(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi,(_,body)=>{
    css.push(body.trim().replace(/^(?: {4}|\t)/gm,''));
    return '';
  });
  html=html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi,(match,attrs,body)=>{
    if(/\bsrc\s*=/.test(attrs)||/\btype\s*=\s*["'](?:application\/json|application\/ld\+json|importmap)["']/i.test(attrs))return match;
    js.push(body.trim().replace(/^(?: {4}|\t)/gm,''));
    return '';
  });
  return {
    'index.html':ensureReferences(html.replace(/\n{3,}/g,'\n\n').trim(), 'script.js'),
    'styles.css':css.join('\n\n'),
    'script.js':js.join('\n\n')
  };
}
export function lessonStarterFiles(language, starter) {
  const code=String(starter??'');
  if(language==='jsx')return {'index.html':HTML_FOR_REACT,'styles.css':'','App.jsx':code};
  if(language==='html')return splitEmbeddedWebSource(code);
  if(language==='css')return {'index.html':HTML_FOR_WIDGET,'styles.css':code,'script.js':''};
  if(language==='javascript')return {'index.html':HTML_FOR_WIDGET,'styles.css':'','script.js':code};
  throw Error('Not a web lesson: '+language);
}
export const projectStarterFiles = source => splitEmbeddedWebSource(source);
export function webDraftKey(base, filename) {
  if(![...WEB_FILE_NAMES,...REACT_FILE_NAMES].includes(filename))throw Error('Unknown workspace file');
  return base+':file:'+filename;
}
export function loadWebDrafts({base,starters,legacy,read,write}) {
  const names=Object.keys(starters);
  const saved=Object.fromEntries(names.map(file=>[file,read(webDraftKey(base,file))]));
  const hasSaved=names.some(file=>saved[file]!==null && saved[file]!==undefined);
  if(hasSaved)return Object.fromEntries(names.map(file=>[file,saved[file]??starters[file]??'']));
  const migrated=legacy!==null && legacy!==undefined
    ? (starters['App.jsx']!==undefined
      ? {...starters,'App.jsx':legacy}
      : (Object.prototype.hasOwnProperty.call(starters,'index.html') &&
        (starters['styles.css']||starters['script.js']) && /<html|<style|<script/i.test(legacy)
        ? splitEmbeddedWebSource(legacy)
        : starters['index.html']!==undefined && /<html|<!doctype|<body/i.test(legacy)
          ? splitEmbeddedWebSource(legacy)
          : {...starters,[starters['index.html']===HTML_FOR_WIDGET ? (starters['script.js']?'script.js':'styles.css'):'index.html']:legacy}))
    : starters;
  const result=Object.fromEntries(names.map(file=>[file,migrated[file]??starters[file]??'']));
  names.forEach(file=>write(webDraftKey(base,file),result[file]));
  return result;
}
function escInline(value,tag){return String(value??'').replace(new RegExp('</'+tag,'gi'),'<\\/'+tag)}
/** Assemble the real HTML, CSS and JS for an opaque-origin iframe.
 * The learner must keep link/script references in index.html to use those files.
 * The frame cannot fetch virtual files by URL, so substitute their contents here.
 */
export function assembleWebFiles(files,{scriptName='script.js',scriptOverride=null}={}) {
  let html=String(files?.['index.html']??'');
  const css=String(files?.['styles.css']??'');
  const js=scriptOverride===null?String(files?.[scriptName]??''):String(scriptOverride);
  let linkedStyle=false,linkedScript=false;
  html=html.replace(/<link\b[^>]*>/gi,tag=>{
    if(/\bhref\s*=\s*["'](?:\.\/)?styles\.css["']/i.test(tag) && /\brel\s*=\s*["']stylesheet["']/i.test(tag)){
      linkedStyle=true;return '<style data-web-file="styles.css">'+escInline(css,'style')+'</style>';
    }
    return tag;
  });
  html=html.replace(/<script\b([^>]*)>\s*<\/script\s*>/gi,(tag,attrs)=>{
    const match=/\bsrc\s*=\s*["']([^"']+)["']/i.exec(attrs);
    if(match && match[1].replace(/^\.\//,'')===scriptName){
      linkedScript=true;return '';
    }
    return tag;
  });
  if(linkedScript){
    const script='<script data-web-file="'+scriptName+'">'+escInline(js,'script')+'</script>';
    html=/<\/body\s*>/i.test(html)?html.replace(/<\/body\s*>/i,script+'\n</body>'):html+'\n'+script;
  }
  return {html,linkedStyle,linkedScript};
}
