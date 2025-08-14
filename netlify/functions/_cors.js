
const ALLOW_ORIGIN = process.env.CORS_ORIGIN || '*';
export function corsHeaders(){ return {'Access-Control-Allow-Origin': ALLOW_ORIGIN,'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS','Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'}; }
export function withCors(response){ return { ...response, headers: { ...(response.headers||{}), ...corsHeaders() } }; }
export function ok(body, statusCode=200, headers={}){ return withCors({ statusCode, headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) }); }
export function error(message, statusCode=400){ return withCors({ statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: message }) }); }
