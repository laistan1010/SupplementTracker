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

// Same DB-match predicate as dsldMatchIngredients (app.js): name/alias substring match.
// Unlike that function we KEEP non-matches (decision A: never silently drop an ingredient).
function _scanMatchSupp(name) {
  const n = (name || '').toLowerCase();
  if (!n) return null;
  return DB.find(s =>
    n.includes(s.name.toLowerCase()) ||
    (s.aliases || []).some(a => n.includes(a.toLowerCase()))
  ) || null;
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
         <div class="rm-subtitle">${_sl('影 Supplement Facts 嗰一面,夠光夠清', 'Shoot the Supplement Facts panel, well-lit and sharp')}</div>
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
  const reader = new FileReader();
  reader.onload = () => scanParse(reader.result);          // result = data:image/...;base64,...
  reader.onerror = () => scanError(_sl('讀唔到張相,再試', 'Could not read the photo, try again'));
  reader.readAsDataURL(file);
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
  _scan.rows = ings.map(ing => {
    const supp = _scanMatchSupp(ing.name);
    return {
      name: supp ? supp.name : ing.name,         // prefer the canonical DB name when matched
      dose: ing.dose != null ? String(ing.dose) : '',
      unit: ing.unit || (supp && supp.doses && supp.doses[0] && supp.doses[0].unit) || 'mg',
      verified: !!supp
    };
  });
  scanRenderReview();
  _scanAssess();   // best-effort AI interaction layer for the read (fires in background)
}

// ── STATE: review (editable, prefilled) ──
function scanRenderReview() {
  const rows = _scan.rows.map((row, i) => {
    const badge = row.verified
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
       <div>
         <div class="rm-title">${_esc(_scan.productName) || _sl('核對成分', 'Check the ingredients')}</div>
         <div class="rm-subtitle">${_sl('AI 已填,核對 / 改 / 刪,啱就入庫', 'AI filled these in — check, edit, remove, then save')}</div>
       </div>
     </div>
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
      verified: row.verified
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
    name: r.name, custom: true, aiSuggested: true, aiNote: _sl('AI 推測·未核實', 'AI-suggested · unverified'), conflicts: []
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
