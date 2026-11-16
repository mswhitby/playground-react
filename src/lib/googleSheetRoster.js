const SCOPE='https://www.googleapis.com/auth/spreadsheets.readonly';
export const GOOGLE_CLIENT_KEY='playground:google-sheets-client-id';
export const GOOGLE_SHEET_LINK_KEY='playground:teacher-google-sheet-url';

export function parseSheetLink(text){
 let u;try{u=new URL(String(text||'').trim())}catch{throw Error('Paste a full Google Sheets link.')}
 if(u.protocol!=='https:'||u.hostname!=='docs.google.com')throw Error('Use a Google Sheets URL from docs.google.com.');
 const match=u.pathname.match(/^\/spreadsheets\/d\/([a-zA-Z0-9_-]+)(?:\/|$)/);
 if(!match)throw Error('This URL does not contain a spreadsheet ID.');
 const hash=new URLSearchParams(u.hash.replace(/^#/,'')),rawGid=u.searchParams.get('gid')||hash.get('gid');
 if(rawGid!==null&&!/^\d+$/.test(rawGid))throw Error('Invalid sheet tab (gid).');
 return {id:match[1],gid:rawGid===null?null:Number(rawGid)};
}
const normalizeHeader=value=>String(value||'').replace(/\s+/g,' ').trim().toLowerCase();
export function sheetColumnIndices(headers){
 const keys=['class period','first name','last name','github username'];
 const indices=keys.map(key=>headers.findIndex(h=>normalizeHeader(h)===key));
 if(indices.some(i=>i<0))throw Error('The Sheet must have Class Period, First Name, Last Name and GitHub Username headers.');
 const secondary=headers.findIndex(h=>/^class period 2(?:\b|\s|\()/i.test(normalizeHeader(h)));
 return [...indices,...(secondary>=0?[secondary]:[])];
}
const normalizeGithub=value=>String(value||'').trim().replace(/^@/,'').replace(/^https?:\/\/(?:www\.)?github\.com\//i,'').replace(/\/$/,'').toLowerCase();
export function parseSheetColumns(headers,columns){
 sheetColumnIndices(headers);
 const [period,first,last,github,secondPeriod]=columns,length=Math.max(...columns.map(col=>col?.length||0),0),results=[];
 for(let i=0;i<length;i++){
  const handle=normalizeGithub(github?.[i]);if(!handle)continue;
  const firstName=String(first?.[i]||'').trim(),lastName=String(last?.[i]||'').trim();
  const p1=String(period?.[i]||'').trim(),p2=String(secondPeriod?.[i]||'').trim();
  results.push({github:handle,period:p1,periods:[...new Set([p1,p2].filter(Boolean))],firstName,lastName,name:[firstName,lastName].filter(Boolean).join(' '),row:i+2});
 }
 return results;
}
function colName(index){let n=index+1,out='';while(n){n--;out=String.fromCharCode(65+n%26)+out;n=Math.floor(n/26)}return out}
async function json(url,token){
 const response=await fetch(url,{headers:{Authorization:'Bearer '+token},cache:'no-store'});
 if(!response.ok){if(response.status===401)throw Error('Google session expired. Connect Google again.');if(response.status===403)throw Error('Google denied access. Check Sheet access and the Sheets API.');if(response.status===404)throw Error('Google could not find this spreadsheet or tab.');throw Error('Google Sheets request failed ('+response.status+').');}
 return response.json();
}
export async function readPrivateSheet(url,token){
 const parsed=parseSheetLink(url),root='https://sheets.googleapis.com/v4/spreadsheets/'+encodeURIComponent(parsed.id);
 const meta=await json(root+'?fields=sheets(properties(sheetId,title))',token),tabs=meta.sheets||[];
 const tab=parsed.gid===null?tabs[0]:tabs.find(s=>s.properties.sheetId===parsed.gid);
 if(!tab)throw Error('The selected sheet tab was not found.');
 const title=tab.properties.title,quoted="'"+title.replace(/'/g,"''")+"'";
 const head=await json(root+'/values/'+encodeURIComponent(quoted+'!1:1'),token),headers=head.values?.[0]||[],indices=sheetColumnIndices(headers);
 const params=new URLSearchParams({majorDimension:'COLUMNS'});for(const i of indices)params.append('ranges',quoted+'!'+colName(i)+'2:'+colName(i));
 const body=await json(root+'/values:batchGet?'+params.toString(),token),columns=(body.valueRanges||[]).map(v=>v.values?.[0]||[]);
 return {rows:parseSheetColumns(headers,columns),title};
}
let gisPromise;
export function loadGoogleIdentity(){
 if(globalThis.google?.accounts?.oauth2)return Promise.resolve();
 if(gisPromise)return gisPromise;
 gisPromise=new Promise((resolve,reject)=>{const el=document.createElement('script');el.src='https://accounts.google.com/gsi/client';el.async=true;el.onload=()=>globalThis.google?.accounts?.oauth2?resolve():reject(Error('Google sign-in did not load.'));el.onerror=()=>reject(Error('Google sign-in is blocked or unavailable on this network.'));document.head.append(el)}).catch(e=>{gisPromise=null;throw e});
 return gisPromise;
}
export async function connectGoogleSheet(url,clientId){
 parseSheetLink(url);
 if(!/^\d+-[a-z0-9_-]+\.apps\.googleusercontent\.com$/i.test(String(clientId||'').trim()))throw Error('Enter a valid Google Cloud Web OAuth client ID.');
 await loadGoogleIdentity();
 return new Promise((resolve,reject)=>{
  const client=globalThis.google.accounts.oauth2.initTokenClient({
   client_id:clientId.trim(),scope:SCOPE,
   callback:async response=>{if(response.error||!response.access_token){reject(Error('Google authorization was not completed.'));return}try{resolve(await readPrivateSheet(url,response.access_token))}catch(e){reject(e)}},
   error_callback:()=>reject(Error('Google authorization popup was closed or blocked.'))
  });
  client.requestAccessToken({prompt:''});
 });
}
