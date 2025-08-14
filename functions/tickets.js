import { getStore } from '@netlify/blobs';
const CORS={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type, x-admin-token'};
const ok=(b,s=200)=>({statusCode:s,headers:{'Content-Type':'application/json',...CORS},body:JSON.stringify(b)});
const no=(b,s=400)=>ok(b,s);
const STORE = getStore({ name:'drphone', siteID: process.env.NETLIFY_BLOBS_SITE_ID, token: process.env.NETLIFY_BLOBS_TOKEN });
const KEY='tickets';
export async function handler(e){
  if(e.httpMethod==='OPTIONS') return {statusCode:204,headers:CORS};
  if(e.httpMethod==='GET'){
    const q=e.queryStringParameters?.q?.toLowerCase()?.trim();
    const openOnly=!!e.queryStringParameters?.open;
    const code=e.queryStringParameters?.code?.trim();
    const all=await STORE.getJSON(KEY)??[];
    if(code){
      const item=all.find(t=>(t.code||'').toLowerCase()===code.toLowerCase());
      return item?ok({item}):no({error:'not_found'},404);
    }
    let items=[...all].sort((a,b)=>(b.updated||'').localeCompare(a.updated||''));
    if(q) items=items.filter(t=>`${t.code||''} ${t.client||''} ${t.model||''} ${t.status||''}`.toLowerCase().includes(q));
    if(openOnly) items=items.filter(t=>(t.status||'')!=='Restitué');
    return ok({items:items.slice(0,100)});
  }
  if(e.httpMethod==='POST'){
    if((e.headers['x-admin-token']||'')!==(process.env.ADMIN_TOKEN||'')) return no({error:'unauthorized'},401);
    const body=JSON.parse(e.body||'{}'); const now=new Date().toISOString();
    let arr=await STORE.getJSON(KEY)??[];
    let code=(body.code||'').trim();
    if(!code){ const r=Math.floor(1000+Math.random()*9000); const y=new Date().getFullYear(); code=`DRP-${y}-${r}`; }
    const idx=arr.findIndex(t=>(t.code||'').toLowerCase()===code.toLowerCase());
    let item;
    if(idx>=0){
      item={...arr[idx], code, status:body.status||arr[idx].status||'Réceptionné', model:body.model??arr[idx].model??'', client:body.client??arr[idx].client??'', note:body.note??arr[idx].note??'', updated:now};
      arr[idx]=item;
    } else {
      item={code, status:body.status||'Réceptionné', model:body.model||'', client:body.client||'', note:body.note||'', created:now, updated:now};
      arr.unshift(item);
    }
    await STORE.setJSON(KEY, arr);
    return ok({ok:true, item});
  }
  return no({error:'method_not_allowed'},405);
}
