// Golden scan-accuracy test.
// Put real bottle photos in tests/golden/photos/, describe the truth in expected.json,
// then:  node tests/golden/run.mjs
//
// For each photo it exercises the REAL production pipeline:
//   1. /api/scan (Grok vision)  — does it read the product name? the ingredients?
//   2. NIH DSLD text search     — does the right product appear in the top-3 picker?
// and prints a per-bottle scorecard. Each run costs a few xAI vision calls.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE     = dirname(fileURLToPath(import.meta.url));
const API      = process.env.SCAN_URL || 'https://supplement-tracker-swart.vercel.app/api/scan';
const DSLD     = 'https://api.ods.od.nih.gov/dsld/v9/search-filter';
const PHOTOS   = join(HERE, 'photos');
const expected = JSON.parse(readFileSync(join(HERE, 'expected.json'), 'utf8'));

const norm = s => String(s || '').toLowerCase();
const contains = (hay, needle) => norm(hay).includes(norm(needle));

function mime(f) {
  return f.endsWith('.png') ? 'image/png' : f.endsWith('.webp') ? 'image/webp' : 'image/jpeg';
}

async function scanPhoto(file) {
  const b64 = readFileSync(join(PHOTOS, file)).toString('base64');
  const image = `data:${mime(file)};base64,${b64}`;
  if (image.length > 9000000) return { error: `photo too large (${(image.length / 1e6).toFixed(1)}M chars) — resize below ~6MB` };
  const r = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode: 'parse', image })
  });
  return r.json().catch(() => ({ error: 'bad json (' + r.status + ')' }));
}

async function dsldTop3(productName) {
  if (!productName || productName.length < 4) return [];
  try {
    const r = await fetch(`${DSLD}?q=${encodeURIComponent(productName)}&size=3`);
    const hits = ((await r.json()) || {}).hits || [];
    return hits.map(h => `${h._source?.brandName || ''} ${h._source?.fullName || ''}`.trim());
  } catch { return []; }
}

const files = existsSync(PHOTOS) ? readdirSync(PHOTOS).filter(f => expected[f]) : [];
if (!files.length) {
  console.log('No test photos found.');
  console.log('1. Copy your bottle photos into: ' + PHOTOS);
  console.log('2. Name them to match the keys in expected.json (e.g. biotin.jpg)');
  console.log('3. Run again: node tests/golden/run.mjs');
  process.exit(0);
}

let totalPts = 0, maxPts = 0;
for (const file of files) {
  const exp = expected[file];
  process.stdout.write(`\n📷 ${file}\n`);
  const t0 = Date.now();
  const res = await scanPhoto(file);
  const secs = ((Date.now() - t0) / 1000).toFixed(1);

  if (res.error || !Array.isArray(res.ingredients)) {
    console.log(`   ❌ scan failed (${secs}s): ${res.error || JSON.stringify(res).slice(0, 120)}`);
    maxPts += 3;
    continue;
  }

  // 1) product name read?
  const nameOK = contains(res.productName, exp.product);
  console.log(`   ${nameOK ? '✅' : '❌'} product name (${secs}s): "${res.productName}" ${nameOK ? '' : `(expected to contain "${exp.product}")`}`);

  // 2) ingredients right? (every expected found; extras counted as noise)
  let ingPts = 0;
  for (const e of exp.ingredients) {
    const hit = res.ingredients.find(i => contains(i.name, e.name));
    const doseOK = !hit ? false : (e.dose == null || (Number(hit.dose) === e.dose && norm(hit.unit) === norm(e.unit)));
    console.log(`   ${hit && doseOK ? '✅' : hit ? '🟡' : '❌'} ingredient "${e.name}": ` +
      (hit ? `got "${hit.name}" ${hit.dose ?? '?'} ${hit.unit || ''}${doseOK ? '' : ` (expected ${e.dose} ${e.unit})`}` : 'MISSING'));
    if (hit && doseOK) ingPts += 1; else if (hit) ingPts += 0.5;
  }
  const extras = res.ingredients.filter(i => !exp.ingredients.some(e => contains(i.name, e.name)));
  if (extras.length) console.log(`   🟡 extra rows (possible hallucination): ${extras.map(x => x.name).join(', ')}`);
  const ingOK = ingPts === exp.ingredients.length && !extras.length;

  // 3) DSLD picker would offer the right product?
  const top3 = await dsldTop3(res.productName);
  const dsldOK = top3.some(t => contains(t, exp.product));
  console.log(`   ${dsldOK ? '✅' : '🟡'} DSLD top-3: ${top3.length ? top3.join(' | ') : '(no hits — vision fallback would be used)'}`);

  totalPts += (nameOK ? 1 : 0) + (ingOK ? 1 : 0) + (dsldOK ? 1 : 0);
  maxPts += 3;
}

console.log(`\n══════════════════════════════`);
console.log(`SCORE: ${totalPts} / ${maxPts}  (${Math.round(totalPts / maxPts * 100)}%)`);
console.log(`name-read + clean-ingredients + DSLD-findable, 1 pt each per bottle`);
