
const BASE = '/.netlify/functions';
async function jsonOrThrow(res){ if(!res.ok){ const t=await res.text().catch(()=> ''); throw new Error(t||`HTTP ${res.status}`);} return res.json(); }
function build(n){ const url=(q='')=>`${BASE}/${n}${q?`?${q}`:''}`; return {
  list: ()=>fetch(url()).then(jsonOrThrow),
  get: (id)=>fetch(url(new URLSearchParams({id}))).then(jsonOrThrow),
  create: (data)=>fetch(url(),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}).then(jsonOrThrow),
  update: (data)=>fetch(url(),{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}).then(jsonOrThrow),
  remove: (id)=>fetch(url(new URLSearchParams({id})),{method:'DELETE'}).then(jsonOrThrow),
};}
export const api={ clients:build('clients'), repairs:build('repairs'), tickets:build('tickets'), prices:build('prices') };
