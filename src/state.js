// ─── state.js ─────────────────────────────────────────
// ════════════════════════════════════════════════════
//  STATE
// ════════════════════════════════════════════════════
let S = {
  view: 'dashboard',
  searchQ: '',
  profile: { name:'', age:'', sex:'', conditions:[], medications:[] },
  loggedToday: [],
  history: [],
  logForm: { supplement:'', dose:'', unit:'mg', macros:[], notes:'' },
  schedule: {},        // { "Supplement Name": { slot:"morning", days:["mon","tue",...] } }
  notifiedSlots: {}    // { "2026-04-18_morning": true } — prevents re-firing browser notif
};

function loadState() {
  try {
    const d = JSON.parse(localStorage.getItem('st_v2') || '{}');
    if (d.profile)       S.profile       = d.profile;
    if (d.history)       S.history       = d.history;
    if (d.schedule)      S.schedule      = d.schedule;
    if (d.notifiedSlots) S.notifiedSlots = d.notifiedSlots;
    if (d.loggedToday) {
      const today = todayStr();
      S.loggedToday = d.loggedToday.filter(l => l.date === today);
      const old = d.loggedToday.filter(l => l.date !== today);
      S.history = [...(d.history||[]), ...old];
    }
  } catch(e) {}
}

function save() {
  try {
    localStorage.setItem('st_v2', JSON.stringify({
      profile: S.profile,
      loggedToday: S.loggedToday,
      history: S.history,
      schedule: S.schedule,
      notifiedSlots: S.notifiedSlots
    }));
  } catch(e) {
    if (e.name === 'QuotaExceededError') toast(t('toast_storage_full'));
  }
}

function todayStr() { return new Date().toISOString().split('T')[0]; }
function fmtDate(ds) {
  const locale = LANG === 'zh' ? 'zh-HK' : 'en-US';
  return new Date(ds+'T12:00:00').toLocaleDateString(locale,{weekday:'short',month:'short',day:'numeric'});
}
