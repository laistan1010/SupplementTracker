// ─── plan.js ──────────────────────────────────────────
//  Goal-based plan: scan your shelf -> pick goals (Focus / Gym / Immune) -> a deterministic
//  daily plan (what to take, when, with what food) built ONLY from curated DB data.
//  No AI decides anything here: timing/absorption/conflicts all trace to the curated DB
//  (Examine-sourced) — same reasoning as the NIH-DSLD-over-vision decision for scanning.

const GOALS = {
  focus: {
    emoji: '🧠',
    label: () => _sl('專注', 'Focus'),
    names: ['Alpha-GPC', 'L-Theanine', 'Pre-Workout (Caffeine)', 'Bacopa Monnieri', "Lion's Mane Mushroom"],
    cats: /nootropic/i,
    core: ['Alpha-GPC', 'L-Theanine']            // gap hints — most evidence-backed for the goal
  },
  gym: {
    emoji: '💪',
    label: () => _sl('健身', 'Gym'),
    names: ['Creatine', 'Whey Protein', 'Beta-Alanine', 'L-Citrulline', 'BCAAs', 'EAAs'],
    cats: /^gym|performance|sports/i,
    core: ['Creatine', 'Whey Protein']
  },
  immune: {
    emoji: '🛡️',
    label: () => _sl('免疫', 'Immune'),
    names: ['Vitamin C', 'Vitamin D3', 'Zinc', 'Elderberry', 'Echinacea', 'Quercetin', 'NAC (N-Acetyl Cysteine)'],
    cats: /immune/i,
    core: ['Vitamin C', 'Vitamin D3', 'Zinc']
  }
};

// Unique ingredients across every scanned product, mapped onto the curated DB.
// Exact name first (scan already canonicalises curated matches), whole-word matcher as fallback
// for DSLD-verbatim names. sup:null / sup.custom => no reliable timing data (grouped honestly).
function planShelfItems() {
  const seen = {};
  (S.products || []).forEach(p => (p.ingredients || []).forEach(ing => {
    const key = (ing.name || '').toLowerCase().trim();
    if (!key || seen[key]) { if (seen[key] && !seen[key].dose && ing.dose) { seen[key].dose = ing.dose; seen[key].unit = ing.unit; } return; }
    const sup = DB.find(s => s.name.toLowerCase() === key) || _scanMatchSupp(ing.name);
    seen[key] = { name: sup ? sup.name : ing.name, dose: ing.dose || '', unit: ing.unit || '', sup: sup || null, from: p.name };
  }));
  return Object.values(seen);
}

function planGoalTags(sup, goals) {
  if (!sup) return [];
  return goals.filter(g => {
    const G = GOALS[g];
    return G && (G.names.includes(sup.name) || G.cats.test(sup.category || ''));
  });
}

// The deterministic plan: time slots + food pairing + conflicts + synergies + goal gaps.
function buildPlan(goals) {
  const items = planShelfItems();
  const slots = { morning: [], anytime: [], evening: [], nodata: [] };

  items.forEach(it => {
    const ab = it.sup && it.sup.absorption;
    // Include anything with real guidance — curated (Verified) OR class-based (General).
    // Only truly unknown ingredients (N/A) fall to the no-data group.
    if (!ab || typeof ab.macro !== 'string' || ab.scoreLabel === 'N/A') { slots.nodata.push(it); return; }
    it.tags = planGoalTags(it.sup, goals);
    const t0 = it.sup.timing === 'meals' ? 'morning' : (it.sup.timing || 'anytime');
    (slots[t0] || slots.anytime).push(it);
  });
  ['morning', 'anytime', 'evening'].forEach(k =>
    slots[k].sort((a, b) => (b.tags ? b.tags.length : 0) - (a.tags ? a.tags.length : 0)));

  const namesOnShelf = items.map(i => ({ name: i.name }));
  const shelfSet = new Set(items.map(i => i.name.toLowerCase()));

  const conflicts = detectConflicts(namesOnShelf);

  const synergies = [];
  const seenSyn = new Set();
  items.forEach(it => {
    if (!it.sup) return;
    (it.sup.conflicts || []).filter(c => c.sev === 'positive').forEach(c => {
      if (shelfSet.has((c.name || '').toLowerCase())) {
        const k = [it.sup.name, c.name].sort().join('|');
        if (!seenSyn.has(k)) { seenSyn.add(k); synergies.push({ a: it.sup.name, b: c.name, note: c.note }); }
      }
    });
  });

  const gaps = {};
  goals.forEach(g => {
    const missing = (GOALS[g].core || []).filter(n => !shelfSet.has(n.toLowerCase()));
    if (missing.length) gaps[g] = missing;
  });

  return { items, slots, conflicts, synergies, gaps };
}

function togglePlanGoal(g) {
  S.goals = S.goals || [];
  const i = S.goals.indexOf(g);
  if (i >= 0) S.goals.splice(i, 1); else S.goals.push(g);
  save();
  render();
}

// Write the plan into the existing Schedule feature (slot + all days) so the reminder
// machinery already built does the daily nudging. Existing entries are not overwritten.
function applyPlanToSchedule() {
  const plan = buildPlan(S.goals || []);
  let added = 0;
  const slotMap = { morning: 'morning', anytime: 'afternoon', evening: 'evening' };
  ['morning', 'anytime', 'evening'].forEach(k => plan.slots[k].forEach(it => {
    if (!S.schedule[it.name]) { S.schedule[it.name] = { slot: slotMap[k], days: [...DAYS] }; added++; }
  }));
  save();
  toast(_sl(`已加入 ${added} 項到你嘅時間表`, `Added ${added} items to your schedule`));
  go('schedule');
}

function _planItemRow(it) {
  const s = it.sup;
  const tags = (it.tags || []).map(g => `<span title="${GOALS[g].label()}">${GOALS[g].emoji}</span>`).join(' ');
  return `
    <div class="log-item" style="align-items:flex-start">
      <div class="log-emoji" style="background:${s.color}22;color:${s.color};font-size:14px;font-weight:800">${s.name[0].toUpperCase()}</div>
      <div class="li">
        <div class="ln">${_esc(it.name)} ${tags}${it.dose ? ` <span style="font-weight:400;font-size:12px;color:var(--text-muted)">${_esc(it.dose)} ${_esc(it.unit)}</span>` : ''}</div>
        <div class="lm">
          <span class="badge ${macroBadgeCls(s.absorption.macro)}">${_esc(s.absorption.macroLabel.split(' ').slice(1).join(' '))}</span>
          <span style="font-size:11.5px;color:var(--text-muted)">${_esc(s.absorption.tip)}</span>
        </div>
      </div>
    </div>`;
}

function vPlan() {
  const goals = S.goals || [];
  const chips = Object.keys(GOALS).map(g => `
    <button class="btn ${goals.includes(g) ? 'btn-primary' : 'btn-outline'}" style="flex:1"
      onclick="togglePlanGoal('${g}')">${GOALS[g].emoji} ${GOALS[g].label()}</button>`).join('');

  if (!S.products || !S.products.length) {
    return `
      <div class="page-header"><h2>${_sl('我嘅計劃', 'My Plan')}</h2>
        <p>${_sl('掃晒你啲補充劑,我幫你安排幾時食、點搭配', 'Scan your supplements and get a when-and-how plan')}</p></div>
      <div class="empty" style="background:#fff;border-radius:12px;border:1px solid var(--border)">
        <div class="ei">📷</div>
        <h3>${_sl('你個架仲係空嘅', 'Your shelf is empty')}</h3>
        <p>${_sl('去 Log 頁掃第一支,或者影樽正面', 'Scan your first bottle from the Log tab')}</p>
        <button class="btn btn-primary" style="margin-top:10px" onclick="scanOpen(true)">📷 ${_sl('掃第一支', 'Scan your first bottle')}</button>
      </div>`;
  }

  const plan = buildPlan(goals);
  const slotMeta = [
    ['morning', '🌅', _sl('早晨', 'Morning')],
    ['anytime', '🌤', _sl('任何時間', 'Anytime')],
    ['evening', '🌙', _sl('夜晚', 'Evening')]
  ];

  const slotHTML = slotMeta.map(([k, em, lbl]) => plan.slots[k].length ? `
    <h3 style="font-size:14.5px;font-weight:700;margin:16px 0 8px">${em} ${lbl}</h3>
    ${plan.slots[k].map(_planItemRow).join('')}` : '').join('');

  const nodataHTML = plan.slots.nodata.length ? `
    <h3 style="font-size:14.5px;font-weight:700;margin:16px 0 8px">❔ ${_sl('未有時間資料', 'No timing data')}</h3>
    <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px">${_sl('呢啲成分唔喺已核實資料庫,自己斟酌或者問醫生', 'Not in the verified database — use your judgement or ask a professional')}</div>
    ${plan.slots.nodata.map(it => `<div class="log-item"><div class="li"><div class="ln">${_esc(it.name)}</div><div class="lm"><span class="badge badge-ai">~ ${_sl('無資料', 'No data')}</span></div></div></div>`).join('')}` : '';

  const confHTML = plan.conflicts.length ? `
    <div class="conflict-banner" style="margin-top:16px">
      <h4>⚠️ ${_sl('隔開嚟食', 'Space these out')}</h4>
      <ul>${plan.conflicts.map(c => `<li><span>→</span><span><strong>${_esc(c.a)} × ${_esc(c.b)}:</strong> ${_esc(c.note)}</span></li>`).join('')}</ul>
    </div>` : '';

  const synHTML = plan.synergies.length ? `
    <div style="background:#eef6f0;border:1px solid #cfe6d6;border-radius:10px;padding:11px 13px;margin-top:12px">
      <div style="font-weight:700;font-size:13px;margin-bottom:5px">✅ ${_sl('一齊食更好', 'Better together')}</div>
      ${plan.synergies.map(c => `<div style="font-size:12.5px;margin-bottom:3px"><strong>${_esc(c.a)} + ${_esc(c.b)}</strong> — ${_esc(c.note)}</div>`).join('')}
    </div>` : '';

  const gapHTML = Object.keys(plan.gaps).length ? `
    <div style="font-size:12px;color:var(--text-muted);margin-top:12px;line-height:1.6">
      ${Object.entries(plan.gaps).map(([g, names]) =>
        `💡 ${GOALS[g].emoji} ${_sl('想加強', 'For more')} ${GOALS[g].label()}${_sl('可以考慮', ', consider')}: <strong>${names.map(_esc).join(', ')}</strong>`).join('<br>')}
      <div style="margin-top:4px">${_sl('(參考 Examine.com 證據,非醫療建議)', '(Evidence via Examine.com — not medical advice)')}</div>
    </div>` : '';

  return `
    <div class="page-header"><h2>${_sl('我嘅計劃', 'My Plan')}</h2>
      <p>${_sl('根據你掃咗嘅 {n} 支產品,自動安排時間同搭配', 'Built from your {n} scanned products — timing and pairings').replace('{n}', S.products.length)}</p></div>
    <div style="display:flex;gap:8px;margin-bottom:6px">${chips}</div>
    <div style="font-size:11.5px;color:var(--text-muted);margin-bottom:10px">${_sl('揀目標會標記相關成分同俾建議', 'Pick goals to tag relevant items and get hints')}</div>
    ${slotHTML}
    ${nodataHTML}
    ${confHTML}
    ${synHTML}
    ${gapHTML}
    <button class="btn btn-primary" style="width:100%;margin-top:18px" onclick="applyPlanToSchedule()">⏰ ${_sl('套用到我嘅時間表', 'Apply to my Schedule')}</button>
    <div style="font-size:11px;color:var(--text-muted);margin-top:10px;text-align:center">${_sl('所有建議嚟自已核實資料庫,非醫療建議', 'All suggestions come from the verified database — not medical advice')}</div>`;
}

// ── ONBOARDING: scan your shelf -> pick goals -> plan ──
let _obStep = 1;

function obNext() { _obStep = 2; render(); }
function obBack() { _obStep = 1; render(); }
function obSkip() { S.onboarded = true; save(); go('dashboard'); }
function obFinish() {
  S.onboarded = true;
  save();
  _obStep = 1;
  go('plan');
}

function vOnboard() {
  if (_obStep === 1) {
    const n = (S.products || []).length;
    return `
      <div style="max-width:480px;margin:30px auto;text-align:center">
        <div style="font-size:44px;margin-bottom:12px">📷</div>
        <h2 style="font-size:22px;font-weight:800;margin-bottom:8px">${_sl('掃晒你啲補充劑', 'Scan your supplements')}</h2>
        <p style="color:var(--text-muted);font-size:14px;line-height:1.6;margin-bottom:18px">
          ${_sl('影每支樽嘅正面,我會喺 NIH 官方資料庫對返成分。掃完晒,我就可以話你知幾時食咩、點搭配。', 'Shoot the front of each bottle — ingredients come from the official NIH database. When your shelf is done, you get a personal when-and-what plan.')}
        </p>
        <button class="btn btn-primary" style="width:100%;margin-bottom:10px" onclick="scanOpen(true)">📷 ${n ? _sl('掃多支', 'Scan another') : _sl('掃第一支', 'Scan your first bottle')}</button>
        ${n ? `
          <div style="font-size:13px;color:var(--text-muted);margin:10px 0">${_sl('已掃', 'Scanned')} <strong>${n}</strong> ${_sl('支', n > 1 ? 'bottles' : 'bottle')}: ${_esc((S.products || []).map(p => p.name).join(' · '))}</div>
          <button class="btn btn-primary" style="width:100%;margin-bottom:10px;background:var(--primary-dark,#2d6a4f)" onclick="obNext()">${_sl('掃完喇 → 揀目標', 'Done scanning → pick goals')}</button>` : ''}
        <button class="btn btn-outline" style="width:100%" onclick="obSkip()">${_sl('略過,直接用 app', 'Skip — just use the app')}</button>
      </div>`;
  }
  const goals = S.goals || [];
  return `
    <div style="max-width:480px;margin:30px auto;text-align:center">
      <div style="font-size:44px;margin-bottom:12px">🎯</div>
      <h2 style="font-size:22px;font-weight:800;margin-bottom:8px">${_sl('你想達成啲咩?', 'What are you optimising for?')}</h2>
      <p style="color:var(--text-muted);font-size:14px;margin-bottom:18px">${_sl('可以揀多過一個', 'Pick as many as you like')}</p>
      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:18px">
        ${Object.keys(GOALS).map(g => `
          <button class="btn ${goals.includes(g) ? 'btn-primary' : 'btn-outline'}" style="width:100%;padding:14px"
            onclick="togglePlanGoal('${g}')">${GOALS[g].emoji} ${GOALS[g].label()}</button>`).join('')}
      </div>
      <button class="btn btn-primary" style="width:100%;margin-bottom:10px" onclick="obFinish()">✨ ${_sl('生成我嘅計劃', 'Build my plan')}</button>
      <button class="btn btn-outline" style="width:100%" onclick="obBack()">${_sl('返上一步', 'Back')}</button>
    </div>`;
}
