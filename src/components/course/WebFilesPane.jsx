import { useEffect, useRef, useState } from 'react';
import { Code2, Download, Save, Send } from 'lucide-react';
import CodeEditor from './CodeEditor.jsx';
import ConsolePane from './ConsolePane.jsx';
import Splitter from '../ui/Splitter.jsx';
import { useSaved } from '../../hooks/useSaved.js';
import { readString, storageKeys, writeString } from '../../lib/storage.js';
import {
  fileNamesFor, fileLanguage, initialFocus, lessonStarterFiles,
  projectStarterFiles, webDraftKey, loadWebDrafts
} from '../../lib/webFiles.js';
import { browserPreviewSource } from '../../lib/livePreviewRuntime.js';
import { convertPreviewRows } from '../../lib/previewChecks.js';

/** Three real, separately saved source files per published Mobile lesson/project.
 * Each project step shares its own project's files, not another lesson's files.
 * Builds the combined sandbox document only when Run / Check is pressed.
 */
export default function WebFilesPane({lessonId, task}) {
  const base=storageKeys.code(lessonId);
  const names=fileNamesFor(task.language);
  const starters=task.starterFiles ||
    (task.projectDraft ? projectStarterFiles(task.starter) : lessonStarterFiles(task.language,task.starter));
  const [files,setFiles]=useState(()=>loadWebDrafts({
    base,starters,legacy:readString(base),read:readString,write:writeString
  }));
  const [activeFile,setActiveFile]=useState(()=>initialFocus(task.language,task.focus));
  const [consoleText,setConsoleText]=useState('Run to render all your linked files together.');
  const [checksText,setChecksText]=useState('Check runs the current published practice requirements.');
  const [rows,setRows]=useState(null);
  const [previewDoc,setPreviewDoc]=useState('');
  const [consoleTab,setConsoleTab]=useState('Preview');
  const [savedMessage,setSavedMessage]=useState('');
  const [running,setRunning]=useState(false);
  const [editorHeight,setEditorHeight]=useSaved('designlab:web-files-editor-height',310);
  const frameRef=useRef(null);
  const requestRef=useRef(null);
  const timeoutRef=useRef(null);
  const workspaceRef=useRef(null);

  useEffect(()=>{
    const chosen=initialFocus(task.language,task.focus);
    setActiveFile(names.includes(chosen)?chosen:'index.html');
  },[task.stepId,task.focus,task.language]);

  useEffect(()=>{
    const receive=event=>{
      const current=requestRef.current;
      if(!current || !frameRef.current ||
        event.source!==frameRef.current.contentWindow || event.data?.token!==current.token)return;
      const data=event.data;
      if(data.kind==='log')setConsoleText(previous=>previous+(data.level==='error'?'Error: ':'')+data.text+'\n');
      if(data.kind==='clear')setConsoleText('');
      if(data.kind==='error'){
        clearTimeout(timeoutRef.current);requestRef.current=null;
        setConsoleText(previous=>previous+'Error: '+data.text+'\n');
        setChecksText('Fix the error reported in Console before checking again.');
        setConsoleTab('Console');setRunning(false);
      }
      if(data.kind==='checks'||data.kind==='project-checks'){
        clearTimeout(timeoutRef.current);requestRef.current=null;
        setRows(convertPreviewRows(data.results || (data.text?[{label:data.text,pass:data.pass}]:[])));
        setConsoleTab('Checks');setRunning(false);
      }
      if(data.kind==='ready'&&!current.check){
        clearTimeout(timeoutRef.current);requestRef.current=null;setRunning(false);
      }
    };
    window.addEventListener('message',receive);
    return ()=>{
      clearTimeout(timeoutRef.current);requestRef.current=null;
      window.removeEventListener('message',receive);
    };
  },[]);

  function updateFile(source) {
    setFiles(previous=>({...previous,[activeFile]:source}));
    writeString(webDraftKey(base,activeFile),source);
    setSavedMessage('');
    setRows(null);setChecksText('Code changed. Check again to update the results.');
  }
  function saveAll() {
    names.forEach(name=>writeString(webDraftKey(base,name),files[name]??''));
    setSavedMessage('All three files saved in this browser only.');
  }
  function resetAll() {
    if(!window.confirm('Restore all three starter files? Your current saved changes will be replaced.'))return;
    setFiles({...starters});
    names.forEach(name=>writeString(webDraftKey(base,name),starters[name]??''));
    setRows(null);setPreviewDoc('');setConsoleText('Starter files restored.');
    setChecksText('Run Check to evaluate the restored files.');
    setConsoleTab('Preview');
    setSavedMessage('Starter files restored for this lesson or project.');
  }
  function downloadFile() {
    const source=files[activeFile]||'';
    const link=document.createElement('a');
    const url=URL.createObjectURL(new Blob([source],{type:'text/plain;charset=utf-8'}));
    link.href=url;link.download=activeFile;document.body.append(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),2000);
  }
  function stop() {
    clearTimeout(timeoutRef.current);requestRef.current=null;setRunning(false);
    setPreviewDoc('<p>Preview stopped.</p>');
    setConsoleText('Preview stopped. Check your script for an endless loop.');
    setConsoleTab('Console');
  }
  async function execute(check) {
    if(running)return;
    setRunning(true);setRows(null);setSavedMessage('');
    setConsoleText('');
    setChecksText(check?'Checking the published requirements…':'Run Check to review the published requirements.');
    setConsoleTab(check?'Checks':'Preview');
    try{
      saveAllSilently();
      const token=crypto.randomUUID();
      requestRef.current={token,check};
      const doc=await browserPreviewSource({
        language:task.language,code:files[activeFile]||'',lessonId:task.lessonFocus||lessonId,
        task:{...task,webFiles:files},token,check
      });
      if(requestRef.current?.token!==token)return;
      setPreviewDoc(doc);
      clearTimeout(timeoutRef.current);
      timeoutRef.current=setTimeout(()=>{
        if(requestRef.current?.token!==token)return;
        stop();setChecksText('The preview timed out. No result was recorded.');
      },7000);
    }catch(error) {
      clearTimeout(timeoutRef.current);requestRef.current=null;setRunning(false);
      setConsoleText(String(error?.message||error));
      setChecksText('Checks unavailable: '+String(error?.message||error));
      setConsoleTab('Console');
    }
  }
  function saveAllSilently() {
    names.forEach(name=>writeString(webDraftKey(base,name),files[name]||''));
  }
  function resizeRows(event) {
    if(!workspaceRef.current)return;
    const rect=workspaceRef.current.getBoundingClientRect();
    setEditorHeight(Math.max(160,Math.min(rect.height-120,event.clientY-rect.top)));
  }
  return <div className="code-pane web-files-pane">
    <div className="pane-header">
      <strong><Code2 size={16}/> Project files</strong>
      <span className="web-file-badge">HTML + CSS + {task.language==='jsx'?'React':'JavaScript'}</span>
    </div>
    <div className="web-file-tabs" role="tablist" aria-label="Source files">
      {names.map(name=><button key={name} type="button" role="tab" aria-selected={name===activeFile}
        className={name===activeFile?'active':''} onClick={()=>setActiveFile(name)}>{name}</button>)}
    </div>
    <div className="code-workspace" ref={workspaceRef} style={{'--editor-height':editorHeight+'px'}}>
      <CodeEditor key={activeFile} value={files[activeFile]??''}
        language={fileLanguage(activeFile)} onChange={updateFile}/>
      <Splitter axis="rows" onDrag={resizeRows}/>
      <ConsolePane text={consoleText} checksText={checksText} checkRows={rows}
        points={null} language="html" previewEnabled previewDoc={previewDoc}
        previewRef={frameRef} activeTab={consoleTab} onTabChange={setConsoleTab}/>
    </div>
    <div className="editor-controls">
      <div>
        <button type="button" className="btn" disabled={running} onClick={()=>execute(false)}>Run</button>
        <button type="button" className="btn" disabled={running} onClick={()=>execute(true)}>Check</button>
        <button type="button" className="btn" disabled={running} onClick={resetAll}>Reset</button>
        {running&&<button type="button" className="btn" onClick={stop}>Stop</button>}
      </div>
      <div>
        <button type="button" className="btn" disabled={running} onClick={downloadFile}>
          <Download size={15}/> Download file
        </button>
        <button type="button" className="btn" disabled={running} onClick={saveAll}>
          <Save size={15}/> Save
        </button>
        <button type="button" className="btn submit" disabled title="Submissions and grading are not connected">
          <Send size={15}/> Submit (not enabled)
        </button>
      </div>
    </div>
    <div className="editor-note" role="status">{savedMessage||
      'Edit one file at a time. The HTML link to styles.css and script tag for script.js (or App.jsx) connect the files. Drafts save locally; practice checks award no points.'}</div>
  </div>;
}
