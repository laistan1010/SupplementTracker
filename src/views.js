// ─── views.js ─────────────────────────────────────────
// ════════════════════════════════════════════════════
//  VIEWS
// ════════════════════════════════════════════════════

/* ── DASHBOARD ── */
function vDashboard() {
  const today = todayStr();
  const logged = S.loggedToday;
  const allDates = new Set([...S.history.map(h=>h.date),...(logged.length?[today]:[])]);
  const conflicts    = detectConflicts(logged);
  const medConflicts = detectMedConflicts(logged);

  let streak=0, d=new Date();
  while(true){
    const ds=d.toISOString().split('T')[0];
    if(allDates.has(ds)){streak++;d.setDate(d.getDate()-1);}else break;
  }

  const noProfile = !S.profile.name;

  return `
    <div class="dash-hero">
      <div class="dash-hero-overlay">
        <div class="dash-hero-date">${new Date().toLocaleDateString(LANG==='zh'?'zh-HK':'en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
        <div class="dash-hero-name">${S.profile.name?`${t('dash_good_day')} ${S.profile.name}`:t('dash_welcome')}</div>
        <div class="dash-hero-sub">${logged.length?t('dash_logged_today').replace('{n}',logged.length).replace('{s}',logged.length>1?'s':''):t('dash_logged_0')}</div>
      </div>
    </div>

    ${noProfile?`
      <div class="setup-cta">
        <div class="sc-icon"><svg width="44" height="44" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="18" r="18" fill="#588768"/><g transform="translate(8.5,7) scale(0.8)" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></g></svg></div>
        <div class="sc-text" style="flex:1">
          <strong>${t('dash_setup_title')}</strong>
          <p>${t('dash_setup_desc')}</p>
        </div>
        <button class="btn btn-primary btn-sm" onclick="go('profile')">${t('btn_setup')}</button>
      </div>`:''}

    <div class="stats-grid">
      <div class="stat-card">
        <div class="s-label">${t('stat_logged_today')}</div>
        <div class="s-value" style="color:var(--primary)">${logged.length}</div>
        <div class="s-sub">${t('stat_supplements')}</div>
      </div>
      <div class="stat-card">
        <div class="s-label">${t('stat_days_tracked')}</div>
        <div class="s-value" style="color:var(--primary)">${allDates.size}</div>
        <div class="s-sub">${t('stat_total_days')}</div>
      </div>
      <div class="stat-card">
        <div class="s-label">${t('stat_streak')}</div>
        <div class="s-value" style="color:var(--primary)">${streak}</div>
        <div class="s-sub">${t('stat_days_row')}</div>
      </div>
    </div>

    <div class="quick-actions">
      <div class="qa-card" onclick="go('search')">
        <div class="qa-icon" style="background:var(--primary-light)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <div class="qa-title">${t('qa_search_title')}</div>
        <div class="qa-desc">${t('qa_search_desc')}</div>
      </div>
      <div class="qa-card" onclick="go('history')">
        <div class="qa-icon" style="background:var(--primary-light)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/></svg>
        </div>
        <div class="qa-title">${t('qa_history_title')}</div>
        <div class="qa-desc">${t('qa_history_desc')}</div>
      </div>
    </div>

    ${renderTodayPlan()}

    ${medConflicts.length?`
      <div class="med-conflict-banner">
        <h4><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg> ${t('conflict_med_n').replace('{n}',medConflicts.length).replace('{s}',medConflicts.length>1?'s':'')}</h4>
        <ul>${medConflicts.map(c=>`
          <li><span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${c.sev==='high'?'<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>':'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>'}</svg></span>
            <div><strong>${c.supplement} × ${c.medication}:</strong> ${c.note}</div>
          </li>`).join('')}
        </ul>
        <div class="med-disclaimer">${t('conflict_consult')}</div>
      </div>`:''}

    ${conflicts.length?`
      <div class="conflict-banner">
        <h4><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg> ${t('conflict_today_n').replace('{n}',conflicts.length).replace('{s}',conflicts.length>1?'s':'')}</h4>
        <ul>${conflicts.map(c=>`
          <li><span>→</span>
            <span><strong>${c.a} × ${c.b}:</strong> ${c.note}</span>
          </li>`).join('')}
        </ul>
      </div>`:''}

    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:13px">
      <h3 style="font-size:15.5px;font-weight:700">${t('today_supps')}</h3>
      <button class="btn btn-primary btn-sm" onclick="go('log')">${t('btn_log_supp')}</button>
    </div>

    ${logged.length===0?`
      <div class="empty" style="background:#fff;border-radius:12px;border:1px solid var(--border)">
        <div class="ei"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><circle cx="7.5" cy="12" r="1" fill="var(--primary)" stroke="none"/><circle cx="7.5" cy="16" r="1" fill="var(--primary)" stroke="none"/><path d="M10 12h7"/><path d="M10 16h5"/></svg></div>
        <h3>${t('empty_none_logged')}</h3>
        <p>${t('empty_click_log')}</p>
      </div>`
    :logged.map(log=>{
      const sup=DB.find(s=>s.name===log.name);
      if(!sup) return '';
      const hasConflict=conflicts.some(c=>c.a===log.name||c.b===log.name);
      return `
        <div class="log-item">
          <div class="log-emoji" style="background:${sup.color}22;color:${sup.color};font-size:14px;font-weight:800">${sup.name[0].toUpperCase()}</div>
          <div class="li">
            <div class="ln">${log.name}${hasConflict?` <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`:''}</div>
            <div class="lm">
              ${log.dose?`<span>${log.dose} ${log.unit}</span>`:''}
              ${timingBadge(sup.timing)}
              <span class="badge ${macroBadgeCls(sup.absorption.macro)}">${sup.absorption.macroLabel.split(' ').slice(1).join(' ')}</span>
              ${log.macro?`<span style="color:var(--text-muted);font-size:11px">${t('ate')} ${log.macro}</span>`:''}
              ${log.absorptionScore?`${scorePill(log.absorptionScore>=75?'Excellent':log.absorptionScore>=50?'Good':'Poor',log.absorptionScore)}`:''}
              <span style="color:var(--text-muted);font-size:11px">${log.time}</span>
            </div>
          </div>
          <button class="del-btn" onclick="delLog('${log.id}')" title="Remove">×</button>
        </div>`;
    }).join('')}

    ${logged.length?`
      <div style="margin-top:22px">
        <h3 style="font-size:14.5px;font-weight:700;margin-bottom:10px">${t('today_tips')}</h3>
        ${logged.map(log=>{
          const sup=DB.find(s=>s.name===log.name);
          if(!sup) return '';
          return `
            <div style="font-size:13px;padding:9px 12px;background:#fff;border-radius:8px;border:1px solid var(--border);margin-bottom:6px">
              <strong>${sup.name}</strong> — ${sup.absorption.tip}
              ${sup.pairsWith?`<span style="color:var(--success);margin-left:6px">· ${t('pairs_with')} <strong>${sup.pairsWith}</strong></span>`:''}
            </div>`;
        }).join('')}
      </div>`:''}

    ${renderStacks()}`;
}

function renderStacks() {
  return `
    <div style="margin-bottom:26px">
      <h3 style="font-size:15.5px;font-weight:700;margin-bottom:13px">${t('stacks_heading')}</h3>
      <div class="stacks-grid">
        ${STACKS.map(st => `
          <div class="stack-card" style="border-top:3px solid ${st.color}">
            <div class="stack-name">${st.name}</div>
            <div class="stack-tagline">${st.tagline}</div>
            <div class="stack-items">
              ${st.supplements.map(s => `
                <div class="stack-item">
                  <span class="stack-item-name" style="color:${st.color}">${s.name}</span>
                  <span class="stack-item-mech">${s.mechanism}</span>
                </div>`).join('')}
            </div>
            <div class="stack-source">${t('evidence_based')} · <a href="https://examine.com" target="_blank" style="color:${st.color};text-decoration:none;font-weight:600">Examine.com</a></div>
          </div>`).join('')}
      </div>
    </div>`;
}

/* ── SEARCH ── */
// Renders only the supplement cards (called on every keystroke — no DOM rebuild of the input)
function renderSearchResults(q) {
  const lq = (q||'').toLowerCase();
  const userTerms = [...(S.profile.conditions||[]),...(S.profile.medications||[])].map(x=>x.toLowerCase());
  const list = lq
    ? DB.filter(s=>s.name.toLowerCase().includes(lq)||s.category.toLowerCase().includes(lq)||(s.aliases||[]).some(a=>a.toLowerCase().includes(lq)))
    : DB;

  if (list.length===0) return `<div class="empty"><div class="ei"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></div><h3>${t('search_no_results')}</h3><p>${t('search_try_diff')}</p></div>`;

  return list.map(sup=>{
    const profileWarnings=(sup.healthWarnings||[]).filter(w=>userTerms.some(t=>w.toLowerCase().includes(t)||t.includes(w.toLowerCase())));
    const realConflicts=(sup.conflicts||[]).filter(c=>c.sev!=='positive');
    const synergies=(sup.conflicts||[]).filter(c=>c.sev==='positive');
    return `
      <div class="sup-card">
        <div class="sh">
          <div>
            <div class="sn">${sup.name}</div>
            <div class="sc">${sup.category}</div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="quickLog('${sup.name}')">${t('btn_log_quick')}</button>
        </div>
        <div class="badges-row">
          ${timingBadge(sup.timing)}
          <span class="badge ${macroBadgeCls(sup.absorption.macro)}">${sup.absorption.macroLabel.split(' ').slice(1).join(' ')}</span>
          ${scorePill(sup.absorption.scoreLabel, sup.absorption.score)}
        </div>
        ${scoreBar(sup.absorption.score, sup.absorption.scoreLabel)}
        <div class="tip-box">${sup.absorption.tip}</div>
        <div style="font-size:12px;color:var(--text-muted)"><em>${sup.timingNote}</em></div>
        ${sup.pairsWith?`<div class="pairs-row">· <strong>${t('pairs_with')} ${sup.pairsWith}:</strong> ${sup.pairsNote}</div>`:''}
        ${realConflicts.length?`
          <div class="section-label">${t('conflict_warnings')}</div>
          ${realConflicts.map(c=>`
            <div class="alert ${c.sev==='high'?'alert-danger':'alert-warn'}">
              <span class="ai"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${c.sev==='high'?'<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>':'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>'}</svg></span>
              <div class="at"><strong>${t('with_name')} ${c.name}</strong><p>${c.note}</p></div>
            </div>`).join('')}`:''}
        ${synergies.map(c=>`
          <div class="alert alert-green" style="margin-top:7px">
            <span class="ai"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
            <div class="at"><strong>${t('synergy_with')} ${c.name}</strong><p>${c.note}</p></div>
          </div>`).join('')}
        ${profileWarnings.length?`
          <div class="alert alert-danger" style="margin-top:7px">
            <span class="ai"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg></span>
            <div class="at"><strong>${t('profile_warning')}</strong>
              <p>${t('profile_caution')} ${profileWarnings.join('; ')}</p>
            </div>
          </div>`:''}
      </div>`;
  }).join('');
}

// Renders the search PAGE shell (input stays alive; only #sr gets re-rendered)
function vSearch() {
  return `
    <div class="page-header">
      <h2>${t('search_heading')}</h2>
      <p>${t('search_desc').replace('{n}',DB.length)}</p>
    </div>
    <div class="search-wrap">
      <span class="search-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b0a89e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></span>
      <input id="mainSearch" type="text"
        placeholder="${t('search_placeholder')}"
        value="${S.searchQ}"
        oninput="handleSearch(this.value)"
        autocomplete="off">
    </div>
    <div id="sr">${renderSearchResults(S.searchQ)}</div>`;
}

// Called on every keystroke — ONLY updates #sr, never re-renders the input
function handleSearch(val) {
  S.searchQ = val;
  const el = document.getElementById('sr');
  if (el) el.innerHTML = renderSearchResults(val);
}

/* ── LOG ── */
const MACROS = [
  {k:'fat',    lbl:'Fat',       hint:'Eating fat alongside — eggs, nuts, avocado, olive oil. Best for fat-soluble vitamins (D3, K2, A, E). Can combine with other macros.'},
  {k:'carbs',  lbl:'Carbs',     hint:'Eating carbs alongside — rice, bread, oats, fruit. Helps with creatine, some minerals and B vitamins. Can combine with other macros.'},
  {k:'protein',lbl:'Protein',   hint:'Eating protein alongside — meat, fish, dairy, eggs. Good for zinc, collagen, amino acids. Can combine with other macros.'},
  {k:'nofood', lbl:'No Food',   hint:'No food at all — just water. Stomach empty or 2+ hours since last meal. Best for 5-HTP, NAC, melatonin, citrulline, pre-workout. Selecting this clears food choices.'}
];

function renderSupInfo(sup) {
  if (!sup) return '';
  // Check for medication conflicts with THIS supplement
  const medHits = detectMedConflicts([{ name: sup.name }]);
  const medWarnHTML = medHits.length ? `
    <div class="med-warn-inline">
      <strong>${t('drug_interactions')}</strong>
      ${medHits.map(c=>`
        <div style="margin-bottom:3px"><strong>${c.medication}:</strong> ${c.note}</div>`).join('')}
      <div class="med-disclaimer" style="font-size:11px;padding:3px 8px;margin-top:6px">${t('consult_before')}</div>
    </div>` : '';

  return `
    <div style="background:#f8fafc;border-radius:10px;padding:13px;border:1px solid var(--border);margin-bottom:14px">
      <div class="badges-row" style="margin-bottom:7px">
        ${timingBadge(sup.timing)}
        <span class="badge ${macroBadgeCls(sup.absorption.macro)}">${sup.absorption.macroLabel.split(' ').slice(1).join(' ')}</span>
      </div>
      <div style="font-size:12.5px;color:var(--text-muted)">${sup.timingNote}</div>
      <div style="font-size:12.5px;color:var(--primary);margin-top:4px">${sup.absorption.tip}</div>
      ${medWarnHTML}
    </div>`;
}

function renderMacroBtns(selectedMacros) {
  // Accept array or legacy string
  const sel = Array.isArray(selectedMacros) ? selectedMacros
            : (selectedMacros ? [selectedMacros] : []);
  const macroLabels = {fat:t('macro_fat'),carbs:t('macro_carbs'),protein:t('macro_protein'),nofood:t('macro_nofood')};
  return MACROS.map(m=>`
    <button class="mac-btn mac-${m.k}${sel.includes(m.k)?' sel':''}"
      data-macro="${m.k}" onclick="onMacroChange('${m.k}')" title="${m.hint}">
      ${macroLabels[m.k]||m.lbl}
    </button>`).join('');
}

// ── DOSE CHIPS ─────────────────────────────────────────────────────────────
// Builds the dose chip section HTML. Called on first render and on sup change.
function renderDoseSection(sup, lf) {
  const doses = sup && sup.doses;

  // No supplement selected yet — show placeholder prompt
  if (!sup) {
    return `
      <div class="form-group">
        <label class="dose-section-label">${t('dose_optional')}</label>
        <div style="padding:12px 14px;background:#f8fafc;border:1.5px dashed #d1d5db;border-radius:10px;
          color:var(--text-muted);font-size:13px;text-align:center">
          ${t('dose_select_sup')}
        </div>
      </div>`;
  }

  if (!doses || !doses.length) {
    // Supplement exists but has no preset doses — free-text fallback
    return `
      <div class="form-group">
        <label class="dose-section-label">${t('dose_optional')}</label>
        <div style="display:flex;gap:10px;align-items:center">
          <input type="number" id="doseCustomAmt" placeholder="e.g. 2000"
            value="${lf.dose||''}" style="flex:1"
            oninput="S.logForm.dose=this.value">
          <select id="doseCustomUnit" onchange="S.logForm.unit=this.value" style="width:90px">
            ${['mg','mcg','g','IU','CFU','ml','capsule'].map(u=>`<option${(lf.unit||'mg')===u?' selected':''}>${u}</option>`).join('')}
          </select>
        </div>
      </div>`;
  }

  // Determine which chip (if any) matches current logForm state
  const curAmt  = parseFloat(lf.dose);
  const curUnit = lf.unit || '';
  const matchIdx = doses.findIndex(d => d.amount === curAmt && d.unit === curUnit);
  const isCustomActive = lf.dose && matchIdx === -1;

  const chipsHtml = doses.map((d, i) => {
    const isWarn = d.label && d.label.includes('⚠️');
    const isActive = i === matchIdx;
    let cls = 'dose-chip';
    if (isWarn)   cls += ' warn';
    if (isActive) cls += ' active';
    return `<button type="button" class="${cls}"
      onclick="pickDose(${d.amount},'${d.unit}',this)"
      title="${d.label}">${d.label} — ${d.amount} ${d.unit}</button>`;
  }).join('');

  const customActiveCls = isCustomActive ? ' active' : '';
  const customRowVis    = isCustomActive ? ' visible' : '';

  return `
    <div class="form-group" style="margin-bottom:0">
      <label class="dose-section-label">${t('dose_optional')}</label>
      <div class="dose-chips" id="doseChipRow">
        ${chipsHtml}
        <button type="button" class="dose-chip custom-chip${customActiveCls}" id="customChipBtn"
          onclick="showCustomDose()">${t('custom_chip')}</button>
      </div>
      <div class="custom-dose-row${customRowVis}" id="customDoseRow">
        <div class="form-group">
          <label style="font-size:12px;color:var(--text-muted)">${t('label_amount')}</label>
          <input type="number" id="doseCustomAmt" placeholder="e.g. 2000"
            value="${isCustomActive ? lf.dose : ''}"
            oninput="S.logForm.dose=this.value">
        </div>
        <div class="form-group">
          <label style="font-size:12px;color:var(--text-muted)">${t('label_unit')}</label>
          <select id="doseCustomUnit" onchange="S.logForm.unit=this.value" style="width:90px">
            ${['mg','mcg','g','IU','CFU','ml','capsule'].map(u=>`<option${(lf.unit||'mg')===u?' selected':''}>${u}</option>`).join('')}
          </select>
        </div>
      </div>
    </div>`;
}

// User clicked a preset chip — set dose+unit in state, update chip visuals, no re-render
function pickDose(amount, unit, chipEl) {
  S.logForm.dose = String(amount);
  S.logForm.unit = unit;
  // Toggle active class on chips
  const row = document.getElementById('doseChipRow');
  if (row) {
    row.querySelectorAll('.dose-chip').forEach(c => c.classList.remove('active'));
    if (chipEl) chipEl.classList.add('active');
  }
  // Hide custom row
  const customRow = document.getElementById('customDoseRow');
  const customBtn = document.getElementById('customChipBtn');
  if (customRow) customRow.classList.remove('visible');
  if (customBtn) customBtn.classList.remove('active');
}

// User clicked "✏️ Custom" — reveal free-text inputs
function showCustomDose() {
  // Clear any preset chip selection
  S.logForm.dose = '';
  const row = document.getElementById('doseChipRow');
  if (row) row.querySelectorAll('.dose-chip:not(.custom-chip)').forEach(c => c.classList.remove('active'));
  const customBtn = document.getElementById('customChipBtn');
  if (customBtn) customBtn.classList.add('active');
  const customRow = document.getElementById('customDoseRow');
  if (customRow) {
    customRow.classList.add('visible');
    // Focus the amount input
    const inp = document.getElementById('doseCustomAmt');
    if (inp) { inp.value = ''; inp.focus(); }
  }
}

// Called when user picks a supplement — updates info box + dose chips + clears score, no page rebuild
function onSupChange(val) {
  S.logForm.supplement = val;
  S.logForm.macros = [];
  S.logForm.dose = '';
  S.logForm.unit = 'mg';
  const sup = DB.find(s=>s.name===val);
  const infoEl  = document.getElementById('sup-info');
  const scoreEl = document.getElementById('score-area');
  const macroEl = document.getElementById('macro-btns');
  const doseEl  = document.getElementById('dose-section');
  if (infoEl)  infoEl.innerHTML  = renderSupInfo(sup);
  if (scoreEl) scoreEl.innerHTML = '';
  if (macroEl) macroEl.innerHTML = renderMacroBtns([]);
  if (doseEl)  doseEl.innerHTML  = renderDoseSection(sup, S.logForm);
}

// Called when user clicks a macro button — multi-select with mutual exclusion, no re-render
function onMacroChange(val) {
  let macros = Array.isArray(S.logForm.macros) ? [...S.logForm.macros] : [];
  if (val === 'nofood') {
    // Toggle: selecting No Food clears all food macros (mutually exclusive)
    macros = macros.includes('nofood') ? [] : ['nofood'];
  } else {
    // Food macro: always clear 'nofood' first
    macros = macros.filter(m => m !== 'nofood');
    // Toggle this food macro on/off
    if (macros.includes(val)) {
      macros = macros.filter(m => m !== val);
    } else {
      macros.push(val);
    }
  }
  S.logForm.macros = macros;
  // Update button states without re-rendering
  document.querySelectorAll('#macro-btns .mac-btn').forEach(btn => {
    const k = btn.dataset.macro;
    btn.className = `mac-btn mac-${k}${macros.includes(k) ? ' sel' : ''}`;
  });
  // Refresh live score
  const sup = DB.find(s => s.name === S.logForm.supplement);
  const scoreEl = document.getElementById('score-area');
  if (scoreEl) scoreEl.innerHTML = (sup && macros.length) ? liveScore(sup, macros) : '';
}

// Builds the "Today's Schedule" chip panel shown above the log form
function renderLogDueSection() {
  const today = getTodayDayKey();
  const todayEntries = Object.entries(S.schedule)
    .filter(([, cfg]) => (cfg.days||[]).includes(today));
  if (todayEntries.length === 0) return '';

  const logged  = new Set(S.loggedToday.map(l => l.name));
  const curSlot = getCurrentSlot();

  const bySlot = { morning:[], afternoon:[], evening:[] };
  todayEntries.forEach(([name, cfg]) => { if (bySlot[cfg.slot]) bySlot[cfg.slot].push(name); });

  // Put current slot first so it's immediately visible
  const slotOrder = curSlot
    ? [curSlot, ...Object.keys(SLOTS).filter(s => s !== curSlot)]
    : Object.keys(SLOTS);

  const slotsHTML = slotOrder.map(slot => {
    const names = bySlot[slot];
    if (!names.length) return '';
    const info      = SLOTS[slot];
    const isCurrent = slot === curSlot;
    return `
      <div style="margin-bottom:12px">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;
                    color:${isCurrent ? info.color : 'var(--text-muted)'};margin-bottom:7px;display:flex;align-items:center;gap:6px">
          ${info.label}
          ${isCurrent ? `<span style="font-size:10px;background:${info.color}22;color:${info.color};
            padding:2px 7px;border-radius:10px;font-weight:600;text-transform:none;letter-spacing:0">${t('active_now')}</span>` : ''}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:7px">
          ${names.map(name => {
            const sup   = DB.find(s => s.name === name);
            const isDone = logged.has(name);
            const uid   = 'ldc_' + name.replace(/[^a-z0-9]/gi,'_');
            const safe  = name.replace(/'/g,"\\'");
            if (isDone) return `
              <div class="log-due-chip done" id="${uid}">
                ${name} <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg>
              </div>`;
            return `
              <div class="log-due-chip" id="${uid}" onclick="pickSchedSup('${safe}')">
                ${name}
              </div>`;
          }).join('')}
        </div>
      </div>`;
  }).join('');

  const total = todayEntries.length;
  const done  = todayEntries.filter(([n]) => logged.has(n)).length;

  return `
    <div class="card" style="max-width:560px;margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <span style="font-size:13.5px;font-weight:700">${t('todays_schedule')}</span>
        <span style="font-size:12px;color:var(--text-muted)">${done}/${total} ${t('logged_count')}</span>
      </div>
      ${slotsHTML}
      ${done === total && total > 0
        ? `<div style="color:var(--success);font-size:13px;font-weight:600;margin-top:4px">${t('all_done_today')}</div>`
        : ''}
    </div>`;
}

// Called when user taps a chip — fills the form without re-rendering
function pickSchedSup(name) {
  // Visually mark selected chip
  document.querySelectorAll('.log-due-chip:not(.done)').forEach(el => el.classList.remove('ldc-sel'));
  const chip = document.getElementById('ldc_' + name.replace(/[^a-z0-9]/gi,'_'));
  if (chip) chip.classList.add('ldc-sel');
  // Fill typeahead input
  const input = document.getElementById('supTypeahead');
  if (input) input.value = name;
  document.getElementById('supDropdown')?.classList.remove('open');
  onSupChange(name);
  // Scroll form into view smoothly
  document.getElementById('logForm')?.scrollIntoView({ behavior:'smooth', block:'nearest' });
}

function vLog() {
  const lf = S.logForm;
  const sel = DB.find(s=>s.name===lf.supplement);
  return `
    <div class="page-header">
      <h2>${t('log_heading')}</h2>
      <p>${t('log_desc')}</p>
    </div>

    ${renderLogDueSection()}

    <div class="card" style="max-width:560px" id="logForm">

      <div class="form-group">
        <label>${t('supp_label')}</label>
        <div class="ta-wrap">
          <input id="supTypeahead" type="text" autocomplete="off"
            placeholder="${t('supp_placeholder')}"
            value="${lf.supplement}"
            oninput="taHandleInput(this.value)"
            onfocus="taHandleInput(this.value)"
            onkeydown="taHandleKey(event)">
          <div id="supDropdown" class="ta-dropdown"></div>
        </div>
      </div>

      <div id="sup-info">${renderSupInfo(sel)}</div>

      <div id="dose-section">${renderDoseSection(sel, lf)}</div>

      <div class="form-group">
        <label>${t('taken_with')}</label>
        <div class="macro-grid" id="macro-btns">${renderMacroBtns(lf.macros||[])}</div>
        <div style="font-size:11.5px;color:var(--text-muted);margin-top:7px;line-height:1.5">
          ${t('macro_note')}
        </div>
      </div>

      <div id="score-area">${sel&&(lf.macros||[]).length?liveScore(sel,lf.macros):''}</div>

      <div class="form-group">
        <label>${t('notes_optional')}</label>
        <input type="text" id="notesInput" placeholder="${t('notes_placeholder')}"
          value="${lf.notes}" oninput="S.logForm.notes=this.value">
      </div>

      <button class="btn btn-primary" style="width:100%;margin-top:4px" onclick="submitLog()">${t('btn_log_submit')}</button>
    </div>`;
}

/* ── HISTORY ── */
let _histView   = 'list';   // 'list' | 'calendar'
let _calYear    = new Date().getFullYear();
let _calMonth   = new Date().getMonth(); // 0-indexed
let _calSelDate = null;     // 'YYYY-MM-DD' of clicked cell

function vHistory() {
  const today = todayStr();
  const all = [...S.history, ...S.loggedToday.map(l=>({...l,date:today}))];
  const grouped = {};
  all.forEach(l=>{ (grouped[l.date]=grouped[l.date]||[]).push(l); });
  const dates = Object.keys(grouped).sort((a,b)=>b.localeCompare(a));

  return `
    <div class="page-header">
      <h2>${t('history_heading')}</h2>
      <p>${t('history_desc').replace('{n}',all.length).replace('{d}',dates.length).replace('{s}',dates.length!==1?'s':'')}</p>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:9px;margin-bottom:18px">
      <div style="display:flex;gap:7px;flex-wrap:wrap">
        <button class="btn btn-outline btn-sm" onclick="exportCSV()">${t('btn_export_csv')}</button>
        <button class="btn btn-outline btn-sm" onclick="exportTxt()">${t('btn_export_txt')}</button>
        ${all.length?`<button class="btn btn-danger btn-sm" onclick="clearAll()">${t('btn_clear_all')}</button>`:''}
      </div>
      <div style="display:flex;gap:5px">
        <button class="btn btn-sm${_histView==='list'?' btn-primary':' btn-outline'}"
          onclick="setHistView('list')">${t('btn_list')}</button>
        <button class="btn btn-sm${_histView==='calendar'?' btn-primary':' btn-outline'}"
          onclick="setHistView('calendar')">${t('btn_calendar')}</button>
      </div>
    </div>

    ${dates.length===0 ? `
      <div class="empty" style="background:#fff;border-radius:12px;border:1px solid var(--border)">
        <div class="ei"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/></svg></div><h3>${t('empty_no_history')}</h3>
        <p>${t('empty_log_first')}</p>
      </div>`
    : _histView === 'calendar'
      ? renderCalendar(grouped, today)
      : renderHistoryList(grouped, dates, today)}`;
}

function setHistView(v) {
  _histView = v;
  if (v === 'list') _calSelDate = null;
  render();
}

function renderHistoryList(grouped, dates, today) {
  return dates.map(dt=>`
    <div style="margin-bottom:22px">
      <div style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:9px">
        ${dt===today?t('today_prefix')+' — ':''}${fmtDate(dt)}
        <span style="font-weight:400;margin-left:5px">(${grouped[dt].length} supplement${grouped[dt].length!==1?'s':''})</span>
      </div>
      ${grouped[dt].map(log=>{
        const sup=DB.find(s=>s.name===log.name);
        const aScore=log.absorptionScore;
        return `
          <div class="hist-item">
            <div class="hist-dot" style="background:${sup?sup.color:'var(--primary)'}"></div>
            <div class="hd" style="flex:1">
              <div class="hn">${log.name}${log.dose?` — ${log.dose}${log.unit||''}`:''}</div>
              <div class="hm">
                ${log.time?log.time+' · ':''}
                ${log.macro?t('eaten_with')+' '+log.macro+' · ':''}
                ${aScore?t('absorption_label')+' '+aScore+'% · ':''}
                ${log.notes||''}
              </div>
            </div>
          </div>`;
      }).join('')}
    </div>`).join('');
}

function renderCalendar(grouped, today) {
  const MONTH_NAMES = ['January','February','March','April','May','June',
                       'July','August','September','October','November','December'];
  const DOW = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const firstDay  = new Date(_calYear, _calMonth, 1).getDay(); // 0=Sun
  const daysInMon = new Date(_calYear, _calMonth + 1, 0).getDate();
  const monthStr  = `${_calYear}-${String(_calMonth+1).padStart(2,'0')}`;

  // Build cells
  let cells = '';
  // Empty slots before month start
  for (let i = 0; i < firstDay; i++) cells += `<div class="cal-cell cal-empty"></div>`;

  for (let d = 1; d <= daysInMon; d++) {
    const ds     = `${monthStr}-${String(d).padStart(2,'0')}`;
    const logs   = grouped[ds] || [];
    const isToday = ds === today;
    const isSel   = ds === _calSelDate;
    let cls = 'cal-cell';
    if (logs.length)  cls += ' has-data';
    if (isToday)      cls += ' cal-today';
    if (isSel)        cls += ' cal-selected';

    const dots = logs.slice(0,5).map(l => {
      const sup = DB.find(s=>s.name===l.name);
      return `<div class="cal-dot" style="background:${sup?sup.color:'var(--primary)'}"></div>`;
    }).join('');
    const more = logs.length > 5 ? `<span class="cal-more">+${logs.length-5}</span>` : '';

    cells += `
      <div class="${cls}" ${logs.length?`onclick="calSelectDate('${ds}')" title="${logs.length} supplement${logs.length!==1?'s':''}"`:''}>
        <span class="cal-day-num">${d}</span>
        <div class="cal-dots">${dots}${more}</div>
      </div>`;
  }

  // Detail panel for selected date
  const detailHTML = _calSelDate && grouped[_calSelDate] ? `
    <div class="cal-detail">
      <div class="cal-detail-title">
        ${_calSelDate === today ? '📌 '+t('today_prefix')+' — ' : ''}${fmtDate(_calSelDate)}
        <span style="font-weight:400"> · ${grouped[_calSelDate].length} supplement${grouped[_calSelDate].length!==1?'s':''}</span>
      </div>
      ${grouped[_calSelDate].map(log => {
        const sup    = DB.find(s=>s.name===log.name);
        const aScore = log.absorptionScore;
        return `
          <div class="hist-item">
            <div class="hist-dot" style="background:${sup?sup.color:'var(--primary)'}"></div>
            <div class="hd" style="flex:1">
              <div class="hn">${log.name}${log.dose?` — ${log.dose}${log.unit||''}`:''}</div>
              <div class="hm">
                ${log.time?log.time+' · ':''}
                ${log.macro?t('eaten_with')+' '+log.macro+' · ':''}
                ${aScore?t('absorption_label')+' '+aScore+'% · ':''}
                ${log.notes||''}
              </div>
            </div>
          </div>`;
      }).join('')}
    </div>` : '';

  return `
    <div class="card">
      <div class="cal-nav">
        <button class="cal-nav-btn" onclick="calNav(-1)">‹</button>
        <span class="cal-month-label">${MONTH_NAMES[_calMonth]} ${_calYear}</span>
        <button class="cal-nav-btn" onclick="calNav(1)">›</button>
      </div>
      <div class="cal-grid">
        ${DOW.map(d=>`<div class="cal-dow">${d}</div>`).join('')}
        ${cells}
      </div>
    </div>
    ${detailHTML}`;
}

function calNav(dir) {
  _calMonth += dir;
  if (_calMonth > 11) { _calMonth = 0;  _calYear++; }
  if (_calMonth < 0)  { _calMonth = 11; _calYear--; }
  _calSelDate = null;
  render();
}

function calSelectDate(ds) {
  _calSelDate = _calSelDate === ds ? null : ds; // toggle
  render();
}

/* ── PROFILE ── */
function vProfile() {
  const p = S.profile;
  return `
    <div class="page-header">
      <h2>${t('profile_heading')}</h2>
      <p>${t('profile_desc')}</p>
    </div>
    <div style="max-width:560px">

      <div class="card" style="margin-bottom:14px">
        <h3 style="font-size:14.5px;font-weight:700;margin-bottom:15px">${t('personal_details')}</h3>
        <div class="grid-2">
          <div class="form-group">
            <label>${t('label_name')}</label>
            <input type="text" value="${p.name||''}" placeholder="${t('placeholder_name')}"
              oninput="S.profile.name=this.value;save()">
          </div>
          <div class="form-group">
            <label>${t('label_age')}</label>
            <input type="number" value="${p.age||''}" placeholder="${t('placeholder_age')}"
              oninput="S.profile.age=this.value;save()">
          </div>
        </div>
        <div class="form-group">
          <label>${t('label_sex')}</label>
          <select onchange="S.profile.sex=this.value;save()">
            <option value="">${t('sex_prefer_not')}</option>
            ${[['Male',t('sex_male')],['Female',t('sex_female')],['Other',t('sex_other')]].map(([v,lbl])=>`<option value="${v}"${p.sex===v?' selected':''}>${lbl}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="card" style="margin-bottom:14px">
        <h3 style="font-size:14.5px;font-weight:700;margin-bottom:4px">${t('health_conditions')}</h3>
        <p style="font-size:12px;color:var(--text-muted);margin-bottom:11px">${t('conditions_desc')}</p>
        <div class="tag-list" style="margin-bottom:10px">
          ${(p.conditions||[]).map((c,i)=>`
            <div class="tag">${c}<span class="x" onclick="rmCond(${i})">×</span></div>`).join('')}
        </div>
        <div style="display:flex;gap:7px">
          <input id="cinput" type="text" placeholder="${t('conditions_placeholder')}"
            style="flex:1;padding:8px 11px;border:1.5px solid var(--border);border-radius:8px;font-size:13px"
            onkeydown="if(event.key==='Enter')addCond()">
          <button class="btn btn-outline btn-sm" onclick="addCond()">${t('btn_add')}</button>
        </div>
      </div>

      <div class="card" style="margin-bottom:14px">
        <h3 style="font-size:14.5px;font-weight:700;margin-bottom:2px">${t('medications_heading')}</h3>
        <p style="font-size:12px;color:var(--text-muted);margin-bottom:11px">${t('medications_desc')}</p>
        <div class="tag-list" style="margin-bottom:10px">
          ${(p.medications||[]).map((m,i)=>`
            <div class="tag med">${m}<span class="x" onclick="rmMed(${i})">×</span></div>`).join('')}
        </div>
        <div class="ta-wrap">
          <input id="medTA" type="text" autocomplete="off"
            placeholder="${t('med_placeholder')}"
            oninput="medTaInput(this.value)"
            onfocus="medTaInput(this.value)"
            onkeydown="medTaKey(event)">
          <div id="medDrop" class="ta-dropdown"></div>
        </div>
        <p id="med-tip-p" style="font-size:11px;color:var(--text-muted);margin-top:6px">
          💡 ${t('med_tip')}
        </p>
      </div>

      <div class="card" style="background:#f0fdf4;border-color:#86efac">
        <p style="font-size:12.5px;color:#166534">
          ✅ ${t('auto_saved')}
        </p>
      </div>
    </div>`;
}
