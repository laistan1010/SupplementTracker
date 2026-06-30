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
  'You are an OCR transcriber for a Supplement Facts / Nutrition panel. Transcribe ONLY what is literally printed.',
  'Return ONLY a JSON object, no prose, no markdown fences:',
  '{"productName": string, "ingredients": [{"name": string, "dose": number|null, "unit": string}]}',
  '',
  'STRICT RULES — follow exactly:',
  '1. Copy each ingredient NAME verbatim as printed in the "Amount Per Serving" rows (e.g. "Organic Black Cumin Seed Oil", not a nutrient you associate with it).',
  '2. Do NOT add, infer, or guess any ingredient. If it is not printed in the panel, it does not exist. Never output common supplements (Selenium, Vitamin E, Zinc, etc.) unless that exact word is printed.',
  '3. Do NOT convert a chemical/excipient name into a nutrient name (e.g. "Tocopherol" is NOT "Vitamin E" here). Use the printed word.',
  '4. IGNORE the "Other ingredients" line and capsule/excipient contents (gelatin, glycerin, water, softgel, tocopherol-as-preservative, silica, etc.). Only list the active rows in the facts panel.',
  '5. IGNORE Calories, Total Fat, Saturated Fat, Sodium and other generic nutrition-facts rows unless they are the actual supplement active.',
  '6. dose = the numeric amount per serving exactly as printed (null if not printed or unreadable). unit = the printed unit (mg, mcg, IU, g). Never guess a number.',
  '7. If the panel is blurry or you are unsure of a name, transcribe what you can read; do NOT substitute a plausible-sounding ingredient.',
  'A single-ingredient product is normal and common. Returning one ingredient is correct if only one is printed.'
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
        model: VISION_MODEL,
        temperature: 0,                 // literal transcription — minimise creative hallucination
        messages: [
          { role: 'system', content: PARSE_SYSTEM },
          { role: 'user', content: [
            { type: 'text', text: 'Transcribe this supplement label into the required JSON. Only what is printed.' },
            { type: 'image_url', image_url: { url: image, detail: 'high' } }
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
    res.status(502).json({ error: 'upstream', detail: e.message });
  }
};
