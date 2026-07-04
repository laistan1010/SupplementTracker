// Zero-dependency tests for the safety-critical pure functions.
// Run:  node tests/pure-functions.test.js
//
// Why these matter (eng-review P1 gate): a dropped ingredient = a real conflict
// (e.g. Vitamin K2 vs Warfarin) silently NEVER firing. The conflict engine is a
// safety feature, so its inputs (expanded product entries) must be exhaustive.

const assert = require('assert');

// --- minimal global fixtures (the pure fns read these as free globals) ---
global.todayStr = () => '2026-06-30';
global.DB = [
  { name: 'Calcium',    conflicts: [{ name: 'Iron',     sev: 'moderate', note: 'Compete for absorption' }] },
  { name: 'Iron',       conflicts: [{ name: 'Calcium',  sev: 'moderate', note: 'Compete for absorption' }] },
  { name: 'Vitamin K2', conflicts: [{ name: 'Warfarin', sev: 'high',     note: 'K2 opposes warfarin' }] },
  { name: 'Vitamin D3', conflicts: [] },
];
global.MEDICATION_DB = [
  { name: 'Warfarin', aliases: ['coumadin'], conflictKeys: ['warfarin'] },
];
global.S = { profile: { medications: [] } };

const { detectConflicts, detectMedConflicts, expandProductToEntries, mergeCustomSupps, dedupeScanRows } =
  require('../src/utils.js');

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ok   ' + name); }
  catch (e) { failed++; console.log('  FAIL ' + name + '\n       ' + e.message); }
}

// ── expandProductToEntries: SAFETY — must not drop any ingredient ──
test('expand: 23 ingredients -> 23 entries, none dropped', () => {
  const ingredients = Array.from({ length: 23 }, (_, i) => ({ name: 'Ing' + i, dose: i + 1, unit: 'mg' }));
  const out = expandProductToEntries({ id: 'p1', name: 'MultiVit', ingredients });
  assert.strictEqual(out.length, 23, 'expected 23 entries, got ' + out.length);
  const names = out.map(e => e.name);
  ingredients.forEach(ing => assert.ok(names.includes(ing.name), 'dropped ' + ing.name));
});

test('expand: tags productId + productName + preserves dose/unit', () => {
  const out = expandProductToEntries({ id: 'p7', name: 'Centrum', ingredients: [{ name: 'Zinc', dose: 11, unit: 'mg' }] });
  assert.strictEqual(out[0].productId, 'p7');
  assert.strictEqual(out[0].productName, 'Centrum');
  assert.strictEqual(out[0].dose, '11');
  assert.strictEqual(out[0].unit, 'mg');
});

test('expand: empty / invalid product -> []', () => {
  assert.deepStrictEqual(expandProductToEntries(null), []);
  assert.deepStrictEqual(expandProductToEntries({ id: 'x', name: 'x' }), []);
  assert.deepStrictEqual(expandProductToEntries({ ingredients: [] }), []);
});

test('expand: unique ids per ingredient (no collision)', () => {
  const out = expandProductToEntries({ id: 'p', name: 'p', ingredients: [{ name: 'A' }, { name: 'B' }, { name: 'C' }] });
  const ids = new Set(out.map(e => e.id));
  assert.strictEqual(ids.size, 3, 'ids collided: ' + out.map(e => e.id).join());
});

// ── detectConflicts: within-product supp-supp conflict fires ──
test('detectConflicts: Calcium + Iron fires once', () => {
  const found = detectConflicts([{ name: 'Calcium' }, { name: 'Iron' }]);
  assert.strictEqual(found.length, 1, 'expected 1 conflict, got ' + found.length);
  assert.strictEqual([found[0].a, found[0].b].sort().join('+'), 'Calcium+Iron');
});

test('detectConflicts: unrelated pair -> no false positive', () => {
  assert.strictEqual(detectConflicts([{ name: 'Vitamin D3' }, { name: 'Iron' }]).length, 0);
});

// ── detectMedConflicts: K2 vs Warfarin (the safety headline) ──
test('detectMedConflicts: Vitamin K2 + Warfarin med fires (high)', () => {
  global.S.profile.medications = ['Warfarin'];
  const found = detectMedConflicts([{ name: 'Vitamin K2' }]);
  assert.strictEqual(found.length, 1, 'K2/Warfarin did NOT fire');
  assert.strictEqual(found[0].supplement, 'Vitamin K2');
  assert.strictEqual(found[0].medication, 'Warfarin');
  assert.strictEqual(found[0].sev, 'high');
});

test('detectMedConflicts: no meds -> no conflicts', () => {
  global.S.profile.medications = [];
  assert.strictEqual(detectMedConflicts([{ name: 'Vitamin K2' }]).length, 0);
});

// ── mergeCustomSupps: dedupe (builtin wins), empty passthrough ──
test('mergeCustomSupps: adds new custom, dedupes name (builtin wins)', () => {
  const base = [{ name: 'Iron' }];
  const merged = mergeCustomSupps(base, [{ name: 'Lutein', custom: true }, { name: 'iron', custom: true }]);
  assert.strictEqual(merged.length, 2, 'expected Iron + Lutein only, got ' + merged.length);
  assert.ok(merged.some(s => s.name === 'Lutein'));
  assert.strictEqual(merged.filter(s => s.name.toLowerCase() === 'iron').length, 1);
});

test('mergeCustomSupps: empty custom -> base returned unchanged', () => {
  const base = [{ name: 'Iron' }];
  assert.strictEqual(mergeCustomSupps(base, []), base);
});

// ── dedupeScanRows: twin rows from canonical mapping must not double-log ──
test('dedupe: same name + same dose/unit collapses to one row', () => {
  const out = dedupeScanRows([
    { name: 'Vitamin D3', dose: '1000', unit: 'IU', verified: true },
    { name: 'vitamin d3', dose: '1000', unit: 'IU', verified: true },
  ]);
  assert.strictEqual(out.length, 1, 'expected 1 row, got ' + out.length);
});

test('dedupe: blank dose merges into the filled twin (dose+unit kept)', () => {
  const out = dedupeScanRows([
    { name: 'Zinc', dose: '', unit: 'mg' },
    { name: 'Zinc', dose: '15', unit: 'mg' },
  ]);
  assert.strictEqual(out.length, 1);
  assert.strictEqual(out[0].dose, '15');
});

test('dedupe: SAFETY — different doses are both kept, never silently merged', () => {
  const out = dedupeScanRows([
    { name: 'Calcium', dose: '200', unit: 'mg' },
    { name: 'Calcium', dose: '300', unit: 'mg' },
  ]);
  assert.strictEqual(out.length, 2, 'must keep both distinct doses');
});

test('dedupe: same dose but different unit is NOT merged (500mg != 500mcg)', () => {
  const out = dedupeScanRows([
    { name: 'B12', dose: '500', unit: 'mcg' },
    { name: 'B12', dose: '500', unit: 'mg' },
  ]);
  assert.strictEqual(out.length, 2);
});

test('dedupe: distinct names pass through untouched', () => {
  const rows = [{ name: 'EPA', dose: '650', unit: 'mg' }, { name: 'DHA', dose: '450', unit: 'mg' }];
  assert.strictEqual(dedupeScanRows(rows).length, 2);
});

console.log('\n' + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
