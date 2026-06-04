// NEXA Studio — AI endpoint (serverless). Key stays server-side.
// Modes: generate (prompt -> page copy), translate (fields -> language), map (raw text -> page copy).
module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST only' }); return; }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    res.status(503).json({ error: 'AI is not configured yet. Add ANTHROPIC_API_KEY in the Vercel project settings.' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};
  const { mode, prompt, fields, targetLang, dialect, text } = body;

  let system, user;
  if (mode === 'generate') {
    system = 'You are a senior conversion copywriter for landing pages. Reply with ONLY minified JSON, no markdown, no commentary.';
    user = 'Write landing-page hero copy and exactly 3 benefits for this brief: "' + (prompt || '') + '". British English. '
      + 'Return JSON: {"eyebrow":"","headline":"","subhead":"","cta":"","benefits":[{"title":"","body":""},{"title":"","body":""},{"title":"","body":""}]}. '
      + 'Headline under 60 characters and punchy. CTA is a short action phrase. Each benefit body is one sentence.';
  } else if (mode === 'translate') {
    system = 'You are a professional marketing translator. Reply with ONLY minified JSON, no markdown.';
    user = 'Translate the VALUES of this landing-page JSON into ' + (targetLang || 'Arabic')
      + (dialect ? ' (' + dialect + ' register/dialect)' : '')
      + ', preserving marketing tone and roughly the same length. Keep the same JSON keys and shape. JSON: '
      + JSON.stringify(fields || {});
  } else if (mode === 'map') {
    system = 'You extract landing-page copy from raw content. Reply with ONLY minified JSON, no markdown.';
    user = 'From the content below, produce landing-page fields in British English. '
      + 'Return JSON {"eyebrow":"","headline":"","subhead":"","cta":"","benefits":[{"title":"","body":""},{"title":"","body":""},{"title":"","body":""}]}. '
      + 'Content:\n' + String(text || '').slice(0, 6000);
  } else {
    res.status(400).json({ error: 'Unknown mode' });
    return;
  }

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: process.env.NEXA_AI_MODEL || 'claude-haiku-4-5-20251001',
        max_tokens: 1400,
        system: system,
        messages: [{ role: 'user', content: user }]
      })
    });
    const d = await r.json();
    if (!r.ok) { res.status(502).json({ error: (d && d.error && d.error.message) || 'AI request failed' }); return; }
    let raw = (d.content || []).filter(b => b.type === 'text').map(b => b.text).join('').trim();
    raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```$/, '').trim();
    let json;
    try { json = JSON.parse(raw); } catch (e) { res.status(502).json({ error: 'AI returned malformed output, please retry.' }); return; }
    res.status(200).json(json);
  } catch (e) {
    res.status(500).json({ error: String((e && e.message) || e) });
  }
};
