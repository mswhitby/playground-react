import {useState} from 'react';
import {connectGoogleSheet,GOOGLE_CLIENT_KEY,GOOGLE_SHEET_LINK_KEY,parseSheetLink} from '../../lib/googleSheetRoster.js';

const read=(key)=>{try{return localStorage.getItem(key)||''}catch{return ''}};
const write=(key,value)=>{try{if(value)localStorage.setItem(key,value);else localStorage.removeItem(key);return true}catch{return false}};

export default function GoogleSheetRosterPanel({onRows=()=>{}}){
 const [url,setUrl]=useState(()=>read(GOOGLE_SHEET_LINK_KEY));
 const [clientId,setClientId]=useState(()=>read(GOOGLE_CLIENT_KEY));
 const [status,setStatus]=useState(url?'Saved Sheet link restored from this browser. Reconnect Google to refresh names and periods.':'');
 const [busy,setBusy]=useState(false);

 async function connect(){
  try{parseSheetLink(url)}catch(error){setStatus(error.message);return}
  write(GOOGLE_SHEET_LINK_KEY,url.trim());
  write(GOOGLE_CLIENT_KEY,clientId.trim());
  setBusy(true);setStatus('Opening Google authorization…');
  try{
   const result=await connectGoogleSheet(url,clientId);
   onRows(result.rows||[]);
   setStatus('Sheet loaded: '+result.title+' · '+(result.rows||[]).length+' rows with GitHub usernames. Read-only integration: nothing was synchronized to the database.');
  }catch(error){setStatus(error.message||'Could not load the Google Sheet.')}
  finally{setBusy(false)}
 }
 function forget(){
  write(GOOGLE_SHEET_LINK_KEY,'');setUrl('');onRows([]);
  setStatus('Saved Sheet link cleared from this browser. Google permissions remain managed in your Google account.');
 }
 return <details className="panel admin-sheet-panel">
  <summary>Google Sheet roster (optional)</summary>
  <p>Use the same private roster connection as the live dashboard. This integration reads names, GitHub usernames, and up to two class periods in your browser only; it does not synchronize or change account records.</p>
  <label>Google Sheet link
   <input type="url" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://docs.google.com/spreadsheets/d/..." autoComplete="off"/>
  </label>
  <div className="admin-sheet-actions">
   <button type="button" className="btn" disabled={busy} onClick={connect}>{busy?'Connecting…':url===read(GOOGLE_SHEET_LINK_KEY)&&url?'Reconnect Google & load saved sheet':'Connect Google & load sheet'}</button>
   {read(GOOGLE_SHEET_LINK_KEY)&&<button type="button" className="btn secondary" disabled={busy} onClick={forget}>Forget saved link</button>}
  </div>
  <details>
   <summary>One-time Google authorization setup</summary>
   <p>Use the same Google Cloud Web OAuth client configured for the live Playground. The client ID is public configuration, not a secret.</p>
   <label>Google OAuth client ID
    <input type="text" value={clientId} onChange={e=>setClientId(e.target.value)} placeholder="12345-abc.apps.googleusercontent.com" autoComplete="off"/>
   </label>
   <button type="button" className="btn secondary" onClick={()=>{write(GOOGLE_CLIENT_KEY,clientId.trim());setStatus('Google OAuth client ID saved on this browser.')}}>Save browser configuration</button>
  </details>
  {status&&<p className="info-text" role="status">{status}</p>}
 </details>;
}
