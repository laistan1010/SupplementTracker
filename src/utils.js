// ─── utils.js ─────────────────────────────────────────

// ════════════════════════════════════════════════════
//  CONFLICT DETECTION
// ════════════════════════════════════════════════════
function detectConflicts(loggedList) {
  const names = loggedList.map(l => l.name.toLowerCase());
  const found = [];
  const seen = new Set();

  for (const log of loggedList) {
    const sup = DB.find(s => s.name === log.name);
    if (!sup) continue;
    for (const c of (sup.conflicts || [])) {
      if (c.sev === 'positive') continue;
      if (names.some(n => n === c.name.toLowerCase())) {
        const key = [sup.name, c.name].sort().join('|');
        if (!seen.has(key)) {
          seen.add(key);
          found.push({ a: sup.name, b: c.name, note: c.note, sev: c.sev });
        }
      }
    }
  }
  return found;
}

// Cross-references logged supplements against the user's profile medications
function detectMedConflicts(loggedList) {
  const userMeds = (S.profile.medications || []);
  if (!userMeds.length || !loggedList.length) return [];

  // Match each saved med string to MEDICATION_DB entries
  const matchedMeds = MEDICATION_DB.filter(med =>
    userMeds.some(um => {
      const uml = um.toLowerCase().trim();
      return uml === med.name.toLowerCase() ||
        (med.aliases||[]).some(a => {
          const al = a.toLowerCase();
          return uml === al || uml.includes(al) || al.includes(uml);
        });
    })
  );

  const results = [];
  const seen    = new Set();

  loggedList.forEach(log => {
    const sup = DB.find(s => s.name === log.name);
    if (!sup) return;
    (sup.conflicts||[]).forEach(conflict => {
      const cName = conflict.name.toLowerCase();

      // Psyllium "ALL medications" special case
      if (cName.includes('all medication')) {
        userMeds.forEach(um => {
          const k = `${log.name}||${um}`;
          if (!seen.has(k)) { seen.add(k); results.push({ supplement:log.name, medication:um, sev:conflict.sev, note:conflict.note }); }
        });
        return;
      }

      matchedMeds.forEach(med => {
        const hit = (med.conflictKeys||[]).some(ck => {
          const ckl = ck.toLowerCase();
          return cName.includes(ckl) || ckl.includes(cName);
        });
        if (hit) {
          const k = `${log.name}||${med.name}`;
          if (!seen.has(k)) { seen.add(k); results.push({ supplement:log.name, medication:med.name, sev:conflict.sev, note:conflict.note }); }
        }
      });
    });
  });

  // High severity first
  return results.sort((a,b) => (a.sev==='high'?-1 : b.sev==='high'?1 : 0));
}

// ════════════════════════════════════════════════════
//  NAVIGATION
// ════════════════════════════════════════════════════
function go(view) {
  S.view = view;
  document.querySelectorAll('.nav-item').forEach(el =>
    el.classList.toggle('active', el.dataset.view === view));
  document.querySelectorAll('.bn-item').forEach(el =>
    el.classList.toggle('active', el.dataset.view === view));
  closeSidebar(); // auto-close on mobile when navigating
  render();
}

function toggleSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebarOverlay');
  const isOpen   = sidebar.classList.contains('open');
  sidebar.classList.toggle('open', !isOpen);
  overlay.classList.toggle('show', !isOpen);
}

function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebarOverlay')?.classList.remove('show');
}

// ════════════════════════════════════════════════════
//  RENDER HELPERS
// ════════════════════════════════════════════════════
function timingBadge(t) {
  const m = {
    morning:{ cls:'badge-morning', lbl:'Morning' },
    evening:{ cls:'badge-evening', lbl:'Evening' },
    anytime:{ cls:'badge-anytime', lbl:'Anytime' },
    meals:  { cls:'badge-meals',   lbl:'With Meals' }
  };
  const x = m[t]||m.anytime;
  return `<span class="badge ${x.cls}">${x.lbl}</span>`;
}

function macroBadgeCls(macro) {
  const m = {fat:'badge-fat',carbs:'badge-carbs',protein:'badge-protein',
             water:'badge-water',food:'badge-food',empty:'badge-empty'};
  return m[macro]||'badge-food';
}

function scorePill(label, score) {
  const cls = score>=75?'sp-excellent':score>=50?'sp-good':'sp-poor';
  return `<span class="score-pill ${cls}">${label}</span>`;
}

function scoreBar(score, label) {
  const cls = score>=75?'sc-excellent':score>=50?'sc-good':'sc-poor';
  return `
    <div class="score-wrap ${cls}">
      <div class="score-row">
        <span>Absorption (optimal conditions)</span>
        <strong>${label} — ${score}%</strong>
      </div>
      <div class="score-bar"><div class="score-fill" style="width:${score}%"></div></div>
    </div>`;
}

function liveScore(sup, macros) {
  // Accept array or legacy string
  const sel = Array.isArray(macros) ? macros : (macros ? [macros] : []);
  if (!sel.length) return '';
  const opt       = sup.absorption.macro;
  const hasNofood = sel.includes('nofood');
  const foodSel   = sel.filter(m => m !== 'nofood');

  let score, label, msg;

  // ── exact match (e.g. opt='fat' and user selected fat) ──
  if (sel.includes(opt)) {
    score = sup.absorption.score; label = 'Excellent';
    msg = `✅ Optimal! ${sup.name} absorbs best ${sup.absorption.macroLabel}.`;

  // ── supplement just needs "any food" and user picked at least one food macro ──
  } else if (opt === 'food' && foodSel.length > 0) {
    score = Math.round(sup.absorption.score * 0.88); label = 'Excellent';
    msg = `✅ Great — any food works well for ${sup.name}.`;

  // ── supplement prefers empty/no-food and user selected No Food ──
  } else if (hasNofood && (opt === 'empty' || opt === 'water')) {
    score = sup.absorption.score; label = 'Excellent';
    msg = `✅ Optimal! ${sup.name} absorbs best on an empty stomach.`;

  // ── supplement needs fat or protein and user has one of them ──
  } else if (['fat','protein'].includes(opt) && foodSel.some(m => ['fat','protein'].includes(m))) {
    score = Math.round(sup.absorption.score * 0.78); label = 'Good';
    msg = `⚡ Good, but best with ${sup.absorption.macroLabel} specifically.`;

  // ── supplement needs food but user chose No Food ──
  } else if (hasNofood && !['empty','water'].includes(opt)) {
    score = Math.round(sup.absorption.score * 0.38); label = 'Poor';
    msg = `⚠️ Poor without food. ${sup.name} needs ${sup.absorption.macroLabel} for proper absorption.`;

  // ── supplement needs empty stomach but user is eating ──
  } else if ((opt === 'empty' || opt === 'water') && foodSel.length > 0) {
    score = Math.round(sup.absorption.score * 0.58); label = 'Moderate';
    msg = `⚡ Food slows absorption. ${sup.name} absorbs faster on an empty stomach.`;

  } else {
    score = Math.round(sup.absorption.score * 0.62); label = 'Moderate';
    msg = `⚡ Can be better. Optimal: ${sup.absorption.macroLabel}.`;
  }

  const cls = score >= 75 ? 'sc-excellent' : score >= 50 ? 'sc-good' : 'sc-poor';
  return `
    <div class="live-score">
      <div class="live-score-title">Live Absorption Score</div>
      <div class="score-wrap ${cls}">
        <div class="score-row"><span>${msg}</span><strong>${score}%</strong></div>
        <div class="score-bar"><div class="score-fill" style="width:${score}%"></div></div>
      </div>
    </div>`;
}
