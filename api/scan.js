// Vercel serverless function — Grok (xAI) vision label parser + interaction assessor.
//
// TRUST BOUNDARY (eng-review decision #3): two modes, kept separate.
//   mode=parse   image -> { productName, ingredients:[{name,dose,unit}] }   (verifiable on the review screen)
//   mode=assess  ingredient names + meds -> { interactions:[...] }           (AI-suggested, UNVERIFIED)
//
// CAPABILITY-CONSTRAINED: the system prompt is fixed server-side and the model is told to
// return ONLY supplement JSON. A leaked URL yields a label parser, not a general vision proxy.
//
// The key lives in the XAI_API_KEY env var — NEVER in client code or committed files.
// Set it in the Vercel dashboard (Project -> Settings -> Environment Variables) and add a
// spending cap there too (a function this open should never be able to run up an unbounded bill).

const XAI_URL        = 'https://api.x.ai/v1/chat/completions';
const VISION_MODEL   = process.env.XAI_VISION_MODEL || 'grok-4.3'; // current vision-capable model (verified via /v1/models 2026-06)
const TEXT_MODEL     = process.env.XAI_TEXT_MODEL   || 'grok-4.3';
const MAX_IMAGE_CHARS = 9000000; // ~6.5 MB image as a base64 data URL; reject larger to bound cost/latency

const PARSE_SYSTEM = [
  'You read a Supplement Facts / Nutrition label from one image.',
  'Return ONLY a JSON object, no prose, no markdown fences:',
  '{"productName": string, "ingredients": [{"name": string, "dose": number|null, "unit": string}]}',
  'List every ingredient row on the panel. dose is the numeric amount per serving (null if not printed).',
  'unit is the printed unit (mg, mcg, IU, g, ...). Do not invent ingredients that are not on the label.'
].join('\n');

const ASSESS_SYSTEM = [
  'You assess well-established interactions among the supplement ingredients and user medications given.',
  'Return ONLY JSON, no prose:',
  '{"interactions": [{"a": string, "b": string, "severity": "high"|"moderate"|"low", "note": string}]}',
  'Only include well-documented interactions. If none, return {"interactions": []}.',
  'These are AI-suggested and unverified; keep notes factual and short.'
].join('\n');

function extractJson(text) {
  if (typeof text !== 'string') return null;
  try { return JSON.parse(text); } catch (_) {}
  const m = text.match(/\{[\s\S]*\}/);            // strip stray prose / code fences, keep the JSON object
  if (m) { try { return JSON.parse(m[0]); } catch (_) {} }
  return null;
}

async function callGrok(payload) {
  const r = await fetch(XAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.XAI_API_KEY
    },
    body: JSON.stringify(payload)
  });
  if (!r.ok) {
    const detail = await r.text().catch(() => '');
    const err = new Error('xai_' + r.status);
    err.detail = detail.slice(0, 300);
    throw err;
  }
  const data = await r.json();
  return (data && data.choices && data.choices[0] && data.choices[0].message &&
          data.choices[0].message.content) || '';
}

module.exports = async (req, res) => {
  if (req.method !== 'POST')          { res.status(405).json({ error: 'method_not_allowed' }); return; }
  if (!process.env.XAI_API_KEY)       { res.status(500).json({ error: 'server_not_configured' }); return; }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (_) { body = {}; } }
  body = body || {};
  const mode = body.mode === 'assess' ? 'assess' : 'parse';

  try {
    // ── ① PARSE: image -> ingredient JSON (verifiable) ──
    if (mode === 'parse') {
      const image = body.image;
      if (!image || typeof image !== 'string' || image.indexOf('data:image/') !== 0) {
        res.status(400).json({ error: 'bad_image' }); return;
      }
      if (image.length > MAX_IMAGE_CHARS) { res.status(413).json({ error: 'image_too_large' }); return; }

      const content = await callGrok({
        model: body._model || VISION_MODEL,
        messages: [
          { role: 'system', content: PARSE_SYSTEM },
          { role: 'user', content: [
            { type: 'text', text: 'Parse this supplement label into the required JSON.' },
            { type: 'image_url', image_url: { url: image } }
          ] }
        ]
      });

      const parsed = extractJson(content);
      if (!parsed || !Array.isArray(parsed.ingredients)) {
        res.status(502).json({ error: 'unreadable_label' }); return;   // -> client shows "re-shoot" retry
      }
      const ingredients = parsed.ingredients
        .filter(x => x && typeof x.name === 'string' && x.name.trim())
        .map(x => ({
          name: String(x.name).trim(),
          dose: (x.dose == null || x.dose === '') ? null : Number(x.dose),
          unit: String(x.unit || '').trim()
        }));
      res.status(200).json({ productName: String(parsed.productName || '').trim(), ingredients });
      return;
    }

    // ── ② ASSESS: ingredient names + meds -> AI-suggested interactions (UNVERIFIED) ──
    const ingredients = Array.isArray(body.ingredients)
      ? body.ingredients.filter(s => typeof s === 'string').slice(0, 60) : [];
    const meds = Array.isArray(body.medications)
      ? body.medications.filter(s => typeof s === 'string').slice(0, 30) : [];
    if (!ingredients.length) { res.status(400).json({ error: 'no_ingredients' }); return; }

    const content = await callGrok({
      model: TEXT_MODEL,
      messages: [
        { role: 'system', content: ASSESS_SYSTEM },
        { role: 'user', content: 'Ingredients: ' + ingredients.join(', ') +
                                 '\nMedications: ' + (meds.join(', ') || 'none') }
      ]
    });
    const parsed = extractJson(content);
    const interactions = (parsed && Array.isArray(parsed.interactions)) ? parsed.interactions : [];
    res.status(200).json({ interactions });

  } catch (e) {
    res.status(502).json({ error: 'upstream', detail: e.message, upstream: e.detail || null });
  }
};
