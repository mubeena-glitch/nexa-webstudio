// Password gate for the client portal prototype (/portal and everything under it).
// Runs on Vercel's edge before any file is served, so the page and its scripts cannot be fetched without the password.
// The password lives ONLY in the Vercel env var PORTAL_PASSWORD. If it is not set, the portal stays locked (fails closed).
export const config = { matcher: ['/portal', '/portal/:path*', '/portal.html'] };

const COOKIE = 'nx_portal';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

async function token(pw) {
  const data = new TextEncoder().encode('nexa-portal-v1:' + pw);
  const h = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function same(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

function cookieOf(req, name) {
  const c = req.headers.get('cookie') || '';
  const m = c.split(/;\s*/).find(x => x.startsWith(name + '='));
  return m ? decodeURIComponent(m.slice(name.length + 1)) : null;
}

const page = (body, status = 200, extra = {}) => new Response(
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>NEXA Web Studio | Client portal</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#F5F5F5;font-family:Poppins,system-ui,sans-serif;color:#1B1B1B;padding:16px}
.c{background:#fff;border:1px solid #ECEBEF;border-radius:18px;padding:40px 36px;width:100%;max-width:420px;box-shadow:0 20px 60px rgba(62,41,107,.08)}
.l{font-family:"Chakra Petch",Poppins,sans-serif;font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#9354FF;margin:28px 0 6px}
h1{font-size:24px;margin:0 0 8px;font-weight:600}p{margin:0 0 22px;color:#474747;font-size:14px;line-height:1.6}
input{width:100%;border:1px solid #DEDCE3;border-radius:10px;padding:12px 14px;font:inherit;font-size:15px}input:focus{outline:2px solid #9354FF;outline-offset:1px}
button{margin-top:14px;width:100%;border:0;border-radius:10px;background:#9354FF;color:#fff;font:inherit;font-weight:600;padding:12px;font-size:15px;cursor:pointer}button:hover{background:#683EB5}
.e{color:#B3261E;font-size:13px;margin:10px 0 0}img{width:150px;height:auto;display:block}</style></head><body><main class="c">
<img src="/portal-logo.png" alt="NEXA" width="150">${body}</main></body></html>`,
  { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex', ...extra } }
);

const loginForm = (err) => page(`<div class="l">Client portal</div><h1>Welcome to Web Studio</h1><p>Enter the access password NEXA shared with you.</p>
<form method="post" action="/portal/login"><input type="password" name="password" autocomplete="current-password" placeholder="Password" required autofocus><button type="submit">Enter</button>${err ? '<p class="e">That password did not work. Try again.</p>' : ''}</form>`, err ? 401 : 200);

export default async function middleware(req) {
  const url = new URL(req.url);
  const pw = process.env.PORTAL_PASSWORD;
  if (!pw) return page(`<div class="l">Client portal</div><h1>Not open yet</h1><p>The portal is locked until NEXA sets its access password.</p>`, 503);
  const good = await token(pw);

  if (url.pathname === '/portal/logout') {
    return new Response(null, { status: 303, headers: { location: '/portal', 'set-cookie': `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`, 'cache-control': 'no-store' } });
  }
  if (url.pathname === '/portal/login') {
    if (req.method !== 'POST') return Response.redirect(new URL('/portal', url), 303);
    let given = '';
    try { const f = await req.formData(); given = String(f.get('password') || ''); } catch (e) {}
    if (!same(await token(given), good)) return loginForm(true);
    return new Response(null, { status: 303, headers: { location: '/portal', 'set-cookie': `${COOKIE}=${good}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`, 'cache-control': 'no-store' } });
  }
  if (same(cookieOf(req, COOKIE) || '', good)) {
    return new Response(null, { headers: { 'x-middleware-next': '1' } }); // let the request through
  }
  return loginForm(false);
}
