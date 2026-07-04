// ─── knowledge.js ─────────────────────────────────────
//  TIER-2 knowledge: general absorption + conflict guidance for ingredients OUTSIDE the curated
//  103 (scanned customs, DSLD-only, AI-read). Deterministic and CLASS-BASED — no AI, no
//  hallucination. These are textbook-level generalisations by ingredient CLASS (fat-soluble
//  vitamin, mineral, amino acid, fish oil, ...), so the app can say something correct-and-useful
//  about almost any supplement, while staying honest that it's general (labelled "General", not
//  the curated "Verified"). The curated DB always wins when an ingredient is one of the 103.

function _kl(zh, en) { return (typeof LANG !== 'undefined' && LANG === 'zh') ? zh : en; }

// Absorption archetypes. score drives the bar colour; scoreLabel is shown as text ("General"),
// never a fake precise %, because this is class-level guidance not a per-product measurement.
const ABSORPTION_CLASSES = {
  fat_soluble_vitamin: { macro:'fat',   score:82, timing:'meals',
    tipZh:'脂溶性 — 同含脂肪嘅一餐一齊食(蛋、果仁、橄欖油)先吸收得好。',
    tipEn:'Fat-soluble — take with a meal containing fat (eggs, nuts, olive oil) to absorb properly.' },
  water_soluble_vitamin: { macro:'water', score:80, timing:'morning',
    tipZh:'水溶性 — 用水送服即可,多餘會排走,時間彈性。',
    tipEn:'Water-soluble — absorbed with water; excess is excreted, so timing is flexible.' },
  mineral: { macro:'food', score:70, timing:'meals',
    tipZh:'礦物質同食物一齊食好啲;唔同礦物質大劑量會互相搶吸收,隔開嚟食。',
    tipEn:'Minerals absorb best with food; large doses of different minerals compete — space them out.' },
  amino_acid: { macro:'empty', score:80, timing:'anytime',
    tipZh:'氨基酸空肚吸收最好,避開高蛋白正餐。',
    tipEn:'Amino acids absorb best on an empty stomach, away from protein-heavy meals.' },
  fish_oil: { macro:'fat', score:82, timing:'meals',
    tipZh:'同最大最油嗰餐一齊食,提升 EPA/DHA 吸收兼減少魚腥反嗝。',
    tipEn:'Take with your largest, fattiest meal to boost EPA/DHA absorption and cut fishy burps.' },
  herb_adaptogen: { macro:'food', score:65, timing:'anytime',
    tipZh:'草本/植物萃取一般同食物食,減少腸胃不適。',
    tipEn:'Herbal / botanical extracts are generally taken with food to reduce stomach upset.' },
  probiotic: { macro:'empty', score:68, timing:'morning',
    tipZh:'空肚或餐前食,令更多益生菌捱得過胃酸。',
    tipEn:'Take on an empty stomach or before a meal so more organisms survive stomach acid.' },
  fiber: { macro:'water', score:72, timing:'anytime',
    tipZh:'用一大杯水送服,同其他補充劑/藥物隔開(纖維會綁住佢哋)。',
    tipEn:'Take with a full glass of water, apart from other supplements/meds (fiber can bind them).' },
  generic: { macro:'food', score:0, timing:'anytime',
    tipZh:'一般指引:大部分補充劑同食物食都合適,詳情睇返樽上標籤。',
    tipEn:'General guidance: with food suits most supplements. Check the label for specifics.' }
};

// Ordered rules: FIRST match wins, so specific classes are tested before broad ones.
const _CLASS_RULES = [
  ['fish_oil',            /\b(fish oil|cod liver|krill|algae oil|omega[\s-]?3|omega[\s-]?3[\s-]?6[\s-]?9|epa|dha)\b/i],
  ['probiotic',          /(probiotic|lactobacill|bifidobacter|acidophilus|\bcfu\b|saccharomyces)/i],
  ['fiber',              /(psyllium|inulin|glucomannan|methylcellulose|\bfib(er|re)\b|metamucil|wheat dextrin)/i],
  ['fat_soluble_vitamin',/(vitamin\s?[adek]\b|retinol|retinyl|(chole|ergo)calciferol|tocopher|tocotrien|menaquinone|phytonadione|beta[\s-]?carotene|\bmk[\s-]?7\b|\bd3\b|\bk2\b)/i],
  ['water_soluble_vitamin',/(vitamin\s?[bc]\b|ascorb|thiamin|riboflavin|niacin|niacinamide|nicotinamide|pantothen|pyridox|cobalamin|folate|folic|biotin|methylfolate|\bb12\b|\bb6\b|\bb3\b)/i],
  ['mineral',            /(calcium|magnesium|\bzinc\b|\biron\b|ferrous|\bcopper\b|selen|chromium|manganese|potassium|iodine|iodide|molybden|\bboron\b|phosphor)/i],
  ['amino_acid',         /(amino acid|glutamine|arginine|citrulline|carnitine|theanine|tyrosine|glycine|taurine|creatine|lysine|tryptophan|phenylalanine|leucine|isoleucine|valine|methionine|threonine|histidine|cysteine|\bnac\b|\bbcaa|\beaa|collagen|whey|casein|glutathione|\bgaba\b|beta[\s-]?alanine)/i],
  ['amino_acid',         /^\s*(l|dl|d)[\s-]/i],
  ['herb_adaptogen',     /(extract|\broot\b|mushroom|ashwagandha|rhodiola|ginseng|bacopa|ginkgo|turmeric|curcumin|milk thistle|berberine|\bmaca\b|tongkat|reishi|cordyceps|lion'?s mane|elderberry|echinacea|ginger|garlic|\bseed oil\b|\bherb|quercetin|resveratrol|saw palmetto|shilajit|spirulina|chlorella)/i]
];

// Minerals that compete for absorption at high doses (the single most common real-world conflict).
const _COMMON_MINERALS = ['Calcium', 'Iron', 'Zinc', 'Magnesium', 'Copper'];

function classifyArchetype(name) {
  const n = String(name || '');
  if (!n.trim()) return 'generic';
  for (const [cls, re] of _CLASS_RULES) if (re.test(n)) return cls;
  return 'generic';
}

// General conflicts for a non-curated ingredient. Mineral↔mineral competition is emitted as
// pairwise entries so the EXISTING detectConflicts engine (which fires when two logged items
// name each other) picks them up with no extra wiring. Kept low severity + "general" wording.
function generalConflicts(name) {
  const out = [];
  if (classifyArchetype(name) === 'mineral') {
    const self = String(name).toLowerCase();
    _COMMON_MINERALS.forEach(m => {
      if (!self.includes(m.toLowerCase())) {
        out.push({ name: m, sev: 'low',
          note: _kl('大劑量礦物質會互相搶吸收 — 隔開約 2 小時食。',
                    'High-dose minerals compete for absorption — space them ~2h apart.') });
      }
    });
  }
  return out;
}

// The public entry point: given any ingredient name, return a supp-shaped knowledge object
// (absorption + timing + conflicts + category), flagged _generic so the UI can label it "General".
function classifyIngredient(name) {
  const arch = classifyArchetype(name);
  const a = ABSORPTION_CLASSES[arch];
  const isGeneric = arch === 'generic';
  return {
    archetype: arch,
    category: _kl('一般類別 · ' , 'General · ') + arch.replace(/_/g, ' '),
    timing: a.timing,
    absorption: {
      macro: a.macro,
      macroLabel: _macroLabelFor(a.macro),
      score: a.score,
      scoreLabel: isGeneric ? (_kl('無資料', 'N/A')) : _kl('一般', 'General'),
      tip: _kl(a.tipZh, a.tipEn)
    },
    conflicts: generalConflicts(name),
    _generic: true
  };
}

// macroLabel strings mirror the curated DB's emoji-prefixed format (stripped at render).
function _macroLabelFor(macro) {
  const m = { fat:'🥑 With Fat', water:'💧 With Water', protein:'🍖 With Protein',
              food:'🍽 With Food', empty:'🫗 Empty Stomach' };
  return m[macro] || m.food;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { classifyIngredient, classifyArchetype, generalConflicts, ABSORPTION_CLASSES };
}
