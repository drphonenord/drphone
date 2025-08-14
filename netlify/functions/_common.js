export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-token'
};
export const res = (body, status=200) => ({ statusCode: status, headers: { 'Content-Type':'application/json', ...corsHeaders }, body: JSON.stringify(body) });
export const isWrite = (m) => ['POST','PUT','PATCH','DELETE'].includes(m);
export const ok204 = () => ({ statusCode:204, headers: corsHeaders });
