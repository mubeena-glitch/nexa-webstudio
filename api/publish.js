// NEXA Studio — Publish to Vercel (prototype).
// Deploys the current page to Vercel, which provides hosting + SSL + global CDN
// automatically. Custom domains are a follow-up (Vercel projects/domains API).
// Requires VERCEL_TOKEN (and optionally VERCEL_TEAM_ID) in the project settings.
module.exports = async (req, res) => {
  // GET → lightweight config probe so the editor can show/hide the Publish button.
  if (req.method === 'GET') { res.status(200).json({ configured: !!process.env.VERCEL_TOKEN }); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST only' }); return; }

  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    res.status(503).json({ error: 'Publishing is not configured yet. Add VERCEL_TOKEN (and optionally VERCEL_TEAM_ID) in the Vercel project settings to enable one-click publish.' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};
  const html = String(body.html || '');
  if (html.length < 30) { res.status(400).json({ error: 'No page content to publish.' }); return; }
  const name = (String(body.name || 'nexa-page').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 52)) || 'nexa-page';

  const team = process.env.VERCEL_TEAM_ID ? ('?teamId=' + encodeURIComponent(process.env.VERCEL_TEAM_ID)) : '';
  try {
    const r = await fetch('https://api.vercel.com/v13/deployments' + team, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer ' + token },
      body: JSON.stringify({
        name: name,
        target: 'production',
        projectSettings: { framework: null },
        files: [{ file: 'index.html', data: html }]
      })
    });
    const d = await r.json();
    if (!r.ok) { res.status(502).json({ error: (d && d.error && d.error.message) || 'Vercel publish failed' }); return; }
    const raw = (d.alias && d.alias[0]) ? d.alias[0] : d.url;
    res.status(200).json({ url: raw ? ('https://' + String(raw).replace(/^https?:\/\//, '')) : null, id: d.id, name: name });
  } catch (e) {
    res.status(500).json({ error: String((e && e.message) || e) });
  }
};
