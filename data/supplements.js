// =====================================================
//  SUPPLEMENT DATABASE  —  edit this file to add /
//  modify supplements. No server needed.
//  Just save this file and refresh the browser.
// =====================================================
// HOW TO ADD A NEW SUPPLEMENT:
//   1. Copy any existing block below (from { to },)
//   2. Paste it before the final ];
//   3. Edit the values
//   4. Save → refresh browser  ✅
// =====================================================

var SUPP_DB = [

  // ── FAT-SOLUBLE VITAMINS ─────────────────────────

  {
    "name": "Vitamin D3",
    "aliases": ["Vitamin D", "D3", "Cholecalciferol"],
    "category": "Fat-Soluble Vitamin",
    "emoji": "☀️",
    "color": "#f59e0b",
    "timing": "morning",
    "timingNote": "Morning preferred — late dosing may affect sleep in sensitive people",
    "absorption": {
      "macro": "fat",
      "macroLabel": "🥑 With Fat",
      "score": 92,
      "scoreLabel": "Excellent",
      "tip": "Take with your fattiest meal. Avocado, olive oil, nuts, or eggs all significantly boost uptake."
    },
    "conflicts": [
      { "name": "Calcium", "sev": "low", "note": "High-dose calcium may slightly compete — a 1–2 h gap is plenty" }
    ],
    "pairsWith": "Vitamin K2",
    "pairsNote": "K2 directs D3-absorbed calcium into bones, not arteries. A natural pair.",
    "healthWarnings": ["hypercalcemia", "kidney stones", "sarcoidosis", "kidney disease"],
    "doses": [
      {"amount": 1000, "unit": "IU", "label": "Low"},
      {"amount": 2000, "unit": "IU", "label": "Standard"},
      {"amount": 4000, "unit": "IU", "label": "High"},
      {"amount": 5000, "unit": "IU", "label": "⚠️ Max"}
    ]
  },

  {
    "name": "Vitamin K2",
    "aliases": ["K2", "MK-7", "Menaquinone"],
    "category": "Fat-Soluble Vitamin",
    "emoji": "🦴",
    "color": "#10b981",
    "timing": "morning",
    "timingNote": "Take with morning meal containing fat",
    "absorption": {
      "macro": "fat",
      "macroLabel": "🥑 With Fat",
      "score": 88,
      "scoreLabel": "Excellent",
      "tip": "Fat-soluble — always take with a meal. MK-7 form lasts longer in the body than MK-4."
    },
    "conflicts": [
      { "name": "Warfarin", "sev": "high",   "note": "⚠️ MEDICATION: K2 directly opposes blood thinners. Consult your doctor before use." },
      { "name": "Vitamin E", "sev": "medium", "note": "High-dose Vitamin E may reduce K2 activity — take at different times" }
    ],
    "pairsWith": "Vitamin D3",
    "pairsNote": "Essential partner for D3 — works synergistically for bone and heart health.",
    "healthWarnings": ["blood clotting disorders", "on anticoagulants", "warfarin"],
    "doses": [
      {"amount": 45, "unit": "mcg", "label": "Low"},
      {"amount": 100, "unit": "mcg", "label": "Standard"},
      {"amount": 200, "unit": "mcg", "label": "High"}
    ]
  },

  {
    "name": "Vitamin A",
    "aliases": ["Retinol", "Beta-Carotene", "Retinyl Palmitate"],
    "category": "Fat-Soluble Vitamin",
    "emoji": "🥕",
    "color": "#f97316",
    "timing": "morning",
    "timingNote": "Take with breakfast — fat-soluble so needs a meal",
    "absorption": {
      "macro": "fat",
      "macroLabel": "🥑 With Fat",
      "score": 85,
      "scoreLabel": "Excellent",
      "tip": "Fat-soluble. Do not exceed recommended doses — it accumulates in the body and can be toxic in excess."
    },
    "conflicts": [
      { "name": "Vitamin D3", "sev": "low", "note": "Very high-dose A may antagonise D3 — stay within recommended limits for both" }
    ],
    "pairsWith": "Zinc",
    "pairsNote": "Zinc is needed to mobilise Vitamin A out of the liver.",
    "healthWarnings": ["liver disease", "pregnancy (high doses teratogenic)", "osteoporosis"],
    "doses": [
      {"amount": 2500, "unit": "IU", "label": "Low"},
      {"amount": 5000, "unit": "IU", "label": "Standard"},
      {"amount": 10000, "unit": "IU", "label": "⚠️ Max"}
    ]
  },

  {
    "name": "Vitamin E",
    "aliases": ["Tocopherol", "Alpha-Tocopherol"],
    "category": "Fat-Soluble Vitamin",
    "emoji": "🌿",
    "color": "#84cc16",
    "timing": "morning",
    "timingNote": "Take with any fat-containing meal",
    "absorption": {
      "macro": "fat",
      "macroLabel": "🥑 With Fat",
      "score": 87,
      "scoreLabel": "Excellent",
      "tip": "Fat-soluble antioxidant. Mixed tocopherols are preferred over alpha-tocopherol alone."
    },
    "conflicts": [
      { "name": "Vitamin K2", "sev": "medium", "note": "High-dose E may impair K2 clotting function — take at different meals" },
      { "name": "Iron",       "sev": "medium", "note": "High-dose E and Iron antagonise each other — take 2 h apart" },
      { "name": "Warfarin",   "sev": "high",   "note": "⚠️ MEDICATION: May enhance blood-thinning effect. Tell your doctor." }
    ],
    "pairsWith": "Vitamin C",
    "pairsNote": "Vitamin C regenerates oxidised Vitamin E — extends its antioxidant lifespan.",
    "healthWarnings": ["blood clotting disorders", "on blood thinners", "vitamin K deficiency"],
    "doses": [
      {"amount": 100, "unit": "IU", "label": "Low"},
      {"amount": 200, "unit": "IU", "label": "Standard"},
      {"amount": 400, "unit": "IU", "label": "High"}
    ]
  },

  // ── WATER-SOLUBLE VITAMINS ───────────────────────

  {
    "name": "Vitamin C",
    "aliases": ["Ascorbic Acid", "Ascorbate"],
    "category": "Water-Soluble Vitamin",
    "emoji": "🍊",
    "color": "#f97316",
    "timing": "anytime",
    "timingNote": "Anytime — water-soluble so very flexible. Split high doses (>500 mg) throughout the day.",
    "absorption": {
      "macro": "water",
      "macroLabel": "💧 With Water",
      "score": 90,
      "scoreLabel": "Excellent",
      "tip": "Water-soluble and well-absorbed. Liposomal C has superior uptake. Doses >1 g split across meals."
    },
    "conflicts": [
      { "name": "Iron",   "sev": "positive", "note": "✅ SYNERGY: Vitamin C can triple non-heme iron absorption. Take together!" },
      { "name": "Copper", "sev": "low",      "note": "Very high doses (>2 g/day) may slightly reduce copper — monitor long-term" }
    ],
    "pairsWith": "Iron",
    "pairsNote": "Dramatically boosts plant-based iron absorption — always pair them.",
    "healthWarnings": ["kidney stones (oxalate)", "hemochromatosis", "G6PD deficiency"],
    "doses": [
      {"amount": 250, "unit": "mg", "label": "Low"},
      {"amount": 500, "unit": "mg", "label": "Standard"},
      {"amount": 1000, "unit": "mg", "label": "Immune"},
      {"amount": 2000, "unit": "mg", "label": "High"}
    ]
  },

  {
    "name": "Vitamin B12",
    "aliases": ["Cobalamin", "Methylcobalamin", "Cyanocobalamin", "B12"],
    "category": "Water-Soluble Vitamin",
    "emoji": "⚡",
    "color": "#dc2626",
    "timing": "morning",
    "timingNote": "Morning — B12 supports energy production and may interfere with sleep if taken at night",
    "absorption": {
      "macro": "food",
      "macroLabel": "🍽️ With Food",
      "score": 80,
      "scoreLabel": "Good",
      "tip": "Needs stomach acid — take with food. Sublingual (under-tongue) bypasses stomach for better uptake, especially for over 50s."
    },
    "conflicts": [
      { "name": "Metformin", "sev": "medium", "note": "⚠️ MEDICATION: Metformin is known to reduce B12 absorption over time. Monitor levels annually." }
    ],
    "pairsWith": "Folate (B9)",
    "pairsNote": "B12 and folate work hand-in-hand for DNA synthesis and red blood cell formation.",
    "healthWarnings": ["pernicious anemia", "on metformin", "vegan / vegetarian diet"],
    "doses": [
      {"amount": 250, "unit": "mcg", "label": "Low"},
      {"amount": 500, "unit": "mcg", "label": "Standard"},
      {"amount": 1000, "unit": "mcg", "label": "High"}
    ]
  },

  {
    "name": "Vitamin B6",
    "aliases": ["Pyridoxine", "B6"],
    "category": "Water-Soluble Vitamin",
    "emoji": "🔋",
    "color": "#2563eb",
    "timing": "morning",
    "timingNote": "Morning with food — avoid high chronic doses (>50 mg/day) due to neuropathy risk",
    "absorption": {
      "macro": "food",
      "macroLabel": "🍽️ With Food",
      "score": 82,
      "scoreLabel": "Good",
      "tip": "Take with food to minimise any nausea. Active P-5-P form requires no conversion."
    },
    "conflicts": [],
    "pairsWith": "Magnesium",
    "pairsNote": "B6 (P-5-P) enhances magnesium uptake into cells — a well-known synergistic pair.",
    "healthWarnings": ["peripheral neuropathy risk with chronic high doses (>100 mg/day)"],
    "doses": [
      {"amount": 10, "unit": "mg", "label": "Low"},
      {"amount": 25, "unit": "mg", "label": "Standard"},
      {"amount": 50, "unit": "mg", "label": "⚠️ Max daily"}
    ]
  },

  {
    "name": "Biotin",
    "aliases": ["Vitamin B7", "Vitamin H", "d-Biotin"],
    "category": "Water-Soluble Vitamin",
    "emoji": "💅",
    "color": "#db2777",
    "timing": "morning",
    "timingNote": "With breakfast — water-soluble so timing is flexible",
    "absorption": {
      "macro": "food",
      "macroLabel": "🍽️ With Food",
      "score": 82,
      "scoreLabel": "Good",
      "tip": "Take with food to improve tolerability. Avoid raw egg whites — avidin protein blocks biotin absorption completely."
    },
    "conflicts": [
      { "name": "Raw Egg Whites", "sev": "medium", "note": "Avidin in raw egg whites completely blocks biotin absorption — cook eggs before eating with biotin" }
    ],
    "pairsWith": "Zinc",
    "pairsNote": "Zinc and biotin together support hair, skin, and nail health synergistically.",
    "healthWarnings": ["⚠️ High-dose biotin interferes with thyroid and troponin lab tests — inform your doctor before bloodwork"],
    "doses": [
      {"amount": 300, "unit": "mcg", "label": "Low"},
      {"amount": 1000, "unit": "mcg", "label": "Standard"},
      {"amount": 5000, "unit": "mcg", "label": "High"}
    ]
  },

  // ── MINERALS ────────────────────────────────────

  {
    "name": "Magnesium",
    "aliases": ["Magnesium Glycinate", "Magnesium Citrate", "Magnesium L-Threonate", "Magnesium Oxide"],
    "category": "Mineral",
    "emoji": "🧲",
    "color": "#8b5cf6",
    "timing": "evening",
    "timingNote": "Evening or before bed — promotes relaxation, muscle recovery, and deeper sleep",
    "absorption": {
      "macro": "food",
      "macroLabel": "🍽️ With Food",
      "score": 78,
      "scoreLabel": "Good",
      "tip": "Glycinate = best absorbed + gentle on stomach. Citrate = good for constipation. Oxide = poorly absorbed. Avoid on completely empty stomach."
    },
    "conflicts": [
      { "name": "Calcium",     "sev": "low",  "note": "Compete for absorption at very high doses — ideally take at different meals" },
      { "name": "Zinc",        "sev": "low",  "note": "High therapeutic zinc competes — space apart if using both at high doses" },
      { "name": "Antibiotics", "sev": "high", "note": "⚠️ MEDICATION: Binds to certain antibiotics, reducing their effectiveness. Take 2 h apart." }
    ],
    "pairsWith": "Vitamin B6",
    "pairsNote": "B6 drives magnesium into cells — take together for maximum effect.",
    "healthWarnings": ["kidney disease", "myasthenia gravis", "heart block"],
    "doses": [
      {"amount": 200, "unit": "mg", "label": "Sleep"},
      {"amount": 300, "unit": "mg", "label": "Standard"},
      {"amount": 400, "unit": "mg", "label": "Athletic"},
      {"amount": 500, "unit": "mg", "label": "⚠️ Max daily"}
    ]
  },

  {
    "name": "Calcium",
    "aliases": ["Calcium Carbonate", "Calcium Citrate", "Calcium Gluconate"],
    "category": "Mineral",
    "emoji": "🦷",
    "color": "#64748b",
    "timing": "meals",
    "timingNote": "Split into ≤500 mg doses with meals — body can only absorb ~500 mg at a time",
    "absorption": {
      "macro": "food",
      "macroLabel": "🍽️ With Food",
      "score": 72,
      "scoreLabel": "Good",
      "tip": "Carbonate needs stomach acid — take with food. Citrate can be taken anytime. Never take more than 500 mg per dose."
    },
    "conflicts": [
      { "name": "Iron",               "sev": "high",   "note": "⚠️ Calcium strongly blocks iron absorption — separate by at least 2 hours" },
      { "name": "Magnesium",          "sev": "low",    "note": "Compete for absorption — take at different meals for best uptake of both" },
      { "name": "Zinc",               "sev": "medium", "note": "High calcium reduces zinc absorption — space 1–2 h apart" },
      { "name": "Thyroid medication", "sev": "high",   "note": "⚠️ MEDICATION: Blocks levothyroxine absorption — separate by at least 4 hours" }
    ],
    "pairsWith": "Vitamin D3",
    "pairsNote": "D3 is essential for calcium absorption from the gut — always pair together.",
    "healthWarnings": ["hypercalcemia", "kidney stones", "coronary artery disease (high doses)", "sarcoidosis"],
    "doses": [
      {"amount": 500, "unit": "mg", "label": "With meal"},
      {"amount": 1000, "unit": "mg", "label": "Standard"},
      {"amount": 1200, "unit": "mg", "label": "Women 50+"}
    ]
  },

  {
    "name": "Iron",
    "aliases": ["Ferrous Sulfate", "Ferrous Gluconate", "Ferrous Bisglycinate"],
    "category": "Mineral",
    "emoji": "🩸",
    "color": "#dc2626",
    "timing": "morning",
    "timingNote": "Best absorbed on an empty stomach — if nausea occurs, take with a small, non-dairy meal",
    "absorption": {
      "macro": "empty",
      "macroLabel": "⬜ Empty Stomach",
      "score": 85,
      "scoreLabel": "Excellent",
      "tip": "Empty stomach gives best absorption. Avoid dairy, coffee, tea, and antacids within 1 h. Bisglycinate form is gentlest on the stomach."
    },
    "conflicts": [
      { "name": "Calcium",      "sev": "high",   "note": "⚠️ Calcium strongly blocks iron — at least 2 hours between them" },
      { "name": "Vitamin E",    "sev": "medium", "note": "Antagonise at high doses — take 2 h apart" },
      { "name": "Zinc",         "sev": "medium", "note": "Share the same absorption pathway — space them out" },
      { "name": "Tea / Coffee", "sev": "medium", "note": "Tannins in tea/coffee reduce iron absorption up to 60% — avoid 1 h before and after" }
    ],
    "pairsWith": "Vitamin C",
    "pairsNote": "Vitamin C can increase iron absorption by up to 3x. Always take together.",
    "healthWarnings": ["hemochromatosis", "thalassemia", "liver disease", "inflammatory bowel disease"],
    "doses": [
      {"amount": 18, "unit": "mg", "label": "RDA"},
      {"amount": 36, "unit": "mg", "label": "Therapeutic"},
      {"amount": 65, "unit": "mg", "label": "⚠️ Medical use only"}
    ]
  },

  {
    "name": "Zinc",
    "aliases": ["Zinc Gluconate", "Zinc Citrate", "Zinc Picolinate", "Zinc Bisglycinate"],
    "category": "Mineral",
    "emoji": "🛡️",
    "color": "#0891b2",
    "timing": "morning",
    "timingNote": "With food — empty stomach causes nausea. Picolinate and bisglycinate are best-absorbed forms.",
    "absorption": {
      "macro": "protein",
      "macroLabel": "🥩 With Protein",
      "score": 88,
      "scoreLabel": "Excellent",
      "tip": "Animal protein enhances zinc absorption. Phytates in grains/legumes inhibit it — avoid high-fibre meals. Picolinate form has highest bioavailability."
    },
    "conflicts": [
      { "name": "Calcium",   "sev": "medium", "note": "High calcium reduces zinc absorption — take 1–2 h apart" },
      { "name": "Iron",      "sev": "medium", "note": "Compete for the same intestinal transporter — separate them" },
      { "name": "Copper",    "sev": "medium", "note": "Long-term high-dose zinc (>40 mg/day) depletes copper — add 1–2 mg copper if supplementing long-term" },
      { "name": "Magnesium", "sev": "low",    "note": "High doses compete — space apart at therapeutic levels" }
    ],
    "pairsWith": "Vitamin A",
    "pairsNote": "Zinc is essential for mobilising Vitamin A from liver stores.",
    "healthWarnings": ["copper deficiency (with chronic high-dose use)"],
    "doses": [
      {"amount": 10, "unit": "mg", "label": "Immune"},
      {"amount": 25, "unit": "mg", "label": "Standard"},
      {"amount": 50, "unit": "mg", "label": "⚠️ Max daily"}
    ]
  },

  // ── ESSENTIAL FATTY ACIDS ───────────────────────

  {
    "name": "Omega-3 (Fish Oil)",
    "aliases": ["Fish Oil", "Omega-3", "DHA", "EPA", "Krill Oil", "Algae Oil"],
    "category": "Essential Fatty Acid",
    "emoji": "🐟",
    "color": "#0284c7",
    "timing": "morning",
    "timingNote": "With your largest meal — dramatically reduces fishy aftertaste and maximises absorption",
    "absorption": {
      "macro": "fat",
      "macroLabel": "🥑 With Fat",
      "score": 90,
      "scoreLabel": "Excellent",
      "tip": "Co-ingestion with dietary fat increases EPA/DHA bioavailability by ~50%. A light snack is not enough — take with a proper meal."
    },
    "conflicts": [
      { "name": "Warfarin", "sev": "high",   "note": "⚠️ MEDICATION: High-dose fish oil thins blood — inform your doctor if on anticoagulants" },
      { "name": "Aspirin",  "sev": "medium", "note": "Both have anti-platelet effects at high doses — inform your doctor" }
    ],
    "pairsWith": "Vitamin D3",
    "pairsNote": "Both fat-soluble — combine them with a fatty meal for efficiency and cost savings.",
    "healthWarnings": ["blood clotting disorders", "on blood thinners", "fish/shellfish allergy"],
    "doses": [
      {"amount": 500, "unit": "mg", "label": "Low"},
      {"amount": 1000, "unit": "mg", "label": "Standard"},
      {"amount": 2000, "unit": "mg", "label": "Cardiovascular"},
      {"amount": 3000, "unit": "mg", "label": "High"}
    ]
  },

  // ── PERFORMANCE / SLEEP / ADAPTOGENS ────────────

  {
    "name": "Creatine",
    "aliases": ["Creatine Monohydrate", "Creatine HCL", "Creatine Ethyl Ester"],
    "category": "Performance",
    "emoji": "💪",
    "color": "#7c3aed",
    "timing": "anytime",
    "timingNote": "Timing is flexible — post-workout with carbs is slightly optimal but daily consistency matters most",
    "absorption": {
      "macro": "carbs",
      "macroLabel": "🍚 With Carbs",
      "score": 82,
      "scoreLabel": "Good",
      "tip": "Insulin spike from carbohydrates drives creatine into muscle cells more efficiently. Post-workout shake with carbs is ideal."
    },
    "conflicts": [],
    "pairsWith": "Carbohydrates",
    "pairsNote": "Carbs trigger insulin, which shuttles creatine into muscles more effectively.",
    "healthWarnings": ["kidney disease", "liver disease"],
    "doses": [
      {"amount": 3, "unit": "g", "label": "Maintenance"},
      {"amount": 5, "unit": "g", "label": "Standard"},
      {"amount": 10, "unit": "g", "label": "⚠️ Loading split dose"}
    ]
  },

  {
    "name": "Melatonin",
    "aliases": ["Melatonin"],
    "category": "Sleep",
    "emoji": "🌙",
    "color": "#4c1d95",
    "timing": "evening",
    "timingNote": "30–60 min before your target bedtime. Start low (0.5 mg) — more is not better with melatonin.",
    "absorption": {
      "macro": "empty",
      "macroLabel": "⬜ Empty Stomach",
      "score": 88,
      "scoreLabel": "Excellent",
      "tip": "Fastest absorbed on an empty stomach. Food delays onset. Lower doses (0.5–1 mg) mimic natural production better than high doses."
    },
    "conflicts": [
      { "name": "Ashwagandha",            "sev": "medium", "note": "Both promote relaxation — additive sedation. Use low doses of each, especially when starting." },
      { "name": "Pre-Workout (Caffeine)", "sev": "high",   "note": "⚠️ Caffeine will directly cancel melatonin effects — never combine, allow enough clearance time before bed" },
      { "name": "Sedatives",              "sev": "high",   "note": "⚠️ MEDICATION: Do not combine with prescription sedatives or sleep aids without medical guidance" }
    ],
    "pairsWith": "Ashwagandha",
    "pairsNote": "Ashwagandha lowers cortisol while melatonin signals sleep onset — complementary evening stack.",
    "healthWarnings": ["autoimmune conditions", "depression", "seizure disorders", "on sedative medication"],
    "doses": [
      {"amount": 0.5, "unit": "mg", "label": "Micro"},
      {"amount": 1, "unit": "mg", "label": "Low"},
      {"amount": 3, "unit": "mg", "label": "Standard"},
      {"amount": 5, "unit": "mg", "label": "High"}
    ]
  },

  {
    "name": "Ashwagandha",
    "aliases": ["KSM-66", "Withania somnifera", "Sensoril", "Shoden"],
    "category": "Adaptogen",
    "emoji": "🌱",
    "color": "#65a30d",
    "timing": "evening",
    "timingNote": "Evening preferred for cortisol-lowering and wind-down effect. Some prefer splitting morning/evening.",
    "absorption": {
      "macro": "fat",
      "macroLabel": "🥑 With Fat",
      "score": 80,
      "scoreLabel": "Good",
      "tip": "Take with a meal containing fat or full-fat milk. Traditional Ayurvedic use combines with warm milk or ghee for best bioavailability."
    },
    "conflicts": [
      { "name": "Melatonin",          "sev": "medium", "note": "Both promote relaxation and sleep — additive sedation, especially at higher doses" },
      { "name": "Thyroid medication", "sev": "medium", "note": "May affect thyroid hormone levels — monitor TSH if on levothyroxine" }
    ],
    "pairsWith": "Magnesium",
    "pairsNote": "Magnesium + Ashwagandha is a popular evening stack for stress relief and sleep quality.",
    "healthWarnings": ["thyroid disorders", "autoimmune disease", "pregnancy", "on sedatives or immunosuppressants"],
    "doses": [
      {"amount": 300, "unit": "mg", "label": "Low"},
      {"amount": 500, "unit": "mg", "label": "Standard"},
      {"amount": 600, "unit": "mg", "label": "High KSM-66"}
    ]
  },

  // ── ANTIOXIDANTS / GUT / ANTI-INFLAMMATORY ───────

  {
    "name": "CoQ10",
    "aliases": ["Coenzyme Q10", "Ubiquinol", "Ubiquinone"],
    "category": "Antioxidant",
    "emoji": "⚡",
    "color": "#dc2626",
    "timing": "morning",
    "timingNote": "With your largest meal of the day for best fat-soluble absorption",
    "absorption": {
      "macro": "fat",
      "macroLabel": "🥑 With Fat",
      "score": 85,
      "scoreLabel": "Excellent",
      "tip": "Highly fat-soluble. Ubiquinol is better absorbed than ubiquinone, especially for those over 40. Avoid taking on an empty stomach."
    },
    "conflicts": [
      { "name": "Warfarin", "sev": "medium",   "note": "May reduce warfarin effectiveness — monitor INR with your doctor" },
      { "name": "Statins",  "sev": "positive", "note": "✅ Statins deplete CoQ10 — supplementing alongside statins is often clinically recommended" }
    ],
    "pairsWith": "Omega-3 (Fish Oil)",
    "pairsNote": "Both fat-soluble antioxidants — combine with a fatty meal for a convenient single dose.",
    "healthWarnings": ["on blood thinners", "on chemotherapy (check with oncologist)"],
    "doses": [
      {"amount": 100, "unit": "mg", "label": "Maintenance"},
      {"amount": 200, "unit": "mg", "label": "Standard"},
      {"amount": 400, "unit": "mg", "label": "Therapeutic"}
    ]
  },

  {
    "name": "Probiotics",
    "aliases": ["Lactobacillus", "Bifidobacterium", "Live cultures", "Acidophilus"],
    "category": "Gut Health",
    "emoji": "🦠",
    "color": "#0d9488",
    "timing": "morning",
    "timingNote": "30 min before a meal on an empty stomach — stomach acid is at its lowest, improving bacterial survival",
    "absorption": {
      "macro": "empty",
      "macroLabel": "⬜ Before Meals",
      "score": 85,
      "scoreLabel": "Excellent",
      "tip": "Stomach acidity destroys bacteria. Lower acid before meals = better survival. Avoid with hot drinks. Refrigerated strains are more potent."
    },
    "conflicts": [
      { "name": "Antibiotics", "sev": "high", "note": "⚠️ Antibiotics kill probiotic bacteria. Take at least 2 h apart. Continue probiotics for 2 weeks after finishing antibiotics." }
    ],
    "pairsWith": "Prebiotics (fibre)",
    "pairsNote": "Prebiotics feed probiotic bacteria — psyllium, inulin, and resistant starch significantly boost colonisation.",
    "healthWarnings": ["severely immunocompromised", "on immunosuppressants", "recent bowel surgery"],
    "doses": [
      {"amount": 1, "unit": "capsule", "label": "Standard (follow label)"}
    ]
  },

  {
    "name": "Turmeric / Curcumin",
    "aliases": ["Curcumin", "Turmeric", "BCM-95", "Longvida", "Meriva"],
    "category": "Anti-inflammatory",
    "emoji": "🌟",
    "color": "#d97706",
    "timing": "meals",
    "timingNote": "With your largest meal of the day — and always with black pepper (see tip)",
    "absorption": {
      "macro": "fat",
      "macroLabel": "🥑 Fat + Black Pepper",
      "score": 55,
      "scoreLabel": "Poor (without enhancers)",
      "tip": "Standard curcumin is poorly absorbed. Black pepper (piperine) increases absorption by ~2000%. Also fat-soluble. Phytosome forms (Meriva/BCM-95) don't need pepper."
    },
    "conflicts": [
      { "name": "Warfarin", "sev": "high",   "note": "⚠️ MEDICATION: Curcumin has blood-thinning properties — caution with anticoagulants" },
      { "name": "Iron",     "sev": "medium", "note": "Curcumin chelates iron — take 2 h apart from iron supplement" }
    ],
    "pairsWith": "Black Pepper (Piperine)",
    "pairsNote": "Non-negotiable pairing — piperine boosts curcumin absorption by ~2000%.",
    "healthWarnings": ["gallstones", "bile duct obstruction", "on blood thinners", "before surgery"],
    "doses": [
      {"amount": 500, "unit": "mg", "label": "Low"},
      {"amount": 1000, "unit": "mg", "label": "Standard"},
      {"amount": 1500, "unit": "mg", "label": "High"}
    ]
  },

  {
    "name": "Collagen",
    "aliases": ["Collagen Peptides", "Hydrolyzed Collagen", "Type I Collagen", "Type II Collagen", "Marine Collagen"],
    "category": "Structural Protein",
    "emoji": "✨",
    "color": "#f472b6",
    "timing": "morning",
    "timingNote": "Morning is popular — or post-workout for joint and muscle recovery support",
    "absorption": {
      "macro": "protein",
      "macroLabel": "🥩 + Vitamin C",
      "score": 80,
      "scoreLabel": "Good",
      "tip": "Vitamin C is essential for the body to synthesise collagen from peptides — always pair together. Hot liquids do not destroy collagen peptides."
    },
    "conflicts": [],
    "pairsWith": "Vitamin C",
    "pairsNote": "Vitamin C is essential for collagen cross-linking and synthesis — always take together.",
    "healthWarnings": ["kidney disease (high protein load)", "allergy to fish, shellfish, or eggs depending on collagen source"],
    "doses": [
      {"amount": 5, "unit": "g", "label": "Low"},
      {"amount": 10, "unit": "g", "label": "Standard"},
      {"amount": 15, "unit": "g", "label": "High"}
    ]
  },

  {
    "name": "NAC (N-Acetyl Cysteine)",
    "aliases": ["N-Acetyl Cysteine", "NAC", "Acetylcysteine"],
    "category": "Antioxidant",
    "emoji": "🧬",
    "color": "#0f766e",
    "timing": "morning",
    "timingNote": "Empty stomach for glutathione support — with light food if nauseated",
    "absorption": {
      "macro": "empty",
      "macroLabel": "⬜ Empty Stomach",
      "score": 78,
      "scoreLabel": "Good",
      "tip": "Empty stomach preferred for glutathione precursor activity. If nausea occurs, take with a low-protein light meal — high protein may compete."
    },
    "conflicts": [
      { "name": "Activated Charcoal", "sev": "high", "note": "⚠️ Charcoal adsorbs NAC — do not combine" },
      { "name": "Nitroglycerin",      "sev": "high", "note": "⚠️ MEDICATION: Potentiates nitroglycerin — risk of severe hypotension. Consult doctor." }
    ],
    "pairsWith": "Vitamin C",
    "pairsNote": "Both glutathione-supporting antioxidants — synergistic combination for immune and liver health.",
    "healthWarnings": ["asthma (may cause bronchospasm at high doses)", "on nitroglycerin medication"],
    "doses": [
      {"amount": 300, "unit": "mg", "label": "Low"},
      {"amount": 600, "unit": "mg", "label": "Standard"},
      {"amount": 1200, "unit": "mg", "label": "High"}
    ]
  },

  {
    "name": "Berberine",
    "aliases": ["Berberine HCL", "Berberine Sulfate"],
    "category": "Metabolic Support",
    "emoji": "🌿",
    "color": "#d97706",
    "timing": "meals",
    "timingNote": "15–30 min BEFORE each main meal (up to 3x/day) — helps regulate blood glucose from that meal",
    "absorption": {
      "macro": "food",
      "macroLabel": "🍽️ Before Meals",
      "score": 75,
      "scoreLabel": "Good",
      "tip": "Take just before eating for best blood sugar modulation. Divide into 3 x 500 mg doses across the day — high single doses cause GI upset."
    },
    "conflicts": [
      { "name": "Metformin",    "sev": "high", "note": "⚠️ MEDICATION: Berberine mimics metformin — additive hypoglycaemia risk. Consult your doctor." },
      { "name": "Cyclosporine", "sev": "high", "note": "⚠️ MEDICATION: Inhibits CYP3A4 enzyme — may significantly raise cyclosporine blood levels. Dangerous." }
    ],
    "pairsWith": "Probiotics",
    "pairsNote": "Berberine alters gut bacteria — probiotics help maintain a healthy microbiome balance.",
    "healthWarnings": ["diabetes on medication", "on immunosuppressants", "pregnancy", "liver disease"],
    "doses": [
      {"amount": 500, "unit": "mg", "label": "With meal"},
      {"amount": 1000, "unit": "mg", "label": "Standard split"},
      {"amount": 1500, "unit": "mg", "label": "⚠️ Max split"}
    ]
  },

  // ── GYM / FITNESS ────────────────────────────────

  {
    "name": "Whey Protein",
    "aliases": ["Whey Isolate", "Whey Concentrate", "WPI", "WPC", "Whey Hydrolysate"],
    "category": "Gym — Protein",
    "emoji": "🥛",
    "color": "#3b82f6",
    "timing": "morning",
    "timingNote": "Post-workout is the classic window (within 30–60 min). Also great as a morning or between-meal protein hit.",
    "absorption": {
      "macro": "water",
      "macroLabel": "💧 With Water / Milk",
      "score": 92,
      "scoreLabel": "Excellent",
      "tip": "Fast-digesting — ideal post-workout. Isolate is best for lactose-sensitive people. Hydrolysate is fastest but expensive. Mix with water for speed, milk for extra calories."
    },
    "conflicts": [
      { "name": "Casein Protein", "sev": "low", "note": "No harm combining, but they serve opposite purposes — whey post-workout, casein pre-bed" },
      { "name": "Iron",           "sev": "low", "note": "Calcium in dairy whey slightly inhibits iron — take iron supplements separately" }
    ],
    "pairsWith": "Creatine",
    "pairsNote": "Post-workout whey + creatine is the most evidence-backed muscle-building combo.",
    "healthWarnings": ["lactose intolerance (use isolate or plant protein)", "dairy allergy", "kidney disease (high protein load)"],
    "doses": [
      {"amount": 20, "unit": "g", "label": "Light"},
      {"amount": 25, "unit": "g", "label": "Standard scoop"},
      {"amount": 40, "unit": "g", "label": "Double scoop"}
    ]
  },

  {
    "name": "Casein Protein",
    "aliases": ["Micellar Casein", "Casein", "Slow-release protein"],
    "category": "Gym — Protein",
    "emoji": "🌙",
    "color": "#6366f1",
    "timing": "evening",
    "timingNote": "Before bed is optimal — slow digestion feeds muscles through the night (6–8 h release)",
    "absorption": {
      "macro": "water",
      "macroLabel": "💧 With Water / Milk",
      "score": 85,
      "scoreLabel": "Excellent",
      "tip": "Digests over 5–7 hours vs whey's 1–2 hours. The overnight anti-catabolic staple. Thick consistency — mix well or blend."
    },
    "conflicts": [
      { "name": "Iron", "sev": "low", "note": "Calcium in casein slightly inhibits iron absorption — keep iron intake separate" }
    ],
    "pairsWith": "Magnesium",
    "pairsNote": "Both taken before bed — casein for muscle protein synthesis, magnesium for recovery and sleep quality.",
    "healthWarnings": ["lactose intolerance", "dairy allergy", "kidney disease"],
    "doses": [
      {"amount": 20, "unit": "g", "label": "Light"},
      {"amount": 30, "unit": "g", "label": "Standard"},
      {"amount": 40, "unit": "g", "label": "High"}
    ]
  },

  {
    "name": "BCAAs",
    "aliases": ["Branched-Chain Amino Acids", "Leucine", "Isoleucine", "Valine", "BCAA"],
    "category": "Gym — Amino Acids",
    "emoji": "🔬",
    "color": "#ec4899",
    "timing": "anytime",
    "timingNote": "During fasted training, intra-workout, or between meals. Less useful if you already eat adequate protein.",
    "absorption": {
      "macro": "water",
      "macroLabel": "💧 With Water",
      "score": 88,
      "scoreLabel": "Excellent",
      "tip": "Rapidly absorbed without digestion. Most useful for fasted training or low-protein diets. Leucine 2:1:1 ratio is standard."
    },
    "conflicts": [],
    "pairsWith": "EAAs / Whey Protein",
    "pairsNote": "BCAAs alone miss the other 6 essential amino acids — EAAs or whey are more complete for muscle synthesis.",
    "healthWarnings": ["ALS (amyotrophic lateral sclerosis)", "maple syrup urine disease", "on Parkinson's levodopa medication"],
    "doses": [
      {"amount": 5, "unit": "g", "label": "Low"},
      {"amount": 10, "unit": "g", "label": "Standard"},
      {"amount": 15, "unit": "g", "label": "High"}
    ]
  },

  {
    "name": "Pre-Workout (Caffeine)",
    "aliases": ["Pre-workout", "C4", "Caffeine Anhydrous", "NOXPLODE"],
    "category": "Gym — Stimulant",
    "emoji": "⚡",
    "color": "#ef4444",
    "timing": "morning",
    "timingNote": "30–45 min before training. Avoid within 6 h of sleep — caffeine half-life is ~5–6 hours.",
    "absorption": {
      "macro": "empty",
      "macroLabel": "⬜ Empty / Light Stomach",
      "score": 88,
      "scoreLabel": "Excellent",
      "tip": "Absorbed fastest on an empty stomach. Food slows onset but reduces GI upset. Start with half a dose to assess tolerance."
    },
    "conflicts": [
      { "name": "Taurine",            "sev": "positive", "note": "✅ Taurine counteracts some caffeine jitteriness — many pre-workouts include both intentionally" },
      { "name": "Melatonin",          "sev": "high",     "note": "⚠️ Caffeine will directly cancel melatonin effects — allow enough clearance time before bed" },
      { "name": "Ashwagandha",        "sev": "medium",   "note": "Caffeine is stimulatory, ashwagandha is adaptogenic — counteracting but not dangerous" },
      { "name": "Heart medication",   "sev": "high",     "note": "⚠️ MEDICATION: Stimulants can interact with beta-blockers and antidepressants — consult doctor" }
    ],
    "pairsWith": "L-Citrulline",
    "pairsNote": "Caffeine + citrulline gives both the CNS drive and the pump/blood flow for a complete pre-workout effect.",
    "healthWarnings": ["heart arrhythmia", "hypertension", "anxiety disorders", "on MAOI antidepressants", "pregnancy"],
    "doses": [
      {"amount": 100, "unit": "mg", "label": "Low"},
      {"amount": 200, "unit": "mg", "label": "Standard"},
      {"amount": 300, "unit": "mg", "label": "⚠️ High"}
    ]
  },

  {
    "name": "Beta-Alanine",
    "aliases": ["CarnoSyn", "Beta Alanine"],
    "category": "Gym — Performance",
    "emoji": "🌊",
    "color": "#8b5cf6",
    "timing": "morning",
    "timingNote": "Pre-workout or with a meal. Timing matters less than daily consistency — builds carnosine over weeks.",
    "absorption": {
      "macro": "food",
      "macroLabel": "🍽️ With Food",
      "score": 82,
      "scoreLabel": "Good",
      "tip": "Tingling/flushing (paresthesia) is normal and harmless — reduce with split doses or sustained-release form. Benefits appear after 2–4 weeks of daily loading."
    },
    "conflicts": [
      { "name": "Taurine", "sev": "medium", "note": "Compete for the same transporter at high doses — take at different times if using both therapeutically" }
    ],
    "pairsWith": "Creatine",
    "pairsNote": "Creatine (power) + Beta-Alanine (endurance buffer) = the most evidence-backed performance stack.",
    "healthWarnings": ["known sensitivity to paresthesia", "kidney disease (high doses)"],
    "doses": [
      {"amount": 1600, "unit": "mg", "label": "Low - less tingling"},
      {"amount": 3200, "unit": "mg", "label": "Standard"},
      {"amount": 4800, "unit": "mg", "label": "High"}
    ]
  },

  {
    "name": "L-Citrulline",
    "aliases": ["Citrulline Malate", "L-Citrulline", "Citrulline"],
    "category": "Gym — Pump / Nitric Oxide",
    "emoji": "💉",
    "color": "#dc2626",
    "timing": "morning",
    "timingNote": "30–60 min before training on an empty stomach for best nitric oxide response.",
    "absorption": {
      "macro": "empty",
      "macroLabel": "⬜ Empty Stomach",
      "score": 85,
      "scoreLabel": "Excellent",
      "tip": "Converts to arginine in the kidneys for nitric oxide production. More effective than arginine itself. 2:1 malate form also reduces muscle fatigue."
    },
    "conflicts": [
      { "name": "ED medication (Viagra/Cialis)", "sev": "high", "note": "⚠️ DANGEROUS: Both dilate blood vessels — severe blood pressure drop risk. Do NOT combine." }
    ],
    "pairsWith": "Pre-Workout (Caffeine)",
    "pairsNote": "Caffeine for CNS drive + citrulline for blood flow = complete pre-workout effect.",
    "healthWarnings": ["on erectile dysfunction medication (PDE5 inhibitors)", "on blood pressure medication", "low blood pressure"],
    "doses": [
      {"amount": 3000, "unit": "mg", "label": "Low"},
      {"amount": 6000, "unit": "mg", "label": "Standard"},
      {"amount": 8000, "unit": "mg", "label": "High"}
    ]
  },

  {
    "name": "L-Glutamine",
    "aliases": ["Glutamine", "L-Glutamine Powder"],
    "category": "Gym — Recovery",
    "emoji": "🛠️",
    "color": "#0891b2",
    "timing": "anytime",
    "timingNote": "Post-workout or before bed. Also useful first thing in the morning for gut health support.",
    "absorption": {
      "macro": "water",
      "macroLabel": "💧 With Water",
      "score": 80,
      "scoreLabel": "Good",
      "tip": "Water-soluble and rapidly absorbed. Most useful for gut health and recovery during high-frequency training."
    },
    "conflicts": [
      { "name": "Lactulose", "sev": "medium", "note": "Glutamine metabolism affects ammonia levels — caution with lactulose (used for liver disease)" }
    ],
    "pairsWith": "BCAAs",
    "pairsNote": "BCAAs + glutamine is a classic intra-workout / post-workout recovery combination.",
    "healthWarnings": ["liver cirrhosis", "seizure disorders", "kidney disease", "on anti-epileptic drugs"],
    "doses": [
      {"amount": 2500, "unit": "mg", "label": "Low"},
      {"amount": 5000, "unit": "mg", "label": "Standard"},
      {"amount": 10000, "unit": "mg", "label": "High"}
    ]
  },

  {
    "name": "L-Carnitine",
    "aliases": ["L-Carnitine Tartrate", "Acetyl-L-Carnitine", "ALCAR", "Carnitine"],
    "category": "Gym — Fat Metabolism",
    "emoji": "🔥",
    "color": "#f97316",
    "timing": "morning",
    "timingNote": "Pre-workout with carbs — insulin drives carnitine into muscle tissue.",
    "absorption": {
      "macro": "carbs",
      "macroLabel": "🍚 With Carbs",
      "score": 76,
      "scoreLabel": "Good",
      "tip": "Insulin significantly enhances muscle carnitine uptake — take with 30–40 g of carbs. Takes weeks of consistent dosing to accumulate in muscle."
    },
    "conflicts": [
      { "name": "Thyroid medication", "sev": "medium", "note": "Carnitine may reduce thyroid hormone activity — monitor with your doctor if on levothyroxine" },
      { "name": "Warfarin",           "sev": "medium", "note": "May enhance anticoagulant effect of Warfarin — monitor INR" }
    ],
    "pairsWith": "Pre-Workout (Caffeine)",
    "pairsNote": "Caffeine + carnitine is a popular fat-burning pre-workout stack.",
    "healthWarnings": ["hypothyroidism", "on blood thinners", "trimethylaminuria (fish odour syndrome)"],
    "doses": [
      {"amount": 500, "unit": "mg", "label": "Low"},
      {"amount": 1000, "unit": "mg", "label": "Standard"},
      {"amount": 2000, "unit": "mg", "label": "High"}
    ]
  },

  {
    "name": "HMB",
    "aliases": ["Beta-Hydroxy Beta-Methylbutyrate", "HMB Free Acid", "HMB-FA", "BetaTOR"],
    "category": "Gym — Muscle Retention",
    "emoji": "🧱",
    "color": "#16a34a",
    "timing": "morning",
    "timingNote": "Split 3x daily with meals. Free acid form is faster — take 30 min pre-workout for anti-catabolic benefits.",
    "absorption": {
      "macro": "food",
      "macroLabel": "🍽️ With Food",
      "score": 78,
      "scoreLabel": "Good",
      "tip": "HMB-Free Acid absorbs faster than calcium-HMB. Most benefit seen in untrained individuals or during caloric deficits. Takes 2+ weeks to show effect."
    },
    "conflicts": [],
    "pairsWith": "Creatine",
    "pairsNote": "HMB + Creatine stack shows additive anti-catabolic and strength benefits in several studies.",
    "healthWarnings": ["no major concerns at recommended doses"],
    "doses": [
      {"amount": 1000, "unit": "mg", "label": "Low"},
      {"amount": 1500, "unit": "mg", "label": "Standard"},
      {"amount": 3000, "unit": "mg", "label": "High"}
    ]
  },

  {
    "name": "Taurine",
    "aliases": ["Taurine", "L-Taurine"],
    "category": "Gym — Amino Acids",
    "emoji": "💧",
    "color": "#0ea5e9",
    "timing": "anytime",
    "timingNote": "Pre-workout (reduces caffeine jitteriness), or post-workout for recovery.",
    "absorption": {
      "macro": "water",
      "macroLabel": "💧 With Water",
      "score": 88,
      "scoreLabel": "Excellent",
      "tip": "Rapidly absorbed, works fast. 1–3 g pre-workout is typical. Found in most energy drinks — don't double up if using those."
    },
    "conflicts": [
      { "name": "Beta-Alanine", "sev": "medium", "note": "Compete for the same intestinal transporter — take at different times if using both at high doses" },
      { "name": "Lithium",      "sev": "high",   "note": "⚠️ MEDICATION: Taurine affects electrolyte balance — may alter lithium clearance. Consult doctor." }
    ],
    "pairsWith": "Pre-Workout (Caffeine)",
    "pairsNote": "Taurine blunts caffeine-induced anxiety and heart rate spikes — naturally synergistic.",
    "healthWarnings": ["on lithium medication", "bipolar disorder (on medication)"],
    "doses": [
      {"amount": 500, "unit": "mg", "label": "Low"},
      {"amount": 1000, "unit": "mg", "label": "Standard"},
      {"amount": 2000, "unit": "mg", "label": "High"}
    ]
  },

  {
    "name": "Electrolytes",
    "aliases": ["Sports Electrolytes", "Sodium", "Potassium", "LMNT", "Liquid IV", "Hydration mix"],
    "category": "Gym — Hydration",
    "emoji": "⚗️",
    "color": "#06b6d4",
    "timing": "anytime",
    "timingNote": "During or after training, especially sessions >60 min or in heat.",
    "absorption": {
      "macro": "water",
      "macroLabel": "💧 With Water",
      "score": 92,
      "scoreLabel": "Excellent",
      "tip": "Dissolved in water for near-instant absorption. Sodium is the key driver — without adequate sodium, other electrolytes don't absorb as efficiently."
    },
    "conflicts": [
      { "name": "Blood pressure medication", "sev": "medium", "note": "High-sodium electrolytes may counteract blood pressure medication — choose low-sodium formulas if needed" }
    ],
    "pairsWith": "Creatine",
    "pairsNote": "Creatine pulls water into cells — staying well-hydrated with electrolytes reduces cramping.",
    "healthWarnings": ["hypertension (watch sodium content)", "kidney disease", "on diuretics", "heart failure"],
    "doses": [
      {"amount": 250, "unit": "mg", "label": "Light"},
      {"amount": 500, "unit": "mg", "label": "Standard"},
      {"amount": 1000, "unit": "mg", "label": "Heavy sweat"}
    ]
  },

  {
    "name": "Tongkat Ali",
    "aliases": ["Eurycoma Longifolia", "Longjack", "Malaysian Ginseng", "TA"],
    "category": "Gym — Testosterone Support",
    "emoji": "🌿",
    "color": "#15803d",
    "timing": "morning",
    "timingNote": "Morning with food. Cycle 5 days on / 2 days off, or 4 weeks on / 1 week off.",
    "absorption": {
      "macro": "food",
      "macroLabel": "🍽️ With Food",
      "score": 78,
      "scoreLabel": "Good",
      "tip": "Standardised extract (100:1 or 200:1 ratio) is required — raw powder is underdosed. Take with food to reduce GI upset."
    },
    "conflicts": [
      { "name": "Fadogia Agrestis",   "sev": "positive", "note": "✅ SYNERGY: Tongkat Ali + Fadogia is a popular test-support stack — monitor hormone levels" },
      { "name": "Hormone therapy",    "sev": "high",     "note": "⚠️ MEDICATION: May interfere with HRT, TRT, or contraceptives — consult doctor" },
      { "name": "Immunosuppressants", "sev": "medium",   "note": "May stimulate immune activity — potential interaction with immunosuppressant drugs" }
    ],
    "pairsWith": "Fadogia Agrestis",
    "pairsNote": "A popular synergistic stack — get bloodwork done before and during.",
    "healthWarnings": ["prostate cancer or risk", "hormone-sensitive conditions", "on HRT or TRT", "liver disease (high doses)"],
    "doses": [
      {"amount": 100, "unit": "mg", "label": "Low"},
      {"amount": 200, "unit": "mg", "label": "Standard"},
      {"amount": 400, "unit": "mg", "label": "High"}
    ]
  },

  {
    "name": "Fadogia Agrestis",
    "aliases": ["Fadogia", "Fadogia Agrestis Extract"],
    "category": "Gym — Testosterone Support",
    "emoji": "🔩",
    "color": "#854d0e",
    "timing": "morning",
    "timingNote": "Morning with food. Cycle strictly — 8 weeks on / 2–4 weeks off. Get bloodwork every 8–12 weeks.",
    "absorption": {
      "macro": "food",
      "macroLabel": "🍽️ With Food",
      "score": 72,
      "scoreLabel": "Good",
      "tip": "Limited human research — most data from rodent studies. Use lowest effective dose. Safety profile not fully established for long-term use."
    },
    "conflicts": [
      { "name": "Tongkat Ali",     "sev": "positive", "note": "✅ SYNERGY: Together they target different parts of the testosterone pathway — commonly stacked" },
      { "name": "Hormone therapy", "sev": "high",     "note": "⚠️ MEDICATION: Interacts with any hormone-based medication. Consult doctor." }
    ],
    "pairsWith": "Tongkat Ali",
    "pairsNote": "Frequently stacked — but monitor testosterone, LH, and FSH with bloodwork.",
    "healthWarnings": ["⚠️ Limited long-term safety data", "prostate issues", "hormone-sensitive conditions", "on TRT or HRT", "kidney toxicity at high doses"],
    "doses": [
      {"amount": 425, "unit": "mg", "label": "Standard"},
      {"amount": 600, "unit": "mg", "label": "High"}
    ]
  },

  {
    "name": "Turkesterone",
    "aliases": ["Turkesterone", "Ajuga Turkestanica", "Ecdysterone", "Beta-Ecdysterone"],
    "category": "Gym — Ecdysteroid",
    "emoji": "🦂",
    "color": "#7c3aed",
    "timing": "meals",
    "timingNote": "Split into 2 doses with meals. Cyclodextrin-complexed form has far better absorption than raw extract.",
    "absorption": {
      "macro": "fat",
      "macroLabel": "🥑 With Food + Fat",
      "score": 70,
      "scoreLabel": "Good",
      "tip": "Standard turkesterone has poor bioavailability — look for complexed forms (cyclodextrin). Take with a fat-containing meal. Results build over 8–12 weeks."
    },
    "conflicts": [],
    "pairsWith": "Whey Protein",
    "pairsNote": "Ecdysteroids boost protein synthesis — pairing with adequate protein intake is essential.",
    "healthWarnings": ["limited long-term safety data in humans", "hormone-sensitive conditions (theoretical risk)"],
    "doses": [
      {"amount": 250, "unit": "mg", "label": "Low"},
      {"amount": 500, "unit": "mg", "label": "Standard"},
      {"amount": 1000, "unit": "mg", "label": "High"}
    ]
  },

  {
    "name": "Alpha-GPC",
    "aliases": ["Alpha-Glyceryl Phosphoryl Choline", "A-GPC", "Choline Alfoscerate"],
    "category": "Gym — Nootropic / Power",
    "emoji": "🧠",
    "color": "#0369a1",
    "timing": "morning",
    "timingNote": "30–60 min pre-workout. Also effective as a morning cognitive booster on non-training days.",
    "absorption": {
      "macro": "food",
      "macroLabel": "🍽️ With Food",
      "score": 82,
      "scoreLabel": "Good",
      "tip": "One of the most bioavailable choline sources — crosses the blood-brain barrier. 300–600 mg is the standard dose."
    },
    "conflicts": [
      { "name": "Anticholinergic drugs", "sev": "high", "note": "⚠️ MEDICATION: Directly opposes anticholinergic medications (some antihistamines, bladder meds, antidepressants)." }
    ],
    "pairsWith": "Pre-Workout (Caffeine)",
    "pairsNote": "Caffeine + Alpha-GPC is a popular nootropic pre-workout stack for focus, power, and mind-muscle connection.",
    "healthWarnings": ["on anticholinergic medications", "bipolar disorder", "epilepsy"],
    "doses": [
      {"amount": 150, "unit": "mg", "label": "Low"},
      {"amount": 300, "unit": "mg", "label": "Standard"},
      {"amount": 600, "unit": "mg", "label": "High"}
    ]
  },

  {
    "name": "Citrulline Malate",
    "aliases": ["Citrulline Malate 2:1", "CM"],
    "category": "Gym — Pump / Nitric Oxide",
    "emoji": "🩺",
    "color": "#be123c",
    "timing": "morning",
    "timingNote": "30–60 min pre-workout. 6–8 g of 2:1 citrulline malate is a clinical dose.",
    "absorption": {
      "macro": "empty",
      "macroLabel": "⬜ Empty Stomach",
      "score": 86,
      "scoreLabel": "Excellent",
      "tip": "The malate component independently reduces muscle fatigue via the Krebs cycle. More effective than L-Arginine for NO production."
    },
    "conflicts": [
      { "name": "ED medication (Viagra/Cialis)", "sev": "high", "note": "⚠️ DANGEROUS: Combined vasodilation can cause severe hypotension. Do NOT combine." }
    ],
    "pairsWith": "Beta-Alanine",
    "pairsNote": "Citrulline (endurance + pump) + Beta-Alanine (lactate buffer) = popular endurance pre-workout stack.",
    "healthWarnings": ["on PDE5 inhibitor medication", "low blood pressure"],
    "doses": [
      {"amount": 4000, "unit": "mg", "label": "Low"},
      {"amount": 6000, "unit": "mg", "label": "Standard"},
      {"amount": 8000, "unit": "mg", "label": "High"}
    ]
  },

  {
    "name": "Vitamin B3 (Niacin)",
    "aliases": ["Niacin", "Nicotinic Acid", "B3"],
    "category": "Water-Soluble Vitamin",
    "emoji": "🔴",
    "color": "#dc2626",
    "timing": "morning",
    "timingNote": "Morning with food — high doses cause flushing, take with meals to reduce it",
    "absorption": {
      "macro": "food",
      "macroLabel": "🍽️ With Food",
      "score": 85,
      "scoreLabel": "Excellent",
      "tip": "Take with food to reduce skin flushing side effect. Flush-free (inositol hexanicotinate) form has less flushing but weaker effects."
    },
    "conflicts": [
      { "name": "Statins", "sev": "medium", "note": "High-dose niacin + statins may increase muscle damage risk — consult doctor" }
    ],
    "pairsWith": "Vitamin B12",
    "pairsNote": "B vitamins work synergistically — taking the B complex together improves energy metabolism.",
    "healthWarnings": ["liver disease", "gout", "diabetes", "peptic ulcer"],
    "doses": [
      {"amount": 100, "unit": "mg", "label": "Low"},
      {"amount": 250, "unit": "mg", "label": "Standard"},
      {"amount": 500, "unit": "mg", "label": "⚠️ Flush risk"}
    ]
  },

  {
    "name": "Boron",
    "aliases": ["Boron Glycinate", "Boron Citrate", "Calcium Fructoborate"],
    "category": "Trace Mineral",
    "emoji": "🪨",
    "color": "#92400e",
    "timing": "morning",
    "timingNote": "Morning with food — consistent daily timing maintains steady blood levels. Supports bone density and testosterone metabolism",
    "absorption": {
      "macro": "fat",
      "macroLabel": "🥑 With Fat",
      "score": 80,
      "scoreLabel": "Good",
      "tip": "Take with a meal containing healthy fats. Boron glycinate form is the most bioavailable. Works synergistically with Vitamin D3 and Magnesium — consider taking at the same meal."
    },
    "conflicts": [
      { "name": "Hormone therapy", "sev": "low", "note": "Boron can mildly boost estrogen and testosterone — inform your doctor if on hormone therapy" }
    ],
    "pairsWith": "Vitamin D3",
    "pairsNote": "Boron enhances Vitamin D3 metabolism and extends its half-life in the body — a natural synergistic pairing.",
    "healthWarnings": ["hormone-sensitive conditions", "kidney disease"],
    "doses": [
      {"amount": 3, "unit": "mg", "label": "Standard"},
      {"amount": 6, "unit": "mg", "label": "High"},
      {"amount": 10, "unit": "mg", "label": "⚠️ Max"}
    ]
  },

  {
    "name": "Omega 3-6-9",
    "aliases": ["Essential Fatty Acids", "EFA Blend", "Omega Blend", "Triple Omega"],
    "category": "Essential Fatty Acids",
    "emoji": "🫙",
    "color": "#0369a1",
    "timing": "morning",
    "timingNote": "With your largest meal — fat-soluble, needs dietary fat for absorption. Never take on an empty stomach (causes GI upset and fishy burps)",
    "absorption": {
      "macro": "fat",
      "macroLabel": "🥑 With Fat",
      "score": 92,
      "scoreLabel": "Excellent",
      "tip": "Always take with a full meal containing fat. Store in the fridge after opening to prevent oxidation (rancidity). If you experience fishy reflux, try freezing the capsules before swallowing."
    },
    "conflicts": [
      { "name": "Warfarin", "sev": "high", "note": "Omega fatty acids have blood-thinning properties — can dangerously amplify anticoagulant medication" },
      { "name": "Aspirin", "sev": "medium", "note": "Combined blood-thinning effect — inform your doctor if on daily aspirin" }
    ],
    "pairsWith": "Vitamin D3",
    "pairsNote": "Fat-soluble Vitamin D3 absorbs significantly better when taken alongside omega fatty acids.",
    "healthWarnings": ["blood clotting disorders", "upcoming surgery (stop 1-2 weeks before)", "seafood/fish allergy"],
    "doses": [
      {"amount": 500, "unit": "mg", "label": "Low"},
      {"amount": 1000, "unit": "mg", "label": "Standard"},
      {"amount": 2000, "unit": "mg", "label": "High"}
    ]
  },

  {
    "name": "Horny Goat Weed",
    "aliases": ["Epimedium", "Icariin", "Yin Yang Huo", "Barrenwort"],
    "category": "Herbal / Testosterone Support",
    "emoji": "🌿",
    "color": "#16a34a",
    "timing": "morning",
    "timingNote": "Morning with food — active compound icariin is fat-soluble. Effects are cumulative over weeks of consistent use",
    "absorption": {
      "macro": "fat",
      "macroLabel": "🥑 With Fat",
      "score": 78,
      "scoreLabel": "Good",
      "tip": "The active compound icariin absorbs better with a fat-containing meal. Standardised extract (10-60% icariin) is far more reliable than raw herb powder."
    },
    "conflicts": [
      { "name": "Blood pressure medication", "sev": "medium", "note": "Horny Goat Weed may lower blood pressure — additive effect with antihypertensive drugs" },
      { "name": "Warfarin", "sev": "medium", "note": "Has mild blood-thinning properties — caution if on anticoagulants" },
      { "name": "ED medication (Viagra/Cialis)", "sev": "high", "note": "Both inhibit PDE5 — combining may cause a dangerous blood pressure drop" }
    ],
    "pairsWith": "Tongkat Ali",
    "pairsNote": "Horny Goat Weed and Tongkat Ali target complementary pathways for testosterone and libido support — a popular men's health stack.",
    "healthWarnings": ["heart conditions", "hormone-sensitive cancers", "low blood pressure", "pregnancy/breastfeeding"],
    "doses": [
      {"amount": 250, "unit": "mg", "label": "Low"},
      {"amount": 500, "unit": "mg", "label": "Standard"},
      {"amount": 750, "unit": "mg", "label": "High"}
    ]
  },

  {
    "name": "Pycnogenol",
    "aliases": ["Pine Bark Extract", "French Maritime Pine Bark", "OPC"],
    "category": "Antioxidant",
    "emoji": "🌲",
    "color": "#7c3aed",
    "timing": "morning",
    "timingNote": "Morning with a meal. For therapeutic doses, split morning and evening. Takes 4-6 weeks for full antioxidant and circulation benefits",
    "absorption": {
      "macro": "food",
      "macroLabel": "🍽️ With Food",
      "score": 85,
      "scoreLabel": "Excellent",
      "tip": "Water-soluble antioxidant — absorbs well with or without food, but food reduces GI upset at higher doses. Effects are measurable within 30 minutes. Pairs synergistically with Vitamin C."
    },
    "conflicts": [
      { "name": "Warfarin", "sev": "medium", "note": "Mild antiplatelet effect — may enhance blood-thinning medications" },
      { "name": "Immunosuppressants", "sev": "medium", "note": "Pycnogenol stimulates immune activity — may counteract immunosuppressive drugs" },
      { "name": "Diabetes medication", "sev": "low", "note": "Can lower blood sugar modestly — monitor levels if on diabetes medication" }
    ],
    "pairsWith": "Vitamin C",
    "pairsNote": "Pycnogenol regenerates oxidised Vitamin C back to its active form — a powerful antioxidant synergy that amplifies both supplements.",
    "healthWarnings": ["autoimmune conditions", "upcoming surgery", "bleeding disorders"],
    "doses": [
      {"amount": 50, "unit": "mg", "label": "Low"},
      {"amount": 100, "unit": "mg", "label": "Standard"},
      {"amount": 150, "unit": "mg", "label": "Therapeutic"}
    ]
  },

  {
    "name": "Selenium",
    "aliases": ["Selenomethionine", "L-Selenomethionine", "Sodium Selenite", "Se"],
    "category": "Trace Mineral",
    "emoji": "⚗️",
    "color": "#0891b2",
    "timing": "morning",
    "timingNote": "Morning with food — helps prevent nausea at higher doses. Do not exceed 400mcg/day as selenium toxicity (selenosis) is serious",
    "absorption": {
      "macro": "protein",
      "macroLabel": "🥩 With Protein",
      "score": 88,
      "scoreLabel": "Excellent",
      "tip": "Selenomethionine (organic form) absorbs ~90% — far superior to inorganic selenite (~50%). Taking with protein-rich food slightly enhances uptake. IMPORTANT: Never exceed 400mcg/day — toxicity risk is real."
    },
    "conflicts": [
      { "name": "Vitamin C", "sev": "low", "note": "High-dose Vitamin C may reduce absorption of selenite form — less issue with selenomethionine. Space apart by 2 hours to be safe" },
      { "name": "Statins", "sev": "low", "note": "Some evidence of interaction with statin metabolism — keep doses at recommended levels" }
    ],
    "pairsWith": "Vitamin E",
    "pairsNote": "Selenium and Vitamin E are synergistic antioxidants — they regenerate each other and provide substantially stronger combined cellular protection.",
    "healthWarnings": ["DO NOT exceed 400mcg/day (toxicity risk)", "thyroid conditions — monitor closely", "kidney disease"],
    "doses": [
      {"amount": 50, "unit": "mcg", "label": "Low"},
      {"amount": 100, "unit": "mcg", "label": "Standard"},
      {"amount": 200, "unit": "mcg", "label": "⚠️ Max 400mcg"}
    ]
  },

  {
    "name": "Lion's Mane Mushroom",
    "aliases": ["Hericium Erinaceus", "Yamabushitake", "Lion's Mane"],
    "category": "Nootropic / Mushroom",
    "emoji": "🍄",
    "color": "#d97706",
    "timing": "morning",
    "timingNote": "Morning with food — NGF (nerve growth factor) stimulation is cumulative; consistent daily use for 4-8 weeks for noticeable cognitive results",
    "absorption": {
      "macro": "fat",
      "macroLabel": "🥑 With Fat",
      "score": 82,
      "scoreLabel": "Good",
      "tip": "Look for a dual-extract product (hot water AND ethanol extraction) to get both beta-glucans AND hericenones/erinacines. Fat-containing meals improve absorption of the lipid-soluble active compounds."
    },
    "conflicts": [
      { "name": "Blood thinners", "sev": "low", "note": "Mild antiplatelet properties — monitor if on anticoagulant medication" },
      { "name": "Diabetes medication", "sev": "low", "note": "May modestly lower blood sugar — monitor if diabetic" }
    ],
    "pairsWith": "Alpha-GPC",
    "pairsNote": "Lion's Mane promotes growth of new neural connections (via NGF) while Alpha-GPC provides acetylcholine to use them — a powerful cognitive stack.",
    "healthWarnings": ["mushroom allergies", "autoimmune conditions", "pregnancy/breastfeeding"],
    "doses": [
      {"amount": 250, "unit": "mg", "label": "Low"},
      {"amount": 500, "unit": "mg", "label": "Standard"},
      {"amount": 1000, "unit": "mg", "label": "High"}
    ]
  },

  {
    "name": "L-Theanine",
    "aliases": ["Theanine", "Suntheanine", "L-γ-glutamylethylamide"],
    "category": "Nootropic / Amino Acid",
    "emoji": "🍵",
    "color": "#65a30d",
    "timing": "anytime",
    "timingNote": "Highly flexible — pair with caffeine in the morning for calm focus, or take alone in the evening to wind down. Effects felt within 30-45 minutes",
    "absorption": {
      "macro": "empty",
      "macroLabel": "🚫 Empty Stomach",
      "score": 90,
      "scoreLabel": "Excellent",
      "tip": "Rapidly absorbed on empty stomach. The classic stack is 200mg L-Theanine + 100mg caffeine — L-Theanine eliminates jitteriness and crash while preserving energy and focus. Works with food too; just slightly slower onset."
    },
    "conflicts": [
      { "name": "Sedatives", "sev": "low", "note": "Additive calming effect with sedative medications — may cause excessive drowsiness" },
      { "name": "Blood pressure medication", "sev": "low", "note": "Can mildly lower blood pressure — monitor if on antihypertensives" }
    ],
    "pairsWith": "Pre-Workout (Caffeine)",
    "pairsNote": "The ultimate 2:1 stack (200mg theanine : 100mg caffeine) — L-Theanine neutralises caffeine jitters and crash while preserving all the energy and focus benefits.",
    "healthWarnings": ["low blood pressure"],
    "doses": [
      {"amount": 100, "unit": "mg", "label": "Calm"},
      {"amount": 200, "unit": "mg", "label": "Standard"},
      {"amount": 400, "unit": "mg", "label": "High"}
    ]
  },

  {
    "name": "Black Maca",
    "aliases": ["Maca Root", "Lepidium meyenii", "Peruvian Ginseng", "Black Maca Root"],
    "category": "Herbal / Adaptogen",
    "emoji": "⚫",
    "color": "#374151",
    "timing": "morning",
    "timingNote": "Morning with breakfast — gelatinised form is easier on digestion than raw. Effects are cumulative; expect 2-4 weeks of consistent use before noticing results",
    "absorption": {
      "macro": "food",
      "macroLabel": "🍽️ With Food",
      "score": 78,
      "scoreLabel": "Good",
      "tip": "Gelatinised (pre-cooked) maca is more bioavailable and easier on the gut than raw maca. Black variety has the strongest effects on energy, libido and male fertility vs yellow or red maca. Take with breakfast for sustained energy throughout the day."
    },
    "conflicts": [
      { "name": "Hormone therapy", "sev": "medium", "note": "Maca is a hormonal adaptogen — may interact with estrogen or testosterone therapies" },
      { "name": "Thyroid medication", "sev": "low", "note": "Maca contains glucosinolates which may affect thyroid function — consult doctor if on thyroid meds" }
    ],
    "pairsWith": "Tongkat Ali",
    "pairsNote": "Black Maca + Tongkat Ali is a popular men's vitality stack — complementary mechanisms for testosterone support, energy and libido.",
    "healthWarnings": ["hormone-sensitive cancers", "thyroid disorders", "pregnancy"],
    "doses": [
      {"amount": 1500, "unit": "mg", "label": "Low"},
      {"amount": 3000, "unit": "mg", "label": "Standard"},
      {"amount": 5000, "unit": "mg", "label": "High"}
    ]
  },

  {
    "name": "EAA (Essential Amino Acids)",
    "aliases": ["EAA", "Essential Amino Acids", "Complete Amino Acids", "All 9 Amino Acids"],
    "category": "Sports / Amino Acids",
    "emoji": "💪",
    "color": "#dc2626",
    "timing": "morning",
    "timingNote": "Around training — intra-workout or immediately post-workout for peak muscle protein synthesis. Can also replace a protein shake as a faster-absorbing option",
    "absorption": {
      "macro": "empty",
      "macroLabel": "🚫 Empty Stomach",
      "score": 92,
      "scoreLabel": "Excellent",
      "tip": "Free-form EAAs require no digestion and absorb within minutes — fastest when mixed in water on an empty stomach or sipped throughout training. All 9 essential amino acids in correct ratios are needed for full muscle protein synthesis."
    },
    "conflicts": [],
    "pairsWith": "Creatine",
    "pairsNote": "EAAs supply the building blocks for muscle protein synthesis while Creatine fuels the ATP energy system — the foundational muscle-building stack.",
    "healthWarnings": ["kidney disease (consult doctor for high amino acid intake)", "PKU — contains phenylalanine"],
    "doses": [
      {"amount": 5, "unit": "g", "label": "Low"},
      {"amount": 10, "unit": "g", "label": "Standard"},
      {"amount": 15, "unit": "g", "label": "High"}
    ]
  },

  {
    "name": "Black Seed Oil",
    "aliases": ["Nigella Sativa", "Black Cumin Seed Oil", "Kalonji Oil", "Black Caraway Oil", "Blessed Seed"],
    "category": "Herbal / Anti-inflammatory",
    "emoji": "🖤",
    "color": "#1c1917",
    "timing": "morning",
    "timingNote": "Morning before or with a light meal — empty stomach maximises thymoquinone absorption; with food reduces GI discomfort",
    "absorption": {
      "macro": "fat",
      "macroLabel": "🥑 With Fat",
      "score": 85,
      "scoreLabel": "Excellent",
      "tip": "Thymoquinone (the key active compound) is fat-soluble. Take with a small amount of olive oil or a fatty meal. Store in fridge — black seed oil oxidises quickly at room temperature. Cold-pressed is most potent."
    },
    "conflicts": [
      { "name": "Warfarin", "sev": "medium", "note": "Has anticoagulant properties — may enhance blood-thinning medication effect" },
      { "name": "Immunosuppressants", "sev": "medium", "note": "Stimulates immune function — may work against immunosuppressive drugs" },
      { "name": "Diabetes medication", "sev": "low", "note": "Can lower blood sugar — monitor levels if on diabetes medication" }
    ],
    "pairsWith": "Omega-3 (Fish Oil)",
    "pairsNote": "Black Seed Oil (rich in Omega-6 and thymoquinone) + Fish Oil (Omega-3) together provide a balanced anti-inflammatory fatty acid profile.",
    "healthWarnings": ["upcoming surgery — stop 2 weeks before", "pregnancy (avoid therapeutic doses)", "blood clotting disorders"],
    "doses": [
      {"amount": 500, "unit": "mg", "label": "Low"},
      {"amount": 1000, "unit": "mg", "label": "Standard"},
      {"amount": 2000, "unit": "mg", "label": "High"}
    ]
  },

  {
    "name": "Multivitamin",
    "aliases": ["Multi", "Daily Multi", "Two-Per-Day", "Multivitamin & Mineral"],
    "category": "Foundation / Vitamins & Minerals",
    "emoji": "💊",
    "color": "#7c3aed",
    "timing": "morning",
    "timingNote": "Morning with your largest meal — fat-soluble vitamins (A, D, E, K) require dietary fat. If taking 2/day (e.g. Two-Per-Day), split between morning and evening meals",
    "absorption": {
      "macro": "fat",
      "macroLabel": "🥑 With Fat",
      "score": 85,
      "scoreLabel": "Excellent",
      "tip": "Always take with a full meal containing fat to maximise fat-soluble vitamins. If you're also taking separate D3/K2, Magnesium or Zinc, check your multi's amounts to avoid over-supplementing."
    },
    "conflicts": [
      { "name": "Iron", "sev": "low", "note": "Calcium in multivitamins competes with iron absorption — avoid taking with a separate high-dose iron supplement at the same time" }
    ],
    "pairsWith": "Omega-3 (Fish Oil)",
    "pairsNote": "Omega-3 fatty acids enhance absorption of the fat-soluble vitamins (A, D, E, K) in your multivitamin when taken together at the same meal.",
    "healthWarnings": ["check for duplicate supplementation with individual vitamins/minerals you already take"],
    "doses": [
      {"amount": 1, "unit": "capsule", "label": "Standard (follow label)"}
    ]
  },

  {
    "name": "Acetyl L-Carnitine",
    "aliases": ["ALCAR", "Acetyl-L-Carnitine", "Acetylcarnitine", "ALC"],
    "category": "Nootropic / Energy",
    "emoji": "⚡",
    "color": "#f59e0b",
    "timing": "morning",
    "timingNote": "Morning on empty stomach or pre-workout — peaks within 3-4 hours. Avoid taking in the evening as it may disrupt sleep due to its energising effect",
    "absorption": {
      "macro": "empty",
      "macroLabel": "🚫 Empty Stomach",
      "score": 88,
      "scoreLabel": "Excellent",
      "tip": "ALCAR crosses the blood-brain barrier better than regular L-Carnitine — take on empty stomach for maximum nootropic effect. If you experience GI discomfort, take with a light low-fat meal. Don't confuse with plain L-Carnitine — these have meaningfully different effects."
    },
    "conflicts": [
      { "name": "Thyroid medication", "sev": "medium", "note": "L-Carnitine compounds may block thyroid hormone activity at the receptor level — consult doctor if on thyroid meds" },
      { "name": "Warfarin", "sev": "low", "note": "May modestly affect anticoagulant levels — inform your doctor" }
    ],
    "pairsWith": "Alpha-GPC",
    "pairsNote": "ALCAR provides acetyl groups that support acetylcholine synthesis, while Alpha-GPC provides the choline — a synergistic cognitive stack.",
    "healthWarnings": ["bipolar disorder — may trigger mania", "seizure disorders", "hypothyroidism"],
    "doses": [
      {"amount": 250, "unit": "mg", "label": "Low"},
      {"amount": 500, "unit": "mg", "label": "Standard"},
      {"amount": 1000, "unit": "mg", "label": "High"}
    ]
  },

  {
    "name": "Mucuna Pruriens",
    "aliases": ["L-DOPA", "Velvet Bean", "Kapikachhu", "Natural L-DOPA", "Cowhage"],
    "category": "Herbal / Dopamine Support",
    "emoji": "🫘",
    "color": "#6d28d9",
    "timing": "morning",
    "timingNote": "Morning on EMPTY stomach — L-DOPA directly competes with other amino acids for brain transport. Take 30 min before breakfast. Never with a protein meal",
    "absorption": {
      "macro": "empty",
      "macroLabel": "🚫 Empty Stomach",
      "score": 90,
      "scoreLabel": "Excellent",
      "tip": "CRITICAL: Empty stomach only — protein foods block L-DOPA from crossing the blood-brain barrier. Wait at least 45-60 minutes after taking before eating protein. A small carbohydrate snack is fine. Standardised extract (15-40% L-DOPA) is more predictable than raw powder."
    },
    "conflicts": [
      { "name": "MAOIs", "sev": "high", "note": "DANGEROUS — L-DOPA + MAOIs can cause a life-threatening hypertensive crisis. Absolute contraindication." },
      { "name": "Antidepressants", "sev": "high", "note": "High risk of serotonin/dopamine imbalance — do not combine without medical supervision" },
      { "name": "Parkinson's medication (Levodopa)", "sev": "high", "note": "Mucuna IS natural levodopa — combining without medical guidance risks overdose and serious side effects" }
    ],
    "pairsWith": "Vitamin B6",
    "pairsNote": "Vitamin B6 (P-5-P form) is the essential cofactor for converting L-DOPA into dopamine — it enhances the conversion and reduces nausea side effects.",
    "healthWarnings": ["DO NOT use with MAOIs or antidepressants", "Parkinson's disease — medical supervision required", "schizophrenia or psychosis", "heart conditions", "diabetes", "liver/kidney disease"],
    "doses": [
      {"amount": 250, "unit": "mg", "label": "Low"},
      {"amount": 500, "unit": "mg", "label": "Standard"},
      {"amount": 1000, "unit": "mg", "label": "⚠️ High"}
    ]
  },

  {
    "name": "GABA",
    "aliases": ["Gamma-Aminobutyric Acid", "PharmaGABA", "Pharma-GABA"],
    "category": "Relaxation / Sleep",
    "emoji": "😴",
    "color": "#1d4ed8",
    "timing": "evening",
    "timingNote": "30-60 min before bed — promotes relaxation and deeper sleep. Some athletes also use pre-workout for natural growth hormone release",
    "absorption": {
      "macro": "empty",
      "macroLabel": "🚫 Empty Stomach",
      "score": 72,
      "scoreLabel": "Moderate",
      "tip": "Standard GABA has limited blood-brain barrier crossing ability. PharmaGABA (fermented, natural form) is noticeably more bioactive. Take on empty stomach. Note: the calming effect may be partly peripheral (gut/body) rather than direct brain action."
    },
    "conflicts": [
      { "name": "Sedatives", "sev": "high", "note": "GABA enhances CNS inhibition — combining with benzodiazepines, barbiturates or sedative drugs can cause dangerous CNS/respiratory depression" },
      { "name": "Alcohol", "sev": "medium", "note": "Both cause CNS depression via GABA pathways — do not combine" },
      { "name": "Anxiety medication", "sev": "medium", "note": "Additive sedative effects — discuss with your doctor before combining" }
    ],
    "pairsWith": "Melatonin",
    "pairsNote": "GABA relaxes the nervous system (reduces mental chatter) while Melatonin sets the biological sleep clock — addressing both physical and hormonal aspects of sleep.",
    "healthWarnings": ["operating machinery or driving", "existing CNS or anxiety medications", "pregnancy/breastfeeding"],
    "doses": [
      {"amount": 250, "unit": "mg", "label": "Low"},
      {"amount": 500, "unit": "mg", "label": "Standard"},
      {"amount": 750, "unit": "mg", "label": "High"}
    ]
  },

  {
    "name": "DL-Phenylalanine",
    "aliases": ["DLPA", "Phenylalanine", "D-Phenylalanine", "L-Phenylalanine"],
    "category": "Nootropic / Mood",
    "emoji": "🧠",
    "color": "#0f766e",
    "timing": "morning",
    "timingNote": "Morning on empty stomach — competes with other amino acids for brain entry. Take 30 min before breakfast, well away from protein-rich meals",
    "absorption": {
      "macro": "empty",
      "macroLabel": "🚫 Empty Stomach",
      "score": 88,
      "scoreLabel": "Excellent",
      "tip": "Empty stomach is critical — large neutral amino acids from protein foods directly block phenylalanine from entering the brain. A small carbohydrate snack is fine. D-form preserves enkephalins (natural pain relief); L-form is the dopamine precursor. DLPA provides both benefits."
    },
    "conflicts": [
      { "name": "MAOIs", "sev": "high", "note": "DANGEROUS — Phenylalanine + MAOIs can cause a severe hypertensive crisis" },
      { "name": "Antidepressants (SSRIs)", "sev": "medium", "note": "May alter dopamine and norepinephrine levels — discuss with doctor before combining" },
      { "name": "Parkinson's medication (Levodopa)", "sev": "medium", "note": "Competes for the same brain transporter as levodopa — may reduce medication effectiveness" }
    ],
    "pairsWith": "Vitamin B6",
    "pairsNote": "Vitamin B6 is the essential cofactor for converting phenylalanine to dopamine and norepinephrine — always pair them for best results.",
    "healthWarnings": ["PKU (phenylketonuria) — CANNOT take this supplement", "schizophrenia", "anxiety disorders", "DO NOT combine with MAOIs"],
    "doses": [
      {"amount": 250, "unit": "mg", "label": "Low"},
      {"amount": 500, "unit": "mg", "label": "Standard"},
      {"amount": 1000, "unit": "mg", "label": "High"}
    ]
  },

  {
    "name": "Huperzine A",
    "aliases": ["Hup A", "Huperzia serrata extract", "Selagine"],
    "category": "Nootropic / Cognitive",
    "emoji": "🧩",
    "color": "#0284c7",
    "timing": "morning",
    "timingNote": "Morning with food — ONCE daily is sufficient due to long half-life (~10-14 hrs). Cycle on/off (5 days on, 2 off, or 2 weeks on, 1 off) to prevent downregulation",
    "absorption": {
      "macro": "food",
      "macroLabel": "🍽️ With Food",
      "score": 85,
      "scoreLabel": "Excellent",
      "tip": "Nearly 100% bioavailable — no special timing trick needed beyond taking with food to prevent nausea. CRITICAL: Do NOT take twice daily — the 10-14 hour half-life means it accumulates. Cycling is strongly recommended for long-term use."
    },
    "conflicts": [
      { "name": "Anticholinergic drugs", "sev": "high", "note": "Directly opposing mechanisms — Huperzine A preserves acetylcholine while anticholinergics block it. Combining is counterproductive and potentially harmful." },
      { "name": "Alzheimer's medication (Donepezil/Aricept)", "sev": "high", "note": "Same mechanism as prescription acetylcholinesterase inhibitors — doubling up is dangerous" },
      { "name": "Heart medication", "sev": "medium", "note": "Can slow heart rate — caution with bradycardia or heart rate medications" }
    ],
    "pairsWith": "Alpha-GPC",
    "pairsNote": "Alpha-GPC donates choline to build acetylcholine; Huperzine A prevents its breakdown — together they create a synergistic boost to cholinergic activity in the brain.",
    "healthWarnings": ["heart conditions or slow heart rate", "epilepsy/seizures", "GI ulcers", "asthma", "pregnancy/breastfeeding"],
    "doses": [
      {"amount": 50, "unit": "mcg", "label": "Standard"},
      {"amount": 100, "unit": "mcg", "label": "High"},
      {"amount": 200, "unit": "mcg", "label": "⚠️ Max"}
    ]
  },

  {
    "name": "5-HTP",
    "aliases": ["5-Hydroxytryptophan", "Oxitriptan", "Griffonia Seed Extract"],
    "category": "Mood / Sleep",
    "emoji": "🌙",
    "color": "#7e22ce",
    "timing": "evening",
    "timingNote": "Evening or 30 min before bed — converts to serotonin then melatonin. Morning use can cause daytime drowsiness. Never combine with antidepressants.",
    "absorption": {
      "macro": "empty",
      "macroLabel": "🚫 Empty Stomach",
      "score": 90,
      "scoreLabel": "Excellent",
      "tip": "Take with a small carbohydrate snack (not protein) — carbs trigger insulin which clears competing amino acids from the bloodstream, improving 5-HTP's brain uptake. Protein competes directly with 5-HTP for brain transport. NEVER combine with SSRIs, SNRIs, or MAOIs."
    },
    "conflicts": [
      { "name": "SSRIs / SNRIs (Antidepressants)", "sev": "high", "note": "SERIOUS RISK of Serotonin Syndrome — potentially life-threatening. Do NOT combine 5-HTP with any serotonergic antidepressant under any circumstances." },
      { "name": "MAOIs", "sev": "high", "note": "DANGEROUS — can cause fatal serotonin syndrome. Absolute contraindication." },
      { "name": "Triptans (migraine medication)", "sev": "high", "note": "Both act on serotonin receptors — risk of serotonin syndrome" },
      { "name": "Tramadol", "sev": "high", "note": "Tramadol raises serotonin levels — combining with 5-HTP risks serious serotonin syndrome" }
    ],
    "pairsWith": "Magnesium",
    "pairsNote": "Magnesium is a required cofactor for the enzyme that converts 5-HTP into serotonin. Taking together optimises serotonin and downstream melatonin production.",
    "healthWarnings": ["DO NOT take with SSRIs, SNRIs, MAOIs, or triptans — serotonin syndrome risk", "depression — use under medical supervision only", "stop 2 weeks before surgery", "Down syndrome"],
    "doses": [
      {"amount": 50, "unit": "mg", "label": "Low"},
      {"amount": 100, "unit": "mg", "label": "Standard"},
      {"amount": 200, "unit": "mg", "label": "⚠️ High"}
    ]
  },

  {
    "name": "Psyllium Husk",
    "aliases": ["Psyllium", "Isabgol", "Metamucil", "Psyllium Fiber"],
    "category": "Digestive Health / Fiber",
    "emoji": "🌾",
    "color": "#ca8a04",
    "timing": "morning",
    "timingNote": "Before a meal or before bed — ALWAYS with a large full glass of water (250ml+). Take 1-2 hours apart from ALL other supplements and medications",
    "absorption": {
      "macro": "empty",
      "macroLabel": "🚫 Empty Stomach",
      "score": 75,
      "scoreLabel": "Good",
      "tip": "CRITICAL: Drink a full large glass of water immediately, then continue drinking water throughout the day. Psyllium expands dramatically — insufficient water risks GI blockage or choking. Must be taken well away from all medications and other supplements as it physically absorbs them and reduces their effectiveness."
    },
    "conflicts": [
      { "name": "ALL medications", "sev": "medium", "note": "Psyllium fiber physically binds to and reduces absorption of virtually all oral medications — always take at least 1-2 hours apart from any medication or supplement" },
      { "name": "Diabetes medication", "sev": "low", "note": "Psyllium lowers post-meal blood sugar — may amplify diabetes medication, monitor blood glucose carefully" },
      { "name": "Lithium", "sev": "medium", "note": "May reduce lithium absorption — maintain consistent timing and spacing if on lithium" }
    ],
    "pairsWith": "Probiotics",
    "pairsNote": "Psyllium acts as a prebiotic — it feeds and sustains the beneficial bacteria delivered by your probiotic, amplifying gut microbiome benefits.",
    "healthWarnings": ["ALWAYS take with plenty of water — bowel obstruction risk otherwise", "bowel obstruction or narrowing", "difficulty swallowing", "take FAR from all medications"],
    "doses": [
      {"amount": 3400, "unit": "mg", "label": "Low"},
      {"amount": 5000, "unit": "mg", "label": "Standard"},
      {"amount": 10000, "unit": "mg", "label": "High"}
    ]
  },

  {
    "name": "L-Tyrosine",
    "aliases": ["Tyrosine", "L-Tyrosine", "N-Acetyl Tyrosine", "NALT"],
    "category": "Nootropic / Amino Acid",
    "emoji": "🎯",
    "color": "#b45309",
    "timing": "morning",
    "timingNote": "Morning on empty stomach or 30 min pre-workout — competes with other amino acids for brain entry. Avoid taking alongside a high-protein meal",
    "absorption": {
      "macro": "empty",
      "macroLabel": "🚫 Empty Stomach",
      "score": 88,
      "scoreLabel": "Excellent",
      "tip": "Must be taken on empty stomach or with a low-protein carbohydrate meal — protein amino acids block L-Tyrosine's brain transport. Most effective under stress (stress depletes dopamine/norepinephrine, which tyrosine replenishes). N-Acetyl Tyrosine (NALT) is more water-soluble but converts less efficiently."
    },
    "conflicts": [
      { "name": "MAOIs", "sev": "high", "note": "DANGEROUS — Tyrosine + MAOIs can cause a severe hypertensive crisis. Absolute contraindication." },
      { "name": "Thyroid medication (Synthroid/Levothyroxine)", "sev": "medium", "note": "Tyrosine is a precursor to thyroid hormones — may alter thyroid medication requirements. Consult doctor." },
      { "name": "Levodopa (Parkinson's medication)", "sev": "medium", "note": "Competes for the same brain transporter — may reduce levodopa effectiveness" }
    ],
    "pairsWith": "Vitamin B6",
    "pairsNote": "Vitamin B6 is the essential cofactor enzyme for converting L-Tyrosine into dopamine and norepinephrine — always pair for optimal effect.",
    "healthWarnings": ["hyperthyroidism or Graves' disease", "melanoma (tyrosine is a melanin precursor)", "DO NOT combine with MAOIs"],
    "doses": [
      {"amount": 500, "unit": "mg", "label": "Low"},
      {"amount": 1000, "unit": "mg", "label": "Standard"},
      {"amount": 2000, "unit": "mg", "label": "High"}
    ]
  }

];
// ── END OF SUPPLEMENT LIST ────────────────────────────────
