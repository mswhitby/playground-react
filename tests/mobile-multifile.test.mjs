import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
  fileNamesFor,fileLanguage,initialFocus,lessonStarterFiles,projectStarterFiles,
  loadWebDrafts,webDraftKey,assembleWebFiles,splitEmbeddedWebSource
} from '../src/lib/webFiles.js';

const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');

test('each HTML/CSS/JS/React lesson has three independent source files',()=>{
  const html=lessonStarterFiles('html','<!doctype html><html><head></head><body><h1>News</h1></body></html>');
  const css=lessonStarterFiles('css','main { display:grid; }');
  const js=lessonStarterFiles('javascript','document.querySelector("button").click();');
  const react=lessonStarterFiles('jsx','ReactDOM.createRoot(document.querySelector("#root")).render(<App/>);');
  assert.deepEqual(Object.keys(html),fileNamesFor('html'));
  assert.deepEqual(Object.keys(js),fileNamesFor('javascript'));
  assert.deepEqual(Object.keys(react),fileNamesFor('jsx'));
  assert.match(html['index.html'],/href="styles.css"/);
  assert.match(html['index.html'],/src="script.js"/);
  assert.equal(css['styles.css'],'main { display:grid; }');
  assert.equal(js['script.js'],'document.querySelector("button").click();');
  assert.match(react['index.html'],/src="App.jsx"/);
  assert.equal(react['App.jsx'].includes('ReactDOM.createRoot'),true);
  assert.equal(fileLanguage('styles.css'),'css');
  assert.equal(fileLanguage('App.jsx'),'jsx');
  assert.equal(initialFocus('html','CSS layout'),'styles.css');
  assert.equal(initialFocus('html','JavaScript interactions'),'script.js');
  assert.equal(initialFocus('jsx'),'App.jsx');
});

test('legacy inline style/script are extracted to separate files without discarding HTML or JS template literals',()=>{
  const legacy=`<!doctype html><html><head><title>Club</title><style>.event { padding:20px; }</style></head>
  <body><section class="event"><h1>Robotics</h1></section><script>
  const text = \`Welcome, \${"Avery"}!\`;
  document.querySelector('.event').setAttribute('data-ready', text);
  </script></body></html>`;
  const files=projectStarterFiles(legacy);
  assert.match(files['index.html'],/<h1>Robotics<\/h1>/);
  assert.match(files['index.html'],/href="styles.css"/);
  assert.match(files['index.html'],/src="script.js"/);
  assert.doesNotMatch(files['index.html'],/<style>|const text/);
  assert.match(files['styles.css'],/padding:20px/);
  assert.match(files['script.js'],/setAttribute/);
  assert.match(files['script.js'],/Welcome/);
  const frame=assembleWebFiles(files);
  assert.equal(frame.linkedStyle,true);
  assert.equal(frame.linkedScript,true);
  assert.match(frame.html,/data-web-file="styles.css"/);
  assert.match(frame.html,/data-web-file="script.js"/);
  assert.match(frame.html,/const text/);
});

test('referencing the CSS and JS files determines whether those files execute',()=>{
  const files=lessonStarterFiles('javascript','document.querySelector("#join").textContent = "Joined";');
  const combined=assembleWebFiles({...files,'styles.css':'body { color: red; }'});
  assert.match(combined.html,/body \{ color: red; \}/);
  assert.match(combined.html,/document.querySelector/);
  const noLinks=assembleWebFiles({...files,'index.html':'<!doctype html><html><body><p>Test</p></body></html>'});
  assert.equal(noLinks.linkedStyle,false);
  assert.equal(noLinks.linkedScript,false);
  assert.doesNotMatch(noLinks.html,/body \{ color: red; \}/);
  assert.doesNotMatch(noLinks.html,/document.querySelector/);
});

test('legacy single-file draft migration saves three keys and never destroys a subsequent edit',()=>{
  const store=new Map();
  const key='designlab:code:project:mobile-app-dev:club-connect';
  const starters=projectStarterFiles('<html><head><style>p{color:red}</style></head><body><p>Start</p><script>console.log("start")</script></body></html>');
  const first=loadWebDrafts({base:key,starters,legacy:'<html><head><style>p{color:blue}</style></head><body><p>Changed</p><script>console.log("draft")</script></body></html>',
    read:k=>store.get(k)??null,write:(k,v)=>store.set(k,v)});
  assert.match(first['index.html'],/Changed/);
  assert.match(first['styles.css'],/blue/);
  assert.match(first['script.js'],/draft/);
  assert.equal(store.size,3);
  store.set(webDraftKey(key,'styles.css'),'p{color:green}');
  const second=loadWebDrafts({base:key,starters,legacy:'<html>older</html>',
    read:k=>store.get(k)??null,write:(k,v)=>store.set(k,v)});
  assert.equal(second['styles.css'],'p{color:green}');
  assert.match(second['index.html'],/Changed/);
  const otherLesson=webDraftKey('designlab:code:html','styles.css');
  assert.notEqual(otherLesson,webDraftKey(key,'styles.css'));
});

test('published project starts empty when its published starter is intentionally blank',()=>{
  const files=projectStarterFiles('');
  assert.equal(files['index.html'],'');
  assert.equal(files['styles.css'],'');
  assert.equal(files['script.js'],'');
});

test('React preview loads the same JSX compiler and keeps the three file references',()=>{
  const source=read('../src/lib/livePreviewRuntime.js');
  const project=read('../src/components/course/ProjectWorkspace.jsx');
  const workspace=read('../src/components/course/LessonWorkspace.jsx');
  const pane=read('../src/components/course/WebFilesPane.jsx');
  assert.match(source,/assembleWebFiles\(task\.webFiles/);
  assert.match(source,/vendor\/learning\/jsx\.js/);
  assert.match(project,/<WebFilesPane lessonId=\{draftId\}/);
  assert.match(project,/focus:current\.focus/);
  assert.match(workspace,/course\.id==='mobile-app-dev'/);
  assert.match(workspace,/<WebFilesPane key=\{lessonId\}/);
  assert.match(pane,/webDraftKey\(base,activeFile\)/);
  assert.match(pane,/role="tablist"/);
  assert.match(pane,/sandbox|previewDoc/);
  assert.match(pane,/Submit \(not enabled\)/);
});
