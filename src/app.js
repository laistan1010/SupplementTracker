// ─── app.js ───────────────────────────────────────────
// ════════════════════════════════════════════════════
//  ACTIONS
// ════════════════════════════════════════════════════
function submitLog() {
  const lf = S.logForm;
  if (!lf.supplement) { toast(t('toast_select_supp')); return; }
  const sup = DB.find(s=>s.name===lf.supplement);

  // Support both new macros[] array and legacy macro string
  const macros = Array.isArray(lf.macros) && lf.macros.length ? lf.macros
               : (lf.macro ? [lf.macro] : []);
  let aScore = null;
  if (sup && macros.length) {
    const opt      = sup.absorption.macro;
    const hasNofood = macros.includes('nofood');
    const foodSel   = macros.filter(m => m !== 'nofood');
    if (macros.includes(opt))                                                   aScore = sup.absorption.score;
    else if (opt==='food' && foodSel.length)                                    aScore = Math.round(sup.absorption.score * .88);
    else if (hasNofood && (opt==='empty'||opt==='water'))                       aScore = sup.absorption.score;
    else if (['fat','protein'].includes(opt) && foodSel.some(m=>['fat','protein'].includes(m))) aScore = Math.round(sup.absorption.score * .78);
    else if (hasNofood)                                                         aScore = Math.round(sup.absorption.score * .38);
    else                                                                        aScore = Math.round(sup.absorption.score * .62);
  }

  // Friendly label for history display (e.g. "Fat + Carbs" or "No Food")
  const macroLabel = macros.length
    ? macros.map(m => m==='nofood'?'No Food' : m.charAt(0).toUpperCase()+m.slice(1)).join(' + ')
    : '';

  S.loggedToday.push({
    id: Date.now().toString(),
    name: lf.supplement,
    dose: lf.dose,
    unit: lf.unit,
    macros,
    macro: macroLabel,   // keep for backward compat with CSV/history display
    notes: lf.notes,
    absorptionScore: aScore,
    date: todayStr(),
    time: new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})
  });

  S.logForm = {supplement:'',dose:'',unit:'mg',macros:[],notes:''};
  save();
  toast(t('toast_logged_ok').replace('{name}', lf.supplement));
  const c = detectConflicts(S.loggedToday);
  if (c.length) setTimeout(()=>toast(t('toast_conflicts').replace('{n}',c.length).replace('{s}',c.length>1?'s':'')),900);
  go('dashboard');
}

function quickLog(name) {
  S.logForm.supplement = name;
  S.logForm.macros = [];
  go('log');
}
// ── DELETE WITH 5-SECOND UNDO ────────────────────────
let _undo = null; // { item, idx, timer, el }

function delLog(id) {
  const idx = S.loggedToday.findIndex(l => l.id === id);
  if (idx === -1) return;
  const item = S.loggedToday[idx];

  // Soft-delete immediately
  S.loggedToday = S.loggedToday.filter(l => l.id !== id);
  save();
  render();

  // Dismiss any previous undo toast first
  if (_undo) { clearTimeout(_undo.timer); _undo.el.remove(); _undo = null; }

  // Build undo toast
  const el = document.createElement('div');
  el.className = 'toast toast-undo';
  el.innerHTML =
    `<span>🗑️ <b>${item.name}</b> ${t('removed_label')}</span>` +
    `<button class="undo-btn" onclick="undoDelLog()">${t('undo_label')}</button>` +
    `<div class="undo-bar"><div class="undo-bar-fill" id="undoFill"></div></div>`;
  document.getElementById('toasts').appendChild(el);

  // Kick off shrinking bar on next frame so CSS transition fires
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const fill = document.getElementById('undoFill');
    if (fill) fill.style.width = '0%';
  }));

  const timer = setTimeout(() => { el.remove(); _undo = null; }, 5000);
  _undo = { item, idx, timer, el };
}

function undoDelLog() {
  if (!_undo) return;
  clearTimeout(_undo.timer);
  _undo.el.remove();
  // Re-insert at the original position
  S.loggedToday.splice(_undo.idx, 0, _undo.item);
  _undo = null;
  save();
  render();
  toast(t('toast_restored'));
}


function addCond()  { const v=document.getElementById('cinput')?.value?.trim(); if(!v)return; (S.profile.conditions=S.profile.conditions||[]).push(v); save(); render(); }
function rmCond(i)  { S.profile.conditions.splice(i,1); save(); render(); }
function rmMed(i)   { S.profile.medications.splice(i,1); save(); render(); }

function addMedItem(name) {
  const n = name.trim();
  if (!n) return;
  if ((S.profile.medications||[]).includes(n)) { toast(t('toast_already_added')); return; }
  (S.profile.medications = S.profile.medications||[]).push(n);
  save(); render();
  toast(t('toast_added').replace('{name}',n));
}

// ── Medication typeahead (Profile page) ───────────
let _medTaIdx = -1;

function medTaInput(val) {
  const q    = val.trim().toLowerCase();
  const drop = document.getElementById('medDrop');
  if (!drop) return;
  _medTaIdx = -1;
  const already = new Set((S.profile.medications||[]).map(m=>m.toLowerCase()));
  const matches = q
    ? MEDICATION_DB.filter(m => !already.has(m.name.toLowerCase()) && (
        m.name.toLowerCase().includes(q) ||
        (m.aliases||[]).some(a => a.toLowerCase().includes(q))))
    : MEDICATION_DB.filter(m => !already.has(m.name.toLowerCase()));

  drop.innerHTML = matches.length === 0
    ? `<div class="ta-empty">${q ? t('no_match_enter').replace('{v}',val) : t('all_meds_added')}</div>`
    : matches.map(m =>
        `<div class="ta-item" data-name="${m.name.replace(/"/g,'&quot;')}"
          onmousedown="medTaSelect(this.dataset.name)">
          <span>💊</span>
          <span class="ta-name">${m.name}</span>
        </div>`).join('');
  drop.classList.add('open');
}

function medTaSelect(name) {
  const input = document.getElementById('medTA');
  const drop  = document.getElementById('medDrop');
  if (input) input.value = '';
  if (drop)  drop.classList.remove('open');
  _medTaIdx = -1;
  addMedItem(name);
}

function medTaKey(e) {
  const drop  = document.getElementById('medDrop');
  const items = drop ? drop.querySelectorAll('.ta-item') : [];
  if (e.key === 'Enter') {
    if (_medTaIdx >= 0 && items[_medTaIdx]) {
      medTaSelect(items[_medTaIdx].dataset.name);
    } else {
      // Free-text fallback
      const v = document.getElementById('medTA')?.value?.trim();
      if (v) { document.getElementById('medDrop')?.classList.remove('open'); addMedItem(v); document.getElementById('medTA').value=''; }
    }
    return;
  }
  if (!drop || !drop.classList.contains('open') || !items.length) return;
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    _medTaIdx = Math.min(_medTaIdx+1, items.length-1);
    items.forEach((el,i)=>el.classList.toggle('ta-active',i===_medTaIdx));
    items[_medTaIdx].scrollIntoView({block:'nearest'});
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    _medTaIdx = Math.max(_medTaIdx-1, 0);
    items.forEach((el,i)=>el.classList.toggle('ta-active',i===_medTaIdx));
    items[_medTaIdx].scrollIntoView({block:'nearest'});
  } else if (e.key === 'Escape') {
    drop.classList.remove('open');
  }
}

function exportCSV() {
  const today=todayStr();
  const all=[...S.history,...S.loggedToday.map(l=>({...l,date:today}))];
  if(!all.length){toast(t('toast_no_data'));return;}
  const rows=[['Date','Time','Supplement','Dose','Unit','Taken With','Absorption %','Notes']];
  all.forEach(l=>rows.push([l.date,l.time||'',l.name,l.dose||'',l.unit||'',l.macro||'',l.absorptionScore||'',l.notes||'']));
  dlFile('supplement_history.csv',rows.map(r=>r.map(v=>`"${v}"`).join(',')).join('\n'),'text/csv');
  toast(t('toast_csv'));
}

function exportTxt() {
  const today=todayStr();
  const all=[...S.history,...S.loggedToday.map(l=>({...l,date:today}))];
  if(!all.length){toast(t('toast_no_data'));return;}
  const g={};all.forEach(l=>(g[l.date]=g[l.date]||[]).push(l));
  let txt='SUPPLEMENT HISTORY\n==================\n\n';
  Object.keys(g).sort().reverse().forEach(dt=>{
    txt+=`${dt}\n`;
    g[dt].forEach(l=>{txt+=`  - ${l.name}${l.dose?' '+l.dose+(l.unit||''):''}${l.macro?' [with '+l.macro+']':''}${l.absorptionScore?' (absorption: '+l.absorptionScore+'%)':''}${l.notes?' — '+l.notes:''}\n`;});
    txt+='\n';
  });
  dlFile('supplement_history.txt',txt,'text/plain');
  toast(t('toast_txt'));
}

function dlFile(name,content,type) {
  const a=Object.assign(document.createElement('a'),{href:URL.createObjectURL(new Blob([content],{type})),download:name});
  a.click(); URL.revokeObjectURL(a.href);
}

function clearAll() {
  if(!confirm(t('confirm_clear')))return;
  S.history=[]; S.loggedToday=[]; save(); render(); toast(t('toast_cleared'));
}

// ════════════════════════════════════════════════════
//  TOAST
// ════════════════════════════════════════════════════
function toast(msg, ms=3200) {
  const el=Object.assign(document.createElement('div'),{className:'toast',textContent:msg});
  document.getElementById('toasts').appendChild(el);
  setTimeout(()=>el.remove(),ms);
}

// ════════════════════════════════════════════════════
//  TYPEAHEAD — supplement selector in Log Intake
// ════════════════════════════════════════════════════
let _taIdx = -1; // active keyboard-nav index

function taHandleInput(val) {
  const q = val.trim().toLowerCase();
  const drop = document.getElementById('supDropdown');
  if (!drop) return;
  _taIdx = -1;

  const matches = q
    ? DB.filter(s => {
        const n = s.name.toLowerCase();
        const a = (s.aliases || []).map(x => x.toLowerCase());
        return n.includes(q) || a.some(x => x.includes(q));
      })
    : DB; // empty query → show all

  if (matches.length === 0) {
    drop.innerHTML = `<div class="ta-empty">No supplements found for "${val}"</div>`;
  } else {
    drop.innerHTML = matches.map(s =>
      `<div class="ta-item" data-name="${s.name.replace(/"/g,'&quot;')}"
        onmousedown="taSelectItem(this.dataset.name)">
        <span class="ta-name">${s.name}</span>
        <span class="ta-cat">${s.category || ''}</span>
      </div>`
    ).join('');
  }
  drop.classList.add('open');
}

function taSelectItem(name) {
  const input = document.getElementById('supTypeahead');
  const drop  = document.getElementById('supDropdown');
  if (input) input.value = name;
  if (drop)  drop.classList.remove('open');
  _taIdx = -1;
  onSupChange(name);
}

function taHandleKey(e) {
  const drop = document.getElementById('supDropdown');
  if (!drop || !drop.classList.contains('open')) return;
  const items = drop.querySelectorAll('.ta-item');
  if (!items.length) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    _taIdx = Math.min(_taIdx + 1, items.length - 1);
    items.forEach((el, i) => el.classList.toggle('ta-active', i === _taIdx));
    items[_taIdx].scrollIntoView({ block: 'nearest' });
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    _taIdx = Math.max(_taIdx - 1, 0);
    items.forEach((el, i) => el.classList.toggle('ta-active', i === _taIdx));
    items[_taIdx].scrollIntoView({ block: 'nearest' });
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (_taIdx >= 0 && items[_taIdx]) {
      taSelectItem(items[_taIdx].dataset.name);
    }
  } else if (e.key === 'Escape') {
    drop.classList.remove('open');
    _taIdx = -1;
  }
}

// Close ALL dropdowns when clicking anywhere outside a .ta-wrap
document.addEventListener('click', function(e) {
  if (!e.target.closest('.ta-wrap')) {
    document.querySelectorAll('.ta-dropdown.open').forEach(d => d.classList.remove('open'));
  }
});

// ════════════════════════════════════════════════════
//  DSLD PRODUCT LABEL SEARCH
// ════════════════════════════════════════════════════
let _dsldTimer = null;

function dsldHandleInput(val) {
  clearTimeout(_dsldTimer);
  const drop   = document.getElementById('dsldDropdown');
  const status = document.getElementById('dsldStatus');
  const spin   = document.getElementById('dsldSpinner');
  if (!drop) return;

  if (val.trim().length < 2) {
    drop.classList.remove('open');
    if (status) { status.style.display = 'none'; }
    return;
  }

  _dsldTimer = setTimeout(() => dsldSearch(val.trim()), 400);
}

async function dsldSearch(q) {
  const drop   = document.getElementById('dsldDropdown');
  const status = document.getElementById('dsldStatus');
  const spin   = document.getElementById('dsldSpinner');
  if (!drop) return;

  if (spin) spin.style.display = '';
  drop.classList.remove('open');
  if (status) status.style.display = 'none';

  try {
    const url = `https://api.ods.od.nih.gov/dsld/v9/search-filter?q=${encodeURIComponent(q)}&size=8`;
    const res  = await fetch(url);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    const hits = data.hits ?? [];

    if (spin) spin.style.display = 'none';

    if (hits.length === 0) {
      if (status) { status.textContent = 'No products found — fill manually'; status.style.color = 'var(--text-muted)'; status.style.display = ''; }
      return;
    }

    drop.innerHTML = hits.map(h => {
      const s = h._source;
      const id = h._id;
      const name = s.fullName || '';
      const brand = s.brandName || '';
      return `<div class="dsld-item" onmousedown="dsldSelectResult('${id}','${name.replace(/'/g,"\\'")}','${brand.replace(/'/g,"\\'")}')">
        <div class="dsld-item-name">${name}</div>
        <div class="dsld-item-brand">${brand}</div>
      </div>`;
    }).join('');
    drop.classList.add('open');

  } catch(e) {
    if (spin) spin.style.display = 'none';
    if (status) { status.textContent = 'Label search unavailable — fill manually'; status.style.color = 'var(--text-muted)'; status.style.display = ''; }
  }
}

async function dsldSelectResult(labelId, productName, brandName) {
  const drop   = document.getElementById('dsldDropdown');
  const input  = document.getElementById('dsldInput');
  const status = document.getElementById('dsldStatus');
  const spin   = document.getElementById('dsldSpinner');
  if (drop)  drop.classList.remove('open');
  if (input) input.value = productName + (brandName ? ' — ' + brandName : '');
  if (spin)  spin.style.display = '';
  if (status) status.style.display = 'none';

  try {
    const res  = await fetch(`https://api.ods.od.nih.gov/dsld/v9/label/${labelId}`);
    if (!res.ok) throw new Error();
    const label = await res.json();
    if (spin) spin.style.display = 'none';

    const rows   = label.ingredientRows || [];
    const matches = dsldMatchIngredients(rows);

    if (matches.length === 0) {
      if (status) { status.textContent = 'No matching supplements found in this product'; status.style.color = 'var(--text-muted)'; status.style.display = ''; }
      return;
    }
    if (matches.length === 1) {
      dsldApplyMatch(matches[0]);
    } else {
      dsldShowMultiModal(matches, productName);
    }
  } catch(e) {
    if (spin) spin.style.display = 'none';
    if (status) { status.textContent = 'Could not load label — fill manually'; status.style.color = 'var(--text-muted)'; status.style.display = ''; }
  }
}

function dsldMatchIngredients(rows) {
  const seen = new Set();
  const out  = [];
  rows.forEach(row => {
    const rowName = (row.name || '').toLowerCase();
    const supp = DB.find(s => {
      if (seen.has(s.name)) return false;
      if (rowName.includes(s.name.toLowerCase())) return true;
      return (s.aliases || []).some(a => rowName.includes(a.toLowerCase()));
    });
    if (supp) {
      seen.add(supp.name);
      const q = Array.isArray(row.quantity) ? row.quantity[0] : null;
      out.push({ supp, amount: q?.quantity ?? null, unit: q?.unit || supp.doses?.[0]?.unit || 'mg' });
    }
  });
  return out;
}

function dsldApplyMatch(match) {
  const { supp, amount, unit } = match;
  // Update state
  S.logForm.supplement = supp.name;
  S.logForm.dose       = amount != null ? String(amount) : '';
  S.logForm.unit       = unit || 'mg';
  S.logForm.macros     = [];
  // Update UI without full re-render (preserve focus)
  const taInput = document.getElementById('supTypeahead');
  if (taInput) taInput.value = supp.name;
  document.getElementById('supDropdown')?.classList.remove('open');
  const supInfo   = document.getElementById('sup-info');
  const doseEl    = document.getElementById('dose-section');
  if (supInfo) supInfo.innerHTML  = renderSupInfo(supp);
  if (doseEl)  doseEl.innerHTML   = renderDoseSection(supp, S.logForm);
  document.getElementById('macro-btns')?.insertAdjacentHTML && (document.getElementById('macro-btns').innerHTML = renderMacroBtns([]));
  document.getElementById('score-area') && (document.getElementById('score-area').innerHTML = '');
  const status = document.getElementById('dsldStatus');
  if (status) { status.textContent = `✅ Pre-filled: ${supp.name}${amount != null ? ' — ' + amount + ' ' + unit : ''}`; status.style.color = 'var(--success)'; status.style.display = ''; }
}

function dsldShowMultiModal(matches, productName) {
  const modal     = document.getElementById('dsldModal');
  const titleEl   = document.getElementById('dsldModalTitle');
  const subEl     = document.getElementById('dsldModalSub');
  const listEl    = document.getElementById('dsldModalList');
  if (!modal) return;
  if (titleEl) titleEl.textContent = productName;
  if (subEl)   subEl.textContent   = `${matches.length} supplements found — tap one to log`;
  if (listEl)  listEl.innerHTML = matches.map((m, i) => `
    <div class="dsld-match-item" onmousedown="dsldModalPick(${i})">
      <div class="dsld-match-info">
        <div class="dsld-match-name">${m.supp.name}</div>
        <div class="dsld-match-dose">${m.amount != null ? m.amount + ' ' + m.unit : 'dose not listed'}</div>
      </div>
    </div>`).join('');
  modal.style.display = '';
  // stash matches for pick handler
  modal._matches = matches;
}

function dsldModalPick(i) {
  const modal = document.getElementById('dsldModal');
  const matches = modal?._matches;
  if (!matches || !matches[i]) return;
  dsldCloseModal();
  dsldApplyMatch(matches[i]);
}

function dsldCloseModal() {
  const modal = document.getElementById('dsldModal');
  if (modal) modal.style.display = 'none';
}

// ════════════════════════════════════════════════════
//  BARCODE SCAN → OFF → DSLD
// ════════════════════════════════════════════════════
function barcodePickFile() {
  document.getElementById('barcodeFileInput')?.click();
}

// UPC index loaded once on first scan
let _upcIndex = null;
async function loadUpcIndex() {
  if (_upcIndex !== null) return _upcIndex;
  try {
    const res = await fetch('data/dsld-upc-index.json');
    _upcIndex = await res.json();
  } catch { _upcIndex = {}; }
  return _upcIndex;
}

async function barcodeHandleFile(input) {
  const file = input.files?.[0];
  if (!file) return;
  input.value = '';

  const btn    = document.getElementById('scanBtn');
  const status = document.getElementById('dsldStatus');
  const spin   = document.getElementById('dsldSpinner');
  const dsldIn = document.getElementById('dsldInput');

  if (btn) { btn.disabled = true; btn.textContent = '⏳ Reading barcode…'; }
  if (status) status.style.display = 'none';

  try {
    const upc = await barcodeDecodeFile(file);
    if (btn) btn.textContent = '⏳ Looking up product…';
    if (spin) spin.style.display = '';

    const index   = await loadUpcIndex();
    const labelId = index[upc] || null;

    if (!labelId) throw new Error('not_found');

    // Direct DSLD fetch — no OFF needed
    const res   = await fetch(`https://api.ods.od.nih.gov/dsld/v9/label/${labelId}`);
    if (!res.ok) throw new Error('not_found');
    const label = await res.json();
    if (spin) spin.style.display = 'none';
    if (btn) { btn.disabled = false; btn.innerHTML = '📷 Scan Barcode'; }

    const productName = `${label.fullName || ''} — ${label.brandName || ''}`.trim();
    if (dsldIn) dsldIn.value = productName;

    const rows    = label.ingredientRows || [];
    const matches = dsldMatchIngredients(rows);

    if (matches.length === 0) {
      if (status) { status.textContent = 'No matching supplements in this product'; status.style.color = 'var(--text-muted)'; status.style.display = ''; }
    } else if (matches.length === 1) {
      dsldApplyMatch(matches[0]);
    } else {
      dsldShowMultiModal(matches, label.fullName || productName);
    }

  } catch(e) {
    if (spin) spin.style.display = 'none';
    if (btn) { btn.disabled = false; btn.innerHTML = '📷 Scan Barcode'; }
    const msg = e.message === 'not_found'
      ? '❌ Not in index — search by name, or run scripts/build-upc-index.html to update'
      : '❌ Couldn\'t read barcode — try searching by name';
    if (status) { status.textContent = msg; status.style.color = 'var(--text-muted)'; status.style.display = ''; }
  }
}

async function barcodeDecodeFile(file) {
  const reader = new ZXing.BrowserMultiFormatReader();
  const imgUrl = URL.createObjectURL(file);
  try {
    const result = await reader.decodeFromImageUrl(imgUrl);
    return result.getText().replace(/\D/g, ''); // digits only
  } finally {
    URL.revokeObjectURL(imgUrl);
  }
}

// ════════════════════════════════════════════════════
//  SCHEDULE — constants & helpers
// ════════════════════════════════════════════════════
const SLOTS = {
  morning:   { label:'Morning',   color:'#f59e0b', hours:[6,11]  },
  afternoon: { label:'Afternoon', color:'#10b981', hours:[12,17] },
  evening:   { label:'Evening',   color:'#6366f1', hours:[18,23] }
};
const STACKS = [
  {
    name: 'Gym',
    tagline: 'Strength & endurance',
    color: '#f59e0b',
    supplements: [
      { name:'Creatine',        mechanism:'Replenishes ATP for short bursts of power; most studied ergogenic aid' },
      { name:'Whey Protein',    mechanism:'Fast-absorbing complete protein; directly drives muscle protein synthesis' },
      { name:'Beta-Alanine',    mechanism:'Buffers lactic acid build-up; delays fatigue in high-intensity sets' },
      { name:'L-Citrulline',    mechanism:'Raises nitric oxide levels; improves blood flow and power output' }
    ]
  },
  {
    name: 'Sleep',
    tagline: 'Wind down & restore',
    color: '#6366f1',
    supplements: [
      { name:'Melatonin',   mechanism:'Signals circadian rhythm; reduces time to fall asleep (strong RCT evidence)' },
      { name:'Magnesium',   mechanism:'Activates GABA receptors; deficiency is common and directly disrupts sleep' },
      { name:'Glycine',     mechanism:'Lowers core body temperature; improves slow-wave deep sleep quality' },
      { name:'L-Theanine',  mechanism:'Promotes alpha brain waves; calming without sedation' }
    ]
  },
  {
    name: 'Focus',
    tagline: 'Alertness & clarity',
    color: '#0ea5e9',
    supplements: [
      { name:'Pre-Workout (Caffeine)', mechanism:'Blocks adenosine receptors; strongest evidence for acute alertness & reaction time' },
      { name:'L-Theanine',            mechanism:'Smooths caffeine jitters; improves sustained attention when combined' },
      { name:'Alpha-GPC',             mechanism:'Raises brain acetylcholine; supports working memory and attention' }
    ]
  },
  {
    name: 'Study',
    tagline: 'Memory & retention',
    color: '#10b981',
    supplements: [
      { name:'Bacopa Monnieri',    mechanism:'Multiple RCTs show improved memory recall; full effect takes 6–12 weeks' },
      { name:"Lion's Mane Mushroom", mechanism:'Stimulates nerve growth factor (NGF); supports neuroplasticity long-term' },
      { name:'Alpha-GPC',          mechanism:'Acetylcholine precursor; aids learning and memory consolidation' }
    ]
  }
];

const DAYS       = ['mon','tue','wed','thu','fri','sat','sun'];
const DAY_LABELS = ['M','T','W','T','F','S','S'];

// ── Curated medication list (23 common medications) ──
const MEDICATION_DB = [
  { name:'Warfarin (Blood Thinner)',
    aliases:['warfarin','coumadin','blood thinner','anticoagulant','jantoven'],
    conflictKeys:['warfarin','blood thinners','anticoagulant'] },
  { name:'Aspirin',
    aliases:['aspirin','acetylsalicylic acid','asa','daily aspirin','bayer'],
    conflictKeys:['aspirin'] },
  { name:'SSRIs / SNRIs (Antidepressants)',
    aliases:['ssri','snri','prozac','zoloft','lexapro','effexor','cymbalta','fluoxetine','sertraline','escitalopram','venlafaxine','antidepressant','seroxat','paxil'],
    conflictKeys:['ssri','snri','antidepressant','serotonergic'] },
  { name:'MAOIs',
    aliases:['maoi','monoamine oxidase inhibitor','nardil','parnate','phenelzine','tranylcypromine','selegiline'],
    conflictKeys:['maoi'] },
  { name:'Thyroid Medication',
    aliases:['levothyroxine','synthroid','thyroid medication','eltroxin','armour thyroid','liothyronine','t4','t3'],
    conflictKeys:['thyroid medication','thyroid'] },
  { name:'Statins (Cholesterol Medication)',
    aliases:['statin','lipitor','crestor','atorvastatin','rosuvastatin','simvastatin','pravastatin','cholesterol medication'],
    conflictKeys:['statin'] },
  { name:'Metformin / Diabetes Medication',
    aliases:['metformin','glucophage','diabetes medication','blood sugar medication','januvia','ozempic','jardiance','glipizide'],
    conflictKeys:['metformin','diabetes medication'] },
  { name:'Blood Pressure Medication',
    aliases:['blood pressure medication','antihypertensive','beta blocker','ace inhibitor','lisinopril','amlodipine','losartan','ramipril','atenolol'],
    conflictKeys:['blood pressure medication','antihypertensive'] },
  { name:'Sedatives / Benzodiazepines',
    aliases:['sedative','benzodiazepine','benzo','xanax','valium','ativan','alprazolam','diazepam','lorazepam','sleeping pill','ambien','zolpidem','temazepam'],
    conflictKeys:['sedative','benzodiazepine'] },
  { name:'Immunosuppressants',
    aliases:['immunosuppressant','cyclosporine','tacrolimus','mycophenolate','prednisone','organ transplant medication','azathioprine'],
    conflictKeys:['immunosuppressant','cyclosporine'] },
  { name:'Anticholinergic Drugs',
    aliases:['anticholinergic','benadryl','diphenhydramine','detrol','oxybutynin','overactive bladder medication','scopolamine'],
    conflictKeys:['anticholinergic'] },
  { name:"Parkinson's Medication (Levodopa)",
    aliases:['levodopa','l-dopa','sinemet','carbidopa','madopar',"parkinson's medication"],
    conflictKeys:["parkinson's medication",'levodopa','l-dopa medication'] },
  { name:"Alzheimer's Medication",
    aliases:['donepezil','aricept','rivastigmine','exelon','galantamine','razadyne',"alzheimer's medication",'acetylcholinesterase inhibitor'],
    conflictKeys:["alzheimer's medication",'donepezil','aricept'] },
  { name:'Heart Medication',
    aliases:['heart medication','digoxin','cardiac medication','amiodarone','arrhythmia medication'],
    conflictKeys:['heart medication','cardiac medication'] },
  { name:'Nitrates (Nitroglycerin)',
    aliases:['nitroglycerin','nitrate','isosorbide','gtn','angina medication','nitro'],
    conflictKeys:['nitroglycerin','nitrate'] },
  { name:'ED Medication (Viagra / Cialis)',
    aliases:['viagra','cialis','sildenafil','tadalafil','levitra','vardenafil','pde5 inhibitor'],
    conflictKeys:['ed medication','viagra','cialis','pde5'] },
  { name:'Hormone Therapy (HRT / TRT)',
    aliases:['hormone therapy','hrt','trt','testosterone replacement','estrogen therapy','progesterone','birth control pill','oral contraceptive'],
    conflictKeys:['hormone therapy','hormonal therapy'] },
  { name:'Antibiotics',
    aliases:['antibiotic','amoxicillin','ciprofloxacin','doxycycline','azithromycin','penicillin','tetracycline','flucloxacillin'],
    conflictKeys:['antibiotic'] },
  { name:'Lithium',
    aliases:['lithium','lithobid','eskalith','lithium carbonate','bipolar medication'],
    conflictKeys:['lithium'] },
  { name:'Triptans (Migraine Medication)',
    aliases:['triptan','sumatriptan','imitrex','rizatriptan','maxalt','zolmitriptan','migraine medication'],
    conflictKeys:['triptan','migraine medication'] },
  { name:'Tramadol / Opioid Pain Medication',
    aliases:['tramadol','ultram','opioid','codeine','morphine','oxycodone','percocet','pain medication'],
    conflictKeys:['tramadol','opioid'] },
  { name:'Anxiety Medication',
    aliases:['anxiety medication','anxiolytic','buspirone','buspar','hydroxyzine','vistaril'],
    conflictKeys:['anxiety medication','anxiolytic'] },
  { name:'Lactulose / Laxatives',
    aliases:['lactulose','laxative','miralax','polyethylene glycol','constipation medication'],
    conflictKeys:['lactulose','laxative'] },
  { name:'Ritalin (Methylphenidate)',
    aliases:['ritalin','methylphenidate','concerta','medikinet','rubifen','adhd medication','stimulant medication'],
    conflictKeys:['heart medication','blood pressure medication','maoi','stimulant'] },
  { name:'Piracetam',
    aliases:['piracetam','nootropil','lucetam','breinox','nootropic medication'],
    conflictKeys:['warfarin','blood thinners','anticoagulant','aspirin'] }
];

function getTodayDayKey() {
  const d = new Date().getDay(); // 0=Sun
  return DAYS[d === 0 ? 6 : d - 1];
}

function getCurrentSlot() {
  const h = new Date().getHours();
  if (h >= 6  && h < 12) return 'morning';
  if (h >= 12 && h < 18) return 'afternoon';
  if (h >= 18)           return 'evening';
  return null; // midnight–6 am
}

function getDueSupplements(slot) {
  const today  = getTodayDayKey();
  const logged = new Set(S.loggedToday.map(l => l.name));
  return Object.entries(S.schedule)
    .filter(([name, cfg]) => cfg.slot === slot && (cfg.days||[]).includes(today) && !logged.has(name))
    .map(([name]) => name);
}

// ── Schedule view ──────────────────────────────────
function vSchedule() {
  const bySlot = { morning:[], afternoon:[], evening:[] };
  Object.entries(S.schedule).forEach(([name, cfg]) => {
    if (bySlot[cfg.slot]) bySlot[cfg.slot].push(name);
  });

  function rowHTML(name) {
    const sup = DB.find(s => s.name === name);
    const cfg = S.schedule[name];
    const safe = name.replace(/'/g,"\\'");
    return `
      <div class="sched-row">
        <div class="sched-info">
          <span class="sched-name">${name}</span>
        </div>
        <div class="sched-days">
          ${DAYS.map((d,i) => `
            <button class="day-btn${cfg.days.includes(d)?' active':''}"
              onclick="toggleSchedDay('${safe}','${d}')">${DAY_LABELS[i]}</button>`).join('')}
        </div>
        <div class="sched-slots">
          ${Object.entries(SLOTS).map(([s,info]) => `
            <button class="slot-pill${cfg.slot===s?' active':''}" data-slot="${s}"
              onclick="setSchedSlot('${safe}','${s}')">${info.label}</button>`).join('')}
        </div>
        <button class="del-btn" onclick="removeFromSched('${safe}')" title="Remove">×</button>
      </div>`;
  }

  const hasAny = Object.keys(S.schedule).length > 0;

  return `
    <div class="page-header">
      <h2>${t('schedule_heading')}</h2>
      <p>${t('schedule_desc')}</p>
    </div>

    <div class="card" style="margin-bottom:18px">
      <label style="font-size:13px;font-weight:600;display:block;margin-bottom:8px">➕ ${t('sched_add')}</label>
      <div class="ta-wrap">
        <input id="schedTA" type="text" autocomplete="off"
          placeholder="${t('sched_placeholder')}"
          oninput="schedTaInput(this.value)"
          onfocus="schedTaInput(this.value)"
          onkeydown="schedTaKey(event)">
        <div id="schedDrop" class="ta-dropdown"></div>
      </div>
    </div>

    ${Object.entries(SLOTS).map(([slot, info]) => `
      <div class="sched-slot-block">
        <div class="sched-slot-header" style="color:${info.color}">
          ${info.label}
          <span class="sched-count">${t('sched_count').replace('{n}',bySlot[slot].length).replace('{s}',bySlot[slot].length!==1?'s':'')}</span>
        </div>
        ${bySlot[slot].length
          ? bySlot[slot].map(rowHTML).join('')
          : `<div class="sched-slot-empty">${t('sched_empty').replace('{slot}', info.label.toLowerCase())}</div>`}
      </div>`).join('')}

    ${!hasAny ? `
      <div class="empty">
        <div class="ei">📋</div>
        <h3>${t('sched_none_heading')}</h3>
        <p>${t('sched_none_desc')}</p>
      </div>` : ''}`;
}

// ── Schedule typeahead ─────────────────────────────
let _schedTaIdx = -1;

function schedTaInput(val) {
  const q    = val.trim().toLowerCase();
  const drop = document.getElementById('schedDrop');
  if (!drop) return;
  _schedTaIdx = -1;
  const already = new Set(Object.keys(S.schedule));
  const matches = (q
    ? DB.filter(s => !already.has(s.name) && (
        s.name.toLowerCase().includes(q) ||
        (s.aliases||[]).some(a => a.toLowerCase().includes(q))))
    : DB.filter(s => !already.has(s.name)));

  drop.innerHTML = matches.length === 0
    ? `<div class="ta-empty">${q ? `No matches for "${val}"` : 'All supplements already scheduled!'}</div>`
    : matches.map(s =>
        `<div class="ta-item" data-name="${s.name.replace(/"/g,'&quot;')}"
          onmousedown="schedTaSelect(this.dataset.name)">
          <span class="ta-name">${s.name}</span>
          <span class="ta-cat">${s.category||''}</span>
        </div>`).join('');
  drop.classList.add('open');
}

function schedTaSelect(name) {
  const input = document.getElementById('schedTA');
  const drop  = document.getElementById('schedDrop');
  if (input) { input.value = ''; }
  if (drop)  { drop.classList.remove('open'); }
  _schedTaIdx = -1;
  const sup = DB.find(s => s.name === name);
  let defaultSlot = 'morning';
  if (sup && sup.timing === 'evening')  defaultSlot = 'evening';
  if (sup && sup.timing === 'anytime')  defaultSlot = 'morning';
  S.schedule[name] = { slot: defaultSlot, days: [...DAYS] };
  save();
  render();
}

function schedTaKey(e) {
  const drop  = document.getElementById('schedDrop');
  if (!drop || !drop.classList.contains('open')) return;
  const items = drop.querySelectorAll('.ta-item');
  if (!items.length) return;
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    _schedTaIdx = Math.min(_schedTaIdx + 1, items.length - 1);
    items.forEach((el,i) => el.classList.toggle('ta-active', i===_schedTaIdx));
    items[_schedTaIdx].scrollIntoView({block:'nearest'});
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    _schedTaIdx = Math.max(_schedTaIdx - 1, 0);
    items.forEach((el,i) => el.classList.toggle('ta-active', i===_schedTaIdx));
    items[_schedTaIdx].scrollIntoView({block:'nearest'});
  } else if (e.key === 'Enter' && _schedTaIdx >= 0) {
    if (items[_schedTaIdx]) schedTaSelect(items[_schedTaIdx].dataset.name);
  } else if (e.key === 'Escape') {
    drop.classList.remove('open');
  }
}

function toggleSchedDay(name, day) {
  const cfg = S.schedule[name];
  if (!cfg) return;
  const idx = cfg.days.indexOf(day);
  if (idx >= 0) { if (cfg.days.length > 1) cfg.days.splice(idx, 1); }
  else          { cfg.days.push(day); }
  save(); render();
}

function setSchedSlot(name, slot) {
  if (!S.schedule[name]) return;
  S.schedule[name].slot = slot;
  save(); render();
}

function removeFromSched(name) {
  delete S.schedule[name];
  save(); render();
}

// ── Today's Plan (used in dashboard) ──────────────
function renderTodayPlan() {
  const entries = Object.entries(S.schedule);
  if (entries.length === 0) return '';
  const today   = getTodayDayKey();
  const todayOnes = entries.filter(([, cfg]) => (cfg.days||[]).includes(today));
  if (todayOnes.length === 0) return '';

  const logged = new Set(S.loggedToday.map(l => l.name));
  const total  = todayOnes.length;
  const done   = todayOnes.filter(([name]) => logged.has(name)).length;
  const pct    = total > 0 ? Math.round(done / total * 100) : 0;

  const bySlot = { morning:[], afternoon:[], evening:[] };
  todayOnes.forEach(([name, cfg]) => { if (bySlot[cfg.slot]) bySlot[cfg.slot].push(name); });

  const slotsHTML = Object.entries(SLOTS).map(([slot, info]) => {
    if (!bySlot[slot].length) return '';
    return `
      <div class="plan-slot-label" style="color:${info.color}">${info.label.toUpperCase()}</div>
      <div class="plan-chips">
        ${bySlot[slot].map(name => {
          const sup = DB.find(s => s.name === name);
          const isDone = logged.has(name);
          const safe   = name.replace(/'/g,"\\'");
          return `<div class="plan-chip${isDone?' done':''}">
            ${name}
            ${isDone
              ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left:3px;vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg>`
              : `<button class="plan-chip-log" onclick="quickLog('${safe}')" title="Quick log">+ Log</button>`}
          </div>`;
        }).join('')}
      </div>`;
  }).join('');

  return `
    <div class="plan-card">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <h3 style="font-size:14.5px;font-weight:700">${t('todays_plan')}</h3>
        <span style="font-size:12px;color:var(--text-muted)">${done}/${total} ${t('done_label')}</span>
      </div>
      <div class="plan-progress"><div class="plan-progress-fill" style="width:${pct}%"></div></div>
      ${slotsHTML}
      ${done < total
        ? `<button class="btn btn-outline btn-sm" onclick="showCurrentSlotReminder()">${t('see_whats_due')}</button>`
        : `<div style="color:var(--success);font-size:13px;font-weight:600">${t('all_supps_done')}</div>`}
    </div>`;
}

function showCurrentSlotReminder() {
  const slot = getCurrentSlot();
  if (!slot) { toast(t('no_active_window')); return; }
  const due = getDueSupplements(slot);
  if (due.length === 0) { toast(t('all_slot_done').replace('{slot}', SLOTS[slot].label.toLowerCase())); return; }
  showReminderModal(slot, due);
}

// ════════════════════════════════════════════════════
//  REMINDER MODAL  (Option C — shown on app open)
// ════════════════════════════════════════════════════
function checkReminderModal() {
  const slot = getCurrentSlot();
  if (!slot) return;
  if (Object.keys(S.schedule).length === 0) return;
  const due = getDueSupplements(slot);
  if (due.length === 0) return;
  // Show only once per slot per browser session
  const key = `rm_${todayStr()}_${slot}`;
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, '1');
  showReminderModal(slot, due);
}

function showReminderModal(slot, due) {
  const info = SLOTS[slot];
  document.getElementById('rm-emoji').textContent   = '';
  document.getElementById('rm-title').textContent   = `${info.label} Supplements`;
  document.getElementById('rm-subtitle').textContent = t('sup_due_label').replace('{n}',due.length).replace('{s}',due.length!==1?'s':'');

  document.getElementById('rm-list').innerHTML = due.map(name => {
    const sup  = DB.find(s => s.name === name);
    const safe = name.replace(/'/g,"\\'");
    const uid  = name.replace(/[^a-z0-9]/gi,'_');
    return `
      <div class="rm-item" id="rmi_${uid}">
        <div class="rm-item-info">
          <div class="rm-item-name">${name}</div>
          <div class="rm-item-cat">${sup ? sup.category : ''}</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="logOneFromModal('${safe}')" title="Open full log form with dose options">${t('log_dose_btn')}</button>
      </div>`;
  }).join('');

  document.getElementById('reminderModal').style.display = 'flex';
}

function closeReminderModal() {
  document.getElementById('reminderModal').style.display = 'none';
}

function rmOverlayClick(e) {
  if (e.target.id === 'reminderModal') closeReminderModal();
}

function logOneFromModal(name) {
  // Navigate to Log page with this supplement pre-filled so user can pick dose chips
  closeReminderModal();
  S.logForm.supplement = name;
  S.logForm.dose = '';
  S.logForm.unit = 'mg';
  S.logForm.macros = [];
  S.logForm.notes = '';
  go('log');
  // After render, fill the typeahead input and load dose chips
  setTimeout(() => {
    const input = document.getElementById('supTypeahead');
    if (input) input.value = name;
    onSupChange(name);
    document.getElementById('logForm')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 60);
}

function logAllFromModal() {
  document.querySelectorAll('#rm-list .rm-item').forEach(item => {
    const btn = item.querySelector('.btn');
    if (btn) { // only unlogged items still have a button
      const name = item.querySelector('.rm-item-name').textContent;
      logOneFromModal(name);
    }
  });
  toast(t('all_logged_modal'));
  setTimeout(closeReminderModal, 600);
}

// ════════════════════════════════════════════════════
//  BROWSER NOTIFICATIONS  (Option A — fires while tab open)
// ════════════════════════════════════════════════════
function initNotifications() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default') {
    // Ask once; browser will remember the answer
    Notification.requestPermission();
  }
  setInterval(checkBrowserNotif, 60000); // check every minute
}

function checkBrowserNotif() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const slot = getCurrentSlot();
  if (!slot) return;

  const key = `notif_${todayStr()}_${slot}`;
  if (S.notifiedSlots[key]) return;

  const due = getDueSupplements(slot);
  if (due.length === 0) return;

  // Mark notified & purge stale keys
  S.notifiedSlots[key] = true;
  const today = todayStr();
  Object.keys(S.notifiedSlots).forEach(k => { if (!k.includes(today)) delete S.notifiedSlots[k]; });
  save();

  const info = SLOTS[slot];
  const preview = due.slice(0,3).join(', ') + (due.length > 3 ? ` +${due.length-3} more` : '');
  const n = new Notification(`${info.label} Supplements Due`, {
    body: `${due.length} to take: ${preview}`,
    tag:  `supp_${slot}`,
    requireInteraction: false
  });
  n.onclick = () => {
    window.focus();
    showReminderModal(slot, getDueSupplements(slot));
    n.close();
  };
}

// ════════════════════════════════════════════════════
//  MAIN RENDER
// ════════════════════════════════════════════════════
function render() {
  const views={dashboard:vDashboard,search:vSearch,log:vLog,schedule:vSchedule,history:vHistory,profile:vProfile};
  document.getElementById('main').innerHTML=(views[S.view]||vDashboard)();
  updateStaticText();
}

// ════════════════════════════════════════════════════
//  INIT  —  tries JSON first, falls back to inline data
// ════════════════════════════════════════════════════
function init() {
  // 1. Use data/supplements.js if it loaded successfully (no server needed)
  if (typeof SUPP_DB !== 'undefined' && SUPP_DB.length) {
    DB = SUPP_DB;
    console.log(`✅ Loaded ${DB.length} supplements from data/supplements.js`);
  } else {
    console.info(`ℹ️ data/supplements.js not found — using inline fallback data (${DB.length} supplements).`);
  }
  loadState();
  render();
  updateStaticText();
  initNotifications();     // request browser notif permission + start 1-min interval
  checkReminderModal();    // show modal if supplements are due right now
}

init();
