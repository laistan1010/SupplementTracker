// ─── scan.js ──────────────────────────────────────────
//  Label scan: photo -> Grok (/api/scan) -> editable review -> logProduct -> 🟢/🟡 read.
//  Reuses the existing .rm-* modal shell, .badge system, .btn buttons.
//
//  Trust layering (design decision A): every ingredient carries an inline badge —
//    ✓ 已核實 (badge-verified)  = matched a curated DB supplement (authoritative)
//    ~ AI 推測 (badge-ai)        = not in the curated DB (AI-suggested · unverified)
//  Three channels (colour + icon + text) so colourblind users still distinguish them.

let _scan = { rows: [], productName: '', interactions: [] };

function _sl(zh, en) { return (typeof LANG !== 'undefined' && LANG === 'zh') ? zh : en; }

// Match a scanned ingredient name to a curated DB supp. WHOLE-WORD match, not raw substring:
// a naive `includes` let short aliases hijack unrelated names (e.g. Selenium's "Se" alias matched
// "cumin SEed oil", BCAAs' aminos matched L-Leucine). We KEEP non-matches (never drop an ingredient).
function _scanMatchSupp(name) {
  const n = (name || '').toLowerCase();
  if (!n) return null;
  const hit = term => {
    const t = (term || '').toLowerCase().trim();
    if (t.length < 2) return false;
    const esc = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp('(^|[^a-z0-9])' + esc + '([^a-z0-9]|$)').test(n);   // t appears as a whole token
  };
  return DB.find(s => hit(s.name) || (s.aliases || []).some(hit)) || null;
}

function _scanModal() { return document.getElementById('scanModalRoot'); }

function _scanShell(inner) {
  let root = _scanModal();
  if (!root) {
    root = document.createElement('div');
    root.id = 'scanModalRoot';
    document.body.appendChild(root);
  }
  root.innerHTML =
    `<div class="rm-overlay" onclick="if(event.target===this)scanClose()">
       <div class="rm-card" style="width:min(520px,94vw);max-height:88vh;display:flex;flex-direction:column">
         ${inner}
       </div>
     </div>`;
}

function scanClose() {
  const root = _scanModal();
  if (root) root.innerHTML = '';
  _scan = { rows: [], productName: '', interactions: [] };
}

// ── STATE: capture ──
function scanOpen() {
  _scanShell(
    `<div class="rm-header">
       <span class="rm-slot-emoji">📷</span>
       <div>
         <div class="rm-title">${_sl('影標籤', 'Scan a label')}</div>
         <div class="rm-subtitle">${_sl('影樽嘅正面(產品名大字嗰面)最準 — 我哋會用個名查 NIH 官方資料庫', 'Shoot the FRONT of the bottle (big product name) — we look it up in the NIH database')}</div>
       </div>
     </div>
     <label class="btn btn-primary" style="width:100%;cursor:pointer;text-align:center">
       ${_sl('📸 影相 / 揀相', '📸 Take / choose photo')}
       <input type="file" accept="image/*" capture="environment" style="display:none" onchange="scanHandleFile(this)">
     </label>
     <div class="rm-actions" style="margin-top:12px">
       <button class="btn btn-outline" style="flex:1" onclick="scanClose()">${_sl('取消', 'Cancel')}</button>
     </div>`
  );
}

function scanHandleFile(input) {
  const file = input && input.files && input.files[0];
  if (!file) return;
  _scanLoading(_sl('準備緊相…', 'Preparing photo…'));
  const reader = new FileReader();
  reader.onload = () => _scanDownscale(reader.result, scanParse);   // shrink before upload
  reader.onerror = () => scanError(_sl('讀唔到張相,再試', 'Could not read the photo, try again'));
  reader.readAsDataURL(file);
}

// Phone photos are multi-MB at full resolution, which pushes the vision call past the
// function time limit (a label needs nowhere near that detail). Downscale to MAX_DIM on
// the long edge and re-encode as JPEG; fall back to the original if anything fails.
function _scanDownscale(dataUrl, cb) {
  const MAX_DIM = 1280;
  const img = new Image();
  img.onload = () => {
    try {
      let w = img.width, h = img.height;
      const scale = Math.min(1, MAX_DIM / Math.max(w, h));
      w = Math.round(w * scale); h = Math.round(h * scale);
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      cb(c.toDataURL('image/jpeg', 0.85));
    } catch (_) { cb(dataUrl); }
  };
  img.onerror = () => cb(dataUrl);
  img.src = dataUrl;
}

// ── STATE: loading ──
function _scanLoading(msg) {
  _scanShell(
    `<div style="text-align:center;padding:34px 8px">
       <div class="scan-spinner"></div>
       <div style="margin-top:16px;font-size:14px;color:var(--text-muted)">${msg}</div>
     </div>`
  );
}

// ── STATE: error ──
function scanError(msg) {
  _scanShell(
    `<div class="rm-header">
       <span class="rm-slot-emoji">⚠️</span>
       <div><div class="rm-title">${_sl('讀唔到', 'Could not read it')}</div>
       <div class="rm-subtitle">${msg}</div></div>
     </div>
     <div class="rm-actions" style="margin-top:6px">
       <button class="btn btn-outline" style="flex:1" onclick="scanClose()">${_sl('取消', 'Cancel')}</button>
       <button class="btn btn-primary" style="flex:1" onclick="scanOpen()">${_sl('重影', 'Re-shoot')}</button>
     </div>`
  );
}

// Generic nutrition-facts rows + units we don't treat as supplement actives.
const _DSLD_SKIP = new Set(['calories','total fat','saturated fat','trans fat','polyunsaturated fat',
  'monounsaturated fat','cholesterol','sodium','total carbohydrate','dietary fiber','soluble fiber',
  'insoluble fiber','total sugars','added sugars','protein']);
function _dsldUnit(u) {
  const m = { 'gram(s)':'g','grams':'g','milligram(s)':'mg','milligrams':'mg','microgram(s)':'mcg',
    'micrograms':'mcg','international unit(s)':'IU','iu':'IU' };
  return m[(u||'').toLowerCase().trim()] || (u||'');
}

// Search NIH DSLD by the vision-read product NAME (text search, not barcode — UPC coverage is
// poor). Returns up to 3 candidates for the USER to pick from. We never auto-take the top hit:
// scores proved unsafe (a wrong product at score 76 wearing the NIH badge is worse than a
// visible AI guess).
async function dsldSearchCandidates(name) {
  const q = (name || '').trim();
  if (q.length < 4) return [];
  try {
    const sr = await fetch(`https://api.ods.od.nih.gov/dsld/v9/search-filter?q=${encodeURIComponent(q)}&size=4`);
    if (!sr.ok) return [];
    const hits = ((await sr.json()) || {}).hits || [];
    return hits
      .filter(h => (h._score || 0) >= 20)          // drop pure noise, keep plausible candidates
      .slice(0, 3)
      .map(h => ({ id: String(h._id), name: (h._source && h._source.fullName) || '', brand: (h._source && h._source.brandName) || '' }))
      .filter(c => c.name);
  } catch (_) { return []; }
}

// Fetch one DSLD label's authoritative ingredient rows (actives only, normalised units).
async function dsldFetchIngredients(labelId) {
  try {
    const lr = await fetch(`https://api.ods.od.nih.gov/dsld/v9/label/${labelId}`);
    if (!lr.ok) return null;
    const label = await lr.json();
    const rows = (label.ingredientRows || [])
      .filter(r => r && r.name && r.category !== 'other' && !_DSLD_SKIP.has(String(r.name).toLowerCase().trim()))
      .map(r => {
        const qy = (r.quantity && r.quantity[0]) || {};
        return { name: String(r.name).trim(), dose: qy.quantity != null ? String(qy.quantity) : '', unit: _dsldUnit(qy.unit) };
      })
      .filter(r => r.name);
    return rows.length ? { name: label.fullName || '', brand: label.brandName || '', ingredients: rows } : null;
  } catch (_) { return null; }
}

// ── parse via /api/scan ──
async function scanParse(dataUrl) {
  _scanLoading(_sl('讀緊標籤…通常幾秒', 'Reading the label… usually a few seconds'));
  let data;
  try {
    const r = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'parse', image: dataUrl })
    });
    if (!r.ok) {
      const e = await r.json().catch(() => ({}));
      if (e.error === 'unreadable_label') return scanError(_sl('張相睇唔清成分,影清楚啲再試', 'The panel was unreadable, re-shoot more sharply'));
      if (e.error === 'image_too_large')  return scanError(_sl('張相太大,影細張啲', 'Photo too large, shoot a smaller one'));
      if (e.error === 'server_not_configured') return scanError(_sl('伺服器未設定 API key', 'Server is missing its API key'));
      return scanError(_sl('連唔到 / 逾時,再試', 'Connection or timeout error, try again'));
    }
    data = await r.json();
  } catch (_) {
    return scanError(_sl('連唔到伺服器,再試', 'Could not reach the server, try again'));
  }

  const ings = Array.isArray(data.ingredients) ? data.ingredients : [];
  if (!ings.length) return scanError(_sl('讀唔到任何成分,影清楚啲', 'No ingredients found, re-shoot more clearly'));

  _scan.productName = data.productName || '';

  // Vision rows are built up-front: they're the fallback and the "not listed" picker option.
  // Curated check is !supp.custom (a DSLD/AI custom from an earlier scan must not badge "Verified").
  _scan.visionRows = ings.map(ing => {
    const supp = _scanMatchSupp(ing.name);
    const curated = !!(supp && !supp.custom);
    return {
      name: curated ? supp.name : ing.name,      // canonical name only for curated matches
      dose: ing.dose != null ? String(ing.dose) : '',
      unit: ing.unit || (curated && supp.doses && supp.doses[0] && supp.doses[0].unit) || 'mg',
      verified: curated
    };
  });

  // Layered pipeline: vision reliably reads the product NAME but hallucinates the facts panel.
  // DSLD candidates are shown for the USER to pick — never auto-taken (wrong product wearing
  // the NIH badge is worse than a visible AI guess).
  if (_scan.productName) {
    _scanLoading(_sl('搵緊 NIH DSLD 資料庫…', 'Searching the NIH DSLD database…'));
    const cands = await dsldSearchCandidates(_scan.productName);
    if (cands.length) return scanRenderDsldPicker(cands);
  }
  scanUseVision();
}

// ── STATE: DSLD candidate picker ──
function scanRenderDsldPicker(cands) {
  _scanShell(
    `<div class="rm-header">
       <span class="rm-slot-emoji">🔎</span>
       <div>
         <div class="rm-title">${_sl('NIH 資料庫搵到相似產品', 'Possible matches in the NIH database')}</div>
         <div class="rm-subtitle">${_sl('揀啱你嗰支就攞官方成分(零AI猜測)', 'Pick yours to use official ingredients (no AI guessing)')}</div>
       </div>
     </div>
     <div class="rm-list" style="max-height:46vh">
       ${cands.map(c => `
         <button class="btn btn-outline" style="width:100%;margin-bottom:8px;text-align:left;display:block" onclick="scanPickDsld('${c.id}')">
           <div style="font-weight:600;font-size:13.5px">${_esc(c.name)}</div>
           <div style="font-size:12px;color:var(--text-muted)">${_esc(c.brand)}</div>
         </button>`).join('')}
     </div>
     <button class="btn btn-primary" style="width:100%;margin-bottom:8px" onclick="scanUseVision()">${_sl('唔喺清單 — 用 AI 讀到嘅成分', 'Not listed — use the AI reading')}</button>
     <div class="rm-actions">
       <button class="btn btn-outline" style="flex:1" onclick="scanClose()">${_sl('取消', 'Cancel')}</button>
     </div>`
  );
}

// User picked a DSLD product: fetch its authoritative rows. Each name is mapped onto the curated
// DB with the WHOLE-WORD matcher so the conflict + absorption engines fire (they key on canonical
// names). Safe now that short aliases can't hijack; unmatched names stay verbatim.
async function scanPickDsld(labelId) {
  _scanLoading(_sl('攞緊官方成分…', 'Fetching official ingredients…'));
  const dsld = await dsldFetchIngredients(labelId);
  if (!dsld || !dsld.ingredients.length) return scanUseVision();
  _scan.source = 'dsld';
  _scan.rows = dsld.ingredients.map(ing => {
    const supp = _scanMatchSupp(ing.name);
    const curated = !!(supp && !supp.custom);
    return { name: curated ? supp.name : ing.name, dose: ing.dose, unit: ing.unit || 'mg', verified: curated, dsld: true };
  });
  scanRenderReview();
  _scanAssess();
}

// Fallback / "not listed": trust the vision ingredients (curated match -> Verified, else AI-guess).
function scanUseVision() {
  _scan.source = 'vision';
  _scan.rows = _scan.visionRows || [];
  if (!_scan.rows.length) return scanError(_sl('讀唔到任何成分,影清楚啲', 'No ingredients found, re-shoot more clearly'));
  scanRenderReview();
  _scanAssess();   // best-effort AI interaction layer for the read (fires in background)
}

// ── STATE: review (editable, prefilled) ──
function scanRenderReview() {
  const rows = _scan.rows.map((row, i) => {
    const badge = row.dsld
      ? `<span class="badge badge-verified">✓ NIH DSLD</span>`
      : row.verified
        ? `<span class="badge badge-verified">✓ ${_sl('已核實', 'Verified')}</span>`
        : `<span class="badge badge-ai">~ ${_sl('AI 推測', 'AI-guess')}</span>`;
    return `<div class="scan-row">
        <input class="scan-in scan-in-name" id="scan-name-${i}" value="${_esc(row.name)}" aria-label="ingredient name">
        <input class="scan-in scan-in-dose" id="scan-dose-${i}" value="${_esc(row.dose)}" inputmode="decimal" aria-label="dose">
        <input class="scan-in scan-in-unit" id="scan-unit-${i}" value="${_esc(row.unit)}" aria-label="unit">
        ${badge}
        <button class="scan-del" title="${_sl('刪除', 'Remove')}" aria-label="remove row" onclick="scanDelRow(${i})">✕</button>
      </div>`;
  }).join('');

  _scanShell(
    `<div class="rm-header">
       <span class="rm-slot-emoji">📋</span>
       <div style="flex:1;min-width:0">
         <input id="scanProdName" value="${_esc(_scan.productName)}"
           placeholder="${_sl('改個產品名(例如 D3+K2)', 'Name this product (e.g. D3+K2)')}"
           oninput="_scan.productName=this.value" aria-label="product name"
           style="font-size:16px;font-weight:700;color:var(--text);border:none;border-bottom:1px dashed var(--border);background:transparent;width:100%;padding:1px 0;outline:none">
         <div class="rm-subtitle" style="margin-top:4px">${_scan.source==='dsld'
            ? _sl('✅ 喺 NIH DSLD 揾到 — 官方成分,改名 / 核對就入庫', '✅ Matched NIH DSLD — official ingredients, name it & save')
            : _sl('AI 已填,改名 / 核對 / 改 / 刪,啱就入庫', 'AI filled these in — name it, check, edit, remove, then save')}</div>
       </div>
     </div>
     ${_scan.source==='dsld' ? `<div style="background:#eef6f0;border:1px solid #cfe6d6;border-radius:8px;padding:8px 11px;margin-bottom:10px;font-size:12px;color:#2d6a4f">${_sl('成分嚟自美國 NIH 膳食補充劑標籤資料庫 (DSLD),非 AI 估算。', 'Ingredients are from the U.S. NIH Dietary Supplement Label Database (DSLD), not an AI guess.')}</div>` : ''}
     <div class="rm-list" style="max-height:46vh">${rows}</div>
     <button class="btn btn-outline" style="width:100%;margin-bottom:10px" onclick="scanAddRow()">+ ${_sl('加一行', 'Add a row')}</button>
     <div style="font-size:11px;color:var(--text-muted);margin-bottom:10px;line-height:1.5">
       ${_sl('🟡 AI 推測 = 唔喺已核實資料庫,僅供參考,非醫療建議。', '🟡 AI-guess = not in the verified database, for reference only, not medical advice.')}
     </div>
     <div class="rm-actions">
       <button class="btn btn-outline" style="flex:1" onclick="scanClose()">${_sl('取消', 'Cancel')}</button>
       <button class="btn btn-primary" style="flex:1" onclick="scanConfirm()">${_sl('確認入庫', 'Confirm')}</button>
     </div>`
  );
}

function _readRows() {
  return _scan.rows.map((row, i) => {
    const g = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
    return {
      name: g(`scan-name-${i}`) || row.name,
      dose: g(`scan-dose-${i}`),
      unit: g(`scan-unit-${i}`) || 'mg',
      verified: row.verified,
      dsld: !!row.dsld
    };
  }).filter(r => r.name);
}

function scanDelRow(i) { _scan.rows = _readRows().filter((_, j) => j !== i); scanRenderReview(); }
function scanAddRow()  { _scan.rows = _readRows().concat([{ name: '', dose: '', unit: 'mg', verified: false }]); scanRenderReview(); }

// ── confirm -> Product -> logProduct -> read ──
function scanConfirm() {
  const rows = _readRows();
  if (!rows.length) return scanError(_sl('冇成分可入庫', 'No ingredients to save'));

  const customSupps = rows.filter(r => !r.verified).map(r => ({
    name: r.name, custom: true,
    aiSuggested: !r.dsld,            // DSLD-sourced ingredients are authoritative, not AI guesses
    dsld: !!r.dsld,
    aiNote: r.dsld ? 'NIH DSLD' : _sl('AI 推測·未核實', 'AI-suggested · unverified'),
    conflicts: []
  }));
  const product = {
    id: 'prod-' + Date.now(),
    name: _scan.productName || _sl('掃描產品', 'Scanned product'),
    ingredients: rows.map(r => ({ name: r.name, dose: r.dose, unit: r.unit, verified: r.verified })),
    customSupps,
    createdAt: todayStr()
  };

  const read = logProduct(product);
  scanRenderRead(read);
}

// ── STATE: read (safety-first: high/med conflicts on top, then absorption) ──
function scanRenderRead(read) {
  if (!read) return scanClose();
  const all = (read.conflicts || []).map(c => ({ a: c.a, b: c.b, sev: c.sev, note: c.note, src: 'verified' }))
    .concat((read.medConflicts || []).map(c => ({ a: c.supplement, b: c.medication, sev: c.sev, note: c.note, src: 'verified' })))
    .concat((_scan.interactions || []).map(c => ({ a: c.a, b: c.b, sev: c.severity, note: c.note, src: 'ai' })));

  const rank = { high: 0, moderate: 1, medium: 1, low: 2, positive: 3 };
  all.sort((x, y) => (rank[x.sev] ?? 2) - (rank[y.sev] ?? 2));

  const conflictHtml = all.length ? all.map(c => {
    const danger = c.sev === 'high';
    const tag = c.src === 'verified'
      ? `<span class="badge badge-verified">✓ ${_sl('已核實', 'Verified')}</span>`
      : `<span class="badge badge-ai">~ ${_sl('AI 推測', 'AI-guess')}</span>`;
    return `<div class="scan-conflict ${danger ? 'scan-conflict-high' : ''}">
        <div style="font-weight:600;font-size:13.5px">${danger ? '⚠️ ' : ''}${_esc(c.a)} × ${_esc(c.b)} ${tag}</div>
        ${c.note ? `<div style="font-size:12px;color:var(--text-muted);margin-top:2px">${_esc(c.note)}</div>` : ''}
      </div>`;
  }).join('') : `<div style="padding:10px 0;color:var(--text-muted);font-size:13px">${_sl('未見明顯衝突 ✓', 'No notable conflicts ✓')}</div>`;

  _scanShell(
    `<div class="rm-header">
       <span class="rm-slot-emoji">${all.some(c => c.sev === 'high') ? '⚠️' : '✅'}</span>
       <div>
         <div class="rm-title">${_esc(read.product.name)}</div>
         <div class="rm-subtitle">${_sl('已入庫', 'Saved')} · ${read.entries.length} ${_sl('種成分', 'ingredients')}</div>
       </div>
     </div>
     <div class="rm-list" style="max-height:50vh;gap:8px">${conflictHtml}</div>
     ${_scan.interactions && _scan.interactions.length ? `<div style="font-size:11px;color:var(--text-muted);margin-bottom:10px;line-height:1.5">${_sl('🟡 AI 推測·未核實,非醫療建議。', '🟡 AI-suggested · unverified, not medical advice.')}</div>` : ''}
     <div class="rm-actions">
       <button class="btn btn-primary" style="width:100%" onclick="scanClose();go('dashboard')">${_sl('完成', 'Done')}</button>
     </div>`
  );
}

// Best-effort AI interaction layer — fills _scan.interactions for the read screen.
async function _scanAssess() {
  try {
    const names = _scan.rows.map(r => r.name).filter(Boolean);
    if (!names.length) return;
    const r = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'assess', ingredients: names, medications: (S.profile.medications || []) })
    });
    if (!r.ok) return;
    const d = await r.json();
    _scan.interactions = Array.isArray(d.interactions) ? d.interactions : [];
  } catch (_) { /* non-blocking: read still shows curated conflicts */ }
}

function _esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
