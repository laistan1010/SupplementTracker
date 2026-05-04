// ─── db.js ───────────────────────────────────────────
// ════════════════════════════════════════════════════
//  SUPPLEMENT DATABASE
// ════════════════════════════════════════════════════
let DB = [  // ← overridden at runtime by data/supplements.json when server is running
  {
    name:"Vitamin D3", aliases:["Vitamin D","D3","Cholecalciferol"],
    category:"Fat-Soluble Vitamin", emoji:"☀️", color:"#f59e0b",
    timing:"morning",
    timingNote:"Morning preferred — late dosing may affect sleep in sensitive people",
    absorption:{ macro:"fat", macroLabel:"🥑 With Fat", score:92, scoreLabel:"Excellent",
      tip:"Take with your fattiest meal. Avocado, olive oil, nuts, or eggs all significantly boost uptake." },
    conflicts:[
      {name:"Calcium",sev:"low",note:"High-dose calcium may slightly compete — a 1–2 h gap is plenty"}
    ],
    pairsWith:"Vitamin K2", pairsNote:"K2 directs D3-absorbed calcium into bones, not arteries. A natural pair.",
    healthWarnings:["hypercalcemia","kidney stones","sarcoidosis","kidney disease"]
  },
  {
    name:"Vitamin K2", aliases:["K2","MK-7","Menaquinone"],
    category:"Fat-Soluble Vitamin", emoji:"🦴", color:"#10b981",
    timing:"morning",
    timingNote:"Take with morning meal containing fat",
    absorption:{ macro:"fat", macroLabel:"🥑 With Fat", score:88, scoreLabel:"Excellent",
      tip:"Fat-soluble — always take with a meal. MK-7 form lasts longer in the body than MK-4." },
    conflicts:[
      {name:"Warfarin",sev:"high",note:"⚠️ MEDICATION: K2 directly opposes blood thinners. Consult your doctor before use."},
      {name:"Vitamin E",sev:"medium",note:"High-dose Vitamin E may reduce K2 activity — take at different times"}
    ],
    pairsWith:"Vitamin D3", pairsNote:"Essential partner for D3 — works synergistically for bone and heart health.",
    healthWarnings:["blood clotting disorders","on anticoagulants","warfarin"]
  },
  {
    name:"Vitamin A", aliases:["Retinol","Beta-Carotene","Retinyl Palmitate"],
    category:"Fat-Soluble Vitamin", emoji:"🥕", color:"#f97316",
    timing:"morning",
    timingNote:"Take with breakfast — fat-soluble so needs a meal",
    absorption:{ macro:"fat", macroLabel:"🥑 With Fat", score:85, scoreLabel:"Excellent",
      tip:"Fat-soluble. Do not exceed recommended doses — it accumulates in the body and can be toxic in excess." },
    conflicts:[
      {name:"Vitamin D3",sev:"low",note:"Very high-dose A may antagonise D3 — stay within recommended limits for both"}
    ],
    pairsWith:"Zinc", pairsNote:"Zinc is needed to mobilise Vitamin A out of the liver.",
    healthWarnings:["liver disease","pregnancy (high doses teratogenic)","osteoporosis"]
  },
  {
    name:"Vitamin E", aliases:["Tocopherol","Alpha-Tocopherol"],
    category:"Fat-Soluble Vitamin", emoji:"🌿", color:"#84cc16",
    timing:"morning",
    timingNote:"Take with any fat-containing meal",
    absorption:{ macro:"fat", macroLabel:"🥑 With Fat", score:87, scoreLabel:"Excellent",
      tip:"Fat-soluble antioxidant. Mixed tocopherols are preferred over alpha-tocopherol alone." },
    conflicts:[
      {name:"Vitamin K2",sev:"medium",note:"High-dose E may impair K2 clotting function — take at different meals"},
      {name:"Iron",sev:"medium",note:"High-dose E and Iron antagonise each other — take 2 h apart"},
      {name:"Warfarin",sev:"high",note:"⚠️ MEDICATION: May enhance blood-thinning effect. Tell your doctor."}
    ],
    pairsWith:"Vitamin C", pairsNote:"Vitamin C regenerates oxidised Vitamin E — extends its antioxidant lifespan.",
    healthWarnings:["blood clotting disorders","on blood thinners","vitamin K deficiency"]
  },
  {
    name:"Vitamin C", aliases:["Ascorbic Acid","Ascorbate"],
    category:"Water-Soluble Vitamin", emoji:"🍊", color:"#f97316",
    timing:"anytime",
    timingNote:"Anytime — water-soluble so very flexible. Split high doses (>500 mg) throughout the day.",
    absorption:{ macro:"water", macroLabel:"💧 With Water", score:90, scoreLabel:"Excellent",
      tip:"Water-soluble and well-absorbed. Liposomal C has superior uptake. Doses >1 g split across meals." },
    conflicts:[
      {name:"Iron",sev:"positive",note:"✅ SYNERGY: Vitamin C can triple non-heme iron absorption. Take together!"},
      {name:"Copper",sev:"low",note:"Very high doses (>2 g/day) may slightly reduce copper — monitor long-term"}
    ],
    pairsWith:"Iron", pairsNote:"Dramatically boosts plant-based iron absorption — always pair them.",
    healthWarnings:["kidney stones (oxalate)","hemochromatosis","G6PD deficiency"]
  },
  {
    name:"Vitamin B12", aliases:["Cobalamin","Methylcobalamin","Cyanocobalamin","B12"],
    category:"Water-Soluble Vitamin", emoji:"⚡", color:"#dc2626",
    timing:"morning",
    timingNote:"Morning — B12 supports energy production and may interfere with sleep if taken at night",
    absorption:{ macro:"food", macroLabel:"🍽️ With Food", score:80, scoreLabel:"Good",
      tip:"Needs stomach acid — take with food. Sublingual (under-tongue) bypasses stomach for better uptake, especially for over 50s." },
    conflicts:[
      {name:"Metformin",sev:"medium",note:"⚠️ MEDICATION: Metformin is known to reduce B12 absorption over time. Monitor levels annually."}
    ],
    pairsWith:"Folate (B9)", pairsNote:"B12 and folate work hand-in-hand for DNA synthesis and red blood cell formation.",
    healthWarnings:["pernicious anemia","on metformin","vegan / vegetarian diet"]
  },
  {
    name:"Vitamin B6", aliases:["Pyridoxine","B6"],
    category:"Water-Soluble Vitamin", emoji:"🔋", color:"#2563eb",
    timing:"morning",
    timingNote:"Morning with food — avoid high chronic doses (>50 mg/day) due to neuropathy risk",
    absorption:{ macro:"food", macroLabel:"🍽️ With Food", score:82, scoreLabel:"Good",
      tip:"Take with food to minimise any nausea. Active P-5-P form requires no conversion." },
    conflicts:[],
    pairsWith:"Magnesium", pairsNote:"B6 (P-5-P) enhances magnesium uptake into cells — a well-known synergistic pair.",
    healthWarnings:["peripheral neuropathy risk with chronic high doses (>100 mg/day)"]
  },
  {
    name:"Magnesium", aliases:["Magnesium Glycinate","Magnesium Citrate","Magnesium L-Threonate","Magnesium Oxide"],
    category:"Mineral", emoji:"🧲", color:"#8b5cf6",
    timing:"evening",
    timingNote:"Evening or before bed — promotes relaxation, muscle recovery, and deeper sleep",
    absorption:{ macro:"food", macroLabel:"🍽️ With Food", score:78, scoreLabel:"Good",
      tip:"Glycinate = best absorbed + gentle on stomach. Citrate = good for constipation. Oxide = poorly absorbed. Avoid on completely empty stomach." },
    conflicts:[
      {name:"Calcium",sev:"low",note:"Compete for absorption at very high doses — ideally take at different meals"},
      {name:"Zinc",sev:"low",note:"High therapeutic zinc competes — space apart if using both at high doses"},
      {name:"Antibiotics",sev:"high",note:"⚠️ MEDICATION: Binds to certain antibiotics, reducing their effectiveness. Take 2 h apart."}
    ],
    pairsWith:"Vitamin B6", pairsNote:"B6 drives magnesium into cells — take together for maximum effect.",
    healthWarnings:["kidney disease","myasthenia gravis","heart block"]
  },
  {
    name:"Calcium", aliases:["Calcium Carbonate","Calcium Citrate","Calcium Gluconate"],
    category:"Mineral", emoji:"🦷", color:"#64748b",
    timing:"meals",
    timingNote:"Split into ≤500 mg doses with meals — body can only absorb ~500 mg at a time",
    absorption:{ macro:"food", macroLabel:"🍽️ With Food", score:72, scoreLabel:"Good",
      tip:"Carbonate needs stomach acid — take with food. Citrate can be taken anytime. Never take more than 500 mg per dose." },
    conflicts:[
      {name:"Iron",sev:"high",note:"⚠️ Calcium strongly blocks iron absorption — separate by at least 2 hours"},
      {name:"Magnesium",sev:"low",note:"Compete for absorption — take at different meals for best uptake of both"},
      {name:"Zinc",sev:"medium",note:"High calcium reduces zinc absorption — space 1–2 h apart"},
      {name:"Thyroid medication",sev:"high",note:"⚠️ MEDICATION: Blocks levothyroxine absorption — separate by at least 4 hours"}
    ],
    pairsWith:"Vitamin D3", pairsNote:"D3 is essential for calcium absorption from the gut — always pair together.",
    healthWarnings:["hypercalcemia","kidney stones","coronary artery disease (high doses)","sarcoidosis"]
  },
  {
    name:"Iron", aliases:["Ferrous Sulfate","Ferrous Gluconate","Ferrous Bisglycinate"],
    category:"Mineral", emoji:"🩸", color:"#dc2626",
    timing:"morning",
    timingNote:"Best absorbed on an empty stomach — if nausea occurs, take with a small, non-dairy meal",
    absorption:{ macro:"empty", macroLabel:"⬜ Empty Stomach", score:85, scoreLabel:"Excellent",
      tip:"Empty stomach gives best absorption. Avoid dairy, coffee, tea, and antacids within 1 h. Bisglycinate form is gentlest on the stomach." },
    conflicts:[
      {name:"Calcium",sev:"high",note:"⚠️ Calcium strongly blocks iron — at least 2 hours between them"},
      {name:"Vitamin E",sev:"medium",note:"Antagonise at high doses — take 2 h apart"},
      {name:"Zinc",sev:"medium",note:"Share the same absorption pathway — space them out"},
      {name:"Tea / Coffee",sev:"medium",note:"Tannins in tea/coffee reduce iron absorption up to 60% — avoid 1 h before and after"}
    ],
    pairsWith:"Vitamin C", pairsNote:"Vitamin C can increase iron absorption by up to 3×. Always take together.",
    healthWarnings:["hemochromatosis","thalassemia","liver disease","inflammatory bowel disease"]
  },
  {
    name:"Zinc", aliases:["Zinc Gluconate","Zinc Citrate","Zinc Picolinate","Zinc Bisglycinate"],
    category:"Mineral", emoji:"🛡️", color:"#0891b2",
    timing:"morning",
    timingNote:"With food — empty stomach causes nausea. Picolinate and bisglycinate are best-absorbed forms.",
    absorption:{ macro:"protein", macroLabel:"🥩 With Protein", score:88, scoreLabel:"Excellent",
      tip:"Animal protein enhances zinc absorption. Phytates in grains/legumes inhibit it — avoid high-fibre meals. Picolinate form has highest bioavailability." },
    conflicts:[
      {name:"Calcium",sev:"medium",note:"High calcium reduces zinc absorption — take 1–2 h apart"},
      {name:"Iron",sev:"medium",note:"Compete for the same intestinal transporter — separate them"},
      {name:"Copper",sev:"medium",note:"Long-term high-dose zinc (>40 mg/day) depletes copper — add 1–2 mg copper if supplementing long-term"},
      {name:"Magnesium",sev:"low",note:"High doses compete — space apart at therapeutic levels"}
    ],
    pairsWith:"Vitamin A", pairsNote:"Zinc is essential for mobilising Vitamin A from liver stores.",
    healthWarnings:["copper deficiency (with chronic high-dose use)"]
  },
  {
    name:"Omega-3 (Fish Oil)", aliases:["Fish Oil","Omega-3","DHA","EPA","Krill Oil","Algae Oil"],
    category:"Essential Fatty Acid", emoji:"🐟", color:"#0284c7",
    timing:"morning",
    timingNote:"With your largest meal — dramatically reduces fishy aftertaste and maximises absorption",
    absorption:{ macro:"fat", macroLabel:"🥑 With Fat", score:90, scoreLabel:"Excellent",
      tip:"Co-ingestion with dietary fat increases EPA/DHA bioavailability by ~50%. A light snack is not enough — take with a proper meal." },
    conflicts:[
      {name:"Warfarin",sev:"high",note:"⚠️ MEDICATION: High-dose fish oil thins blood — inform your doctor if on anticoagulants"},
      {name:"Aspirin",sev:"medium",note:"Both have anti-platelet effects at high doses — inform your doctor"}
    ],
    pairsWith:"Vitamin D3", pairsNote:"Both fat-soluble — combine them with a fatty meal for efficiency and cost savings.",
    healthWarnings:["blood clotting disorders","on blood thinners","fish/shellfish allergy"]
  },
  {
    name:"Creatine", aliases:["Creatine Monohydrate","Creatine HCL","Creatine Ethyl Ester"],
    category:"Performance", emoji:"💪", color:"#7c3aed",
    timing:"anytime",
    timingNote:"Timing is flexible — post-workout with carbs is slightly optimal but daily consistency matters most",
    absorption:{ macro:"carbs", macroLabel:"🍚 With Carbs", score:82, scoreLabel:"Good",
      tip:"Insulin spike from carbohydrates drives creatine into muscle cells more efficiently. Post-workout shake with carbs is ideal." },
    conflicts:[],
    pairsWith:"Carbohydrates", pairsNote:"Carbs trigger insulin, which shuttles creatine into muscles more effectively.",
    healthWarnings:["kidney disease","liver disease"]
  },
  {
    name:"Melatonin", aliases:["Melatonin"],
    category:"Sleep", emoji:"🌙", color:"#4c1d95",
    timing:"evening",
    timingNote:"30–60 min before your target bedtime. Start low (0.5 mg) — more is not better with melatonin.",
    absorption:{ macro:"empty", macroLabel:"⬜ Empty Stomach", score:88, scoreLabel:"Excellent",
      tip:"Fastest absorbed on an empty stomach. Food delays onset. Lower doses (0.5–1 mg) mimic natural production better than high doses." },
    conflicts:[
      {name:"Ashwagandha",sev:"medium",note:"Both promote relaxation — additive sedation. Use low doses of each, especially when starting."},
      {name:"Sedatives",sev:"high",note:"⚠️ MEDICATION: Do not combine with prescription sedatives or sleep aids without medical guidance"}
    ],
    pairsWith:"Ashwagandha", pairsNote:"Ashwagandha lowers cortisol while melatonin signals sleep onset — complementary evening stack.",
    healthWarnings:["autoimmune conditions","depression","seizure disorders","on sedative medication"]
  },
  {
    name:"Ashwagandha", aliases:["KSM-66","Withania somnifera","Sensoril","Shoden"],
    category:"Adaptogen", emoji:"🌱", color:"#65a30d",
    timing:"evening",
    timingNote:"Evening preferred for cortisol-lowering and wind-down effect. Some prefer splitting morning/evening.",
    absorption:{ macro:"fat", macroLabel:"🥑 With Fat", score:80, scoreLabel:"Good",
      tip:"Take with a meal containing fat or full-fat milk. Traditional Ayurvedic use combines with warm milk or ghee for best bioavailability." },
    conflicts:[
      {name:"Melatonin",sev:"medium",note:"Both promote relaxation and sleep — additive sedation, especially at higher doses"},
      {name:"Thyroid medication",sev:"medium",note:"May affect thyroid hormone levels — monitor TSH if on levothyroxine"}
    ],
    pairsWith:"Magnesium", pairsNote:"Magnesium + Ashwagandha is a popular evening stack for stress relief and sleep quality.",
    healthWarnings:["thyroid disorders","autoimmune disease","pregnancy","on sedatives or immunosuppressants"]
  },
  {
    name:"CoQ10", aliases:["Coenzyme Q10","Ubiquinol","Ubiquinone"],
    category:"Antioxidant", emoji:"⚡", color:"#dc2626",
    timing:"morning",
    timingNote:"With your largest meal of the day for best fat-soluble absorption",
    absorption:{ macro:"fat", macroLabel:"🥑 With Fat", score:85, scoreLabel:"Excellent",
      tip:"Highly fat-soluble. Ubiquinol is better absorbed than ubiquinone, especially for those over 40. Avoid taking on an empty stomach." },
    conflicts:[
      {name:"Warfarin",sev:"medium",note:"May reduce warfarin effectiveness — monitor INR with your doctor"},
      {name:"Statins",sev:"positive",note:"✅ Statins deplete CoQ10 — supplementing alongside statins is often clinically recommended"}
    ],
    pairsWith:"Omega-3 (Fish Oil)", pairsNote:"Both fat-soluble antioxidants — combine with a fatty meal for a convenient single dose.",
    healthWarnings:["on blood thinners","on chemotherapy (check with oncologist)"]
  },
  {
    name:"Probiotics", aliases:["Lactobacillus","Bifidobacterium","Live cultures","Acidophilus"],
    category:"Gut Health", emoji:"🦠", color:"#0d9488",
    timing:"morning",
    timingNote:"30 min before a meal on an empty stomach — stomach acid is at its lowest, improving bacterial survival",
    absorption:{ macro:"empty", macroLabel:"⬜ Before Meals", score:85, scoreLabel:"Excellent",
      tip:"Stomach acidity destroys bacteria. Lower acid before meals = better survival. Avoid with hot drinks. Refrigerated strains are more potent." },
    conflicts:[
      {name:"Antibiotics",sev:"high",note:"⚠️ Antibiotics kill probiotic bacteria. Take at least 2 h apart. Continue probiotics for 2 weeks after finishing antibiotics."}
    ],
    pairsWith:"Prebiotics (fibre)", pairsNote:"Prebiotics feed probiotic bacteria — psyllium, inulin, and resistant starch significantly boost colonisation.",
    healthWarnings:["severely immunocompromised","on immunosuppressants","recent bowel surgery"]
  },
  {
    name:"Biotin", aliases:["Vitamin B7","Vitamin H","d-Biotin"],
    category:"Water-Soluble Vitamin", emoji:"💅", color:"#db2777",
    timing:"morning",
    timingNote:"With breakfast — water-soluble so timing is flexible",
    absorption:{ macro:"food", macroLabel:"🍽️ With Food", score:82, scoreLabel:"Good",
      tip:"Take with food to improve tolerability. Avoid raw egg whites — avidin protein blocks biotin absorption completely." },
    conflicts:[
      {name:"Raw Egg Whites",sev:"medium",note:"Avidin in raw egg whites completely blocks biotin absorption — cook eggs before eating with biotin"}
    ],
    pairsWith:"Zinc", pairsNote:"Zinc and biotin together support hair, skin, and nail health synergistically.",
    healthWarnings:["⚠️ High-dose biotin interferes with thyroid and troponin lab tests — inform your doctor before bloodwork"]
  },
  {
    name:"Turmeric / Curcumin", aliases:["Curcumin","Turmeric","BCM-95","Longvida","Meriva"],
    category:"Anti-inflammatory", emoji:"🌟", color:"#d97706",
    timing:"meals",
    timingNote:"With your largest meal of the day — and always with black pepper (see tip)",
    absorption:{ macro:"fat", macroLabel:"🥑 Fat + Black Pepper", score:55, scoreLabel:"Poor (without enhancers)",
      tip:"Standard curcumin is poorly absorbed. Black pepper (piperine) increases absorption by ~2000%. Also fat-soluble. Phytosome forms (Meriva/BCM-95) don't need pepper." },
    conflicts:[
      {name:"Warfarin",sev:"high",note:"⚠️ MEDICATION: Curcumin has blood-thinning properties — caution with anticoagulants"},
      {name:"Iron",sev:"medium",note:"Curcumin chelates iron — take 2 h apart from iron supplement"}
    ],
    pairsWith:"Black Pepper (Piperine)", pairsNote:"Non-negotiable pairing — piperine boosts curcumin absorption by ~2000%.",
    healthWarnings:["gallstones","bile duct obstruction","on blood thinners","before surgery"]
  },
  {
    name:"Collagen", aliases:["Collagen Peptides","Hydrolyzed Collagen","Type I Collagen","Type II Collagen","Marine Collagen"],
    category:"Structural Protein", emoji:"✨", color:"#f472b6",
    timing:"morning",
    timingNote:"Morning is popular — or post-workout for joint and muscle recovery support",
    absorption:{ macro:"protein", macroLabel:"🥩 + Vitamin C", score:80, scoreLabel:"Good",
      tip:"Vitamin C is essential for the body to synthesise collagen from peptides — always pair together. Hot liquids do not destroy collagen peptides." },
    conflicts:[],
    pairsWith:"Vitamin C", pairsNote:"Vitamin C is essential for collagen cross-linking and synthesis — always take together.",
    healthWarnings:["kidney disease (high protein load)","allergy to fish, shellfish, or eggs depending on collagen source"]
  },
  {
    name:"NAC (N-Acetyl Cysteine)", aliases:["N-Acetyl Cysteine","NAC","Acetylcysteine"],
    category:"Antioxidant", emoji:"🧬", color:"#0f766e",
    timing:"morning",
    timingNote:"Empty stomach for glutathione support — with light food if nauseated",
    absorption:{ macro:"empty", macroLabel:"⬜ Empty Stomach", score:78, scoreLabel:"Good",
      tip:"Empty stomach preferred for glutathione precursor activity. If nausea occurs, take with a low-protein light meal — high protein may compete." },
    conflicts:[
      {name:"Activated Charcoal",sev:"high",note:"⚠️ Charcoal adsorbs NAC — do not combine"},
      {name:"Nitroglycerin",sev:"high",note:"⚠️ MEDICATION: Potentiates nitroglycerin — risk of severe hypotension. Consult doctor."}
    ],
    pairsWith:"Vitamin C", pairsNote:"Both glutathione-supporting antioxidants — synergistic combination for immune and liver health.",
    healthWarnings:["asthma (may cause bronchospasm at high doses)","on nitroglycerin medication"]
  },
  {
    name:"Berberine", aliases:["Berberine HCL","Berberine Sulfate"],
    category:"Metabolic Support", emoji:"🌿", color:"#d97706",
    timing:"meals",
    timingNote:"15–30 min BEFORE each main meal (up to 3×/day) — helps regulate blood glucose from that meal",
    absorption:{ macro:"food", macroLabel:"🍽️ Before Meals", score:75, scoreLabel:"Good",
      tip:"Take just before eating for best blood sugar modulation. Divide into 3 × 500 mg doses across the day — high single doses cause GI upset." },
    conflicts:[
      {name:"Metformin",sev:"high",note:"⚠️ MEDICATION: Berberine mimics metformin — additive hypoglycaemia risk. Consult your doctor."},
      {name:"Cyclosporine",sev:"high",note:"⚠️ MEDICATION: Inhibits CYP3A4 enzyme — may significantly raise cyclosporine blood levels. Dangerous."}
    ],
    pairsWith:"Probiotics", pairsNote:"Berberine alters gut bacteria — probiotics help maintain a healthy microbiome balance.",
    healthWarnings:["diabetes on medication","on immunosuppressants","pregnancy","liver disease"]
  },

  // ── GYM / FITNESS SUPPLEMENTS ──────────────────────
  {
    name:"Whey Protein", aliases:["Whey Isolate","Whey Concentrate","WPI","WPC","Whey Hydrolysate"],
    category:"Gym — Protein", emoji:"🥛", color:"#3b82f6",
    timing:"morning",
    timingNote:"Post-workout is the classic window (within 30–60 min). Also great as a morning or between-meal protein hit.",
    absorption:{ macro:"water", macroLabel:"💧 With Water / Milk", score:92, scoreLabel:"Excellent",
      tip:"Fast-digesting — ideal post-workout. Isolate is best for lactose-sensitive people. Hydrolysate is fastest but expensive. Mix with water for speed, milk for extra calories." },
    conflicts:[
      {name:"Casein Protein",sev:"low",note:"No harm combining, but they serve opposite purposes — whey post-workout, casein pre-bed"},
      {name:"Iron",sev:"low",note:"Calcium in dairy whey slightly inhibits iron — take iron supplements separately"}
    ],
    pairsWith:"Creatine", pairsNote:"Post-workout whey + creatine is the most evidence-backed muscle-building combo.",
    healthWarnings:["lactose intolerance (use isolate or plant protein)","dairy allergy","kidney disease (high protein load)"]
  },
  {
    name:"Casein Protein", aliases:["Micellar Casein","Casein","Slow-release protein"],
    category:"Gym — Protein", emoji:"🌙", color:"#6366f1",
    timing:"evening",
    timingNote:"Before bed is optimal — slow digestion feeds muscles through the night (6–8 h release)",
    absorption:{ macro:"water", macroLabel:"💧 With Water / Milk", score:85, scoreLabel:"Excellent",
      tip:"Digests over 5–7 hours vs whey's 1–2 hours. The overnight 'anti-catabolic' staple. Thick consistency — mix well or blend." },
    conflicts:[
      {name:"Iron",sev:"low",note:"Calcium in casein slightly inhibits iron absorption — keep iron intake separate"}
    ],
    pairsWith:"Magnesium", pairsNote:"Both taken before bed — casein for muscle protein synthesis, magnesium for recovery and sleep quality.",
    healthWarnings:["lactose intolerance","dairy allergy","kidney disease"]
  },
  {
    name:"BCAAs", aliases:["Branched-Chain Amino Acids","Leucine","Isoleucine","Valine","BCAA"],
    category:"Gym — Amino Acids", emoji:"🔬", color:"#ec4899",
    timing:"anytime",
    timingNote:"During fasted training, intra-workout, or between meals. Less useful if you already eat adequate protein.",
    absorption:{ macro:"water", macroLabel:"💧 With Water", score:88, scoreLabel:"Excellent",
      tip:"Rapidly absorbed without digestion. Most useful for fasted training or low-protein diets. Leucine 2:1:1 ratio is standard." },
    conflicts:[],
    pairsWith:"EAAs / Whey Protein", pairsNote:"BCAAs alone miss the other 6 essential amino acids — EAAs or whey are more complete for muscle synthesis.",
    healthWarnings:["ALS (amyotrophic lateral sclerosis) — BCAAs may worsen progression","maple syrup urine disease","on Parkinson's levodopa medication"]
  },
  {
    name:"Pre-Workout (Caffeine)", aliases:["Pre-workout","C4","Pre-workout supplement","Caffeine Anhydrous","NOXPLODE"],
    category:"Gym — Stimulant", emoji:"⚡", color:"#ef4444",
    timing:"morning",
    timingNote:"30–45 min before training. Avoid within 6 h of sleep — caffeine half-life is ~5–6 hours. Cycle off regularly to preserve sensitivity.",
    absorption:{ macro:"empty", macroLabel:"⬜ Empty / Light Stomach", score:88, scoreLabel:"Excellent",
      tip:"Absorbed fastest on an empty stomach. Food slows onset but reduces GI upset. Start with half a dose to assess tolerance. Contains multiple stimulants — check label." },
    conflicts:[
      {name:"Taurine",sev:"positive",note:"✅ Taurine counteracts some caffeine jitteriness — many pre-workouts include both intentionally"},
      {name:"Melatonin",sev:"high",note:"⚠️ Caffeine will directly cancel melatonin effects — never combine, and allow enough clearance time before bed"},
      {name:"Ashwagandha",sev:"medium",note:"Caffeine is stimulatory, ashwagandha is adaptogenic — counteracting effects, but not dangerous"},
      {name:"Heart medication",sev:"high",note:"⚠️ MEDICATION: Stimulants can interact with beta-blockers, blood pressure meds, and antidepressants — consult doctor"}
    ],
    pairsWith:"L-Citrulline", pairsNote:"Caffeine + citrulline gives both the CNS drive and the pump/blood flow for a complete pre-workout effect.",
    healthWarnings:["heart arrhythmia","hypertension","anxiety disorders","on MAOI antidepressants","pregnancy","caffeine sensitivity"]
  },
  {
    name:"Beta-Alanine", aliases:["CarnoSyn","Beta Alanine"],
    category:"Gym — Performance", emoji:"🌊", color:"#8b5cf6",
    timing:"morning",
    timingNote:"Pre-workout or with a meal. Timing matters less than daily consistency — it builds up carnosine in muscle over weeks.",
    absorption:{ macro:"food", macroLabel:"🍽️ With Food", score:82, scoreLabel:"Good",
      tip:"Tingling/flushing (paresthesia) is normal and harmless — reduce with split doses or sustained-release form. Benefits appear after 2–4 weeks of daily loading." },
    conflicts:[
      {name:"Taurine",sev:"medium",note:"High-dose beta-alanine competes with taurine for the same transporter — take at different times if using therapeutic taurine"}
    ],
    pairsWith:"Creatine", pairsNote:"Creatine (power) + Beta-Alanine (endurance buffer) = the most evidence-backed performance stack.",
    healthWarnings:["known sensitivity to paresthesia","kidney disease (high doses)"]
  },
  {
    name:"L-Citrulline", aliases:["Citrulline Malate","L-Citrulline","Citrulline"],
    category:"Gym — Pump / Nitric Oxide", emoji:"💉", color:"#dc2626",
    timing:"morning",
    timingNote:"30–60 min before training on an empty stomach for best nitric oxide response. 6–8 g of citrulline malate is standard.",
    absorption:{ macro:"empty", macroLabel:"⬜ Empty Stomach", score:85, scoreLabel:"Excellent",
      tip:"Converts to arginine in the kidneys for nitric oxide production. More effective than arginine itself. 2:1 malate form also reduces muscle fatigue." },
    conflicts:[
      {name:"ED medication (Viagra/Cialis)",sev:"high",note:"⚠️ DANGEROUS: Both citrulline and PDE5 inhibitors dilate blood vessels — severe blood pressure drop risk. Do NOT combine."}
    ],
    pairsWith:"Pre-Workout (Caffeine)", pairsNote:"Caffeine for CNS drive + citrulline for blood flow = complete pre-workout effect.",
    healthWarnings:["on erectile dysfunction medication (PDE5 inhibitors)","on blood pressure medication","low blood pressure"]
  },
  {
    name:"L-Glutamine", aliases:["Glutamine","L-Glutamine Powder"],
    category:"Gym — Recovery", emoji:"🛠️", color:"#0891b2",
    timing:"anytime",
    timingNote:"Post-workout or before bed. Also useful first thing in the morning for gut health support.",
    absorption:{ macro:"water", macroLabel:"💧 With Water", score:80, scoreLabel:"Good",
      tip:"Water-soluble and rapidly absorbed. Most useful for gut health and recovery during high-frequency training. Benefit for performance is modest if protein intake is adequate." },
    conflicts:[
      {name:"Lactulose",sev:"medium",note:"Glutamine metabolism affects ammonia levels — caution with lactulose (used for liver disease)"}
    ],
    pairsWith:"BCAAs", pairsNote:"BCAAs + glutamine is a classic intra-workout / post-workout recovery combination.",
    healthWarnings:["liver cirrhosis","seizure disorders","kidney disease","on anti-epileptic drugs"]
  },
  {
    name:"L-Carnitine", aliases:["L-Carnitine Tartrate","Acetyl-L-Carnitine","ALCAR","Carnitine"],
    category:"Gym — Fat Metabolism", emoji:"🔥", color:"#f97316",
    timing:"morning",
    timingNote:"Pre-workout with carbs — insulin drives carnitine into muscle tissue. Acetyl-L-Carnitine (ALCAR) works pre-workout or in the morning for cognitive + fat burning.",
    absorption:{ macro:"carbs", macroLabel:"🍚 With Carbs", score:76, scoreLabel:"Good",
      tip:"Insulin significantly enhances muscle carnitine uptake — take with 30–40 g of carbs. Takes weeks of consistent dosing to accumulate in muscle." },
    conflicts:[
      {name:"Thyroid medication",sev:"medium",note:"Carnitine may reduce thyroid hormone activity — monitor with your doctor if on levothyroxine"},
      {name:"Warfarin",sev:"medium",note:"May enhance anticoagulant effect of Warfarin — monitor INR"}
    ],
    pairsWith:"Caffeine", pairsNote:"Caffeine + carnitine is a popular fat-burning pre-workout stack — caffeine increases fat mobilisation, carnitine shuttles fat into cells.",
    healthWarnings:["hypothyroidism","on blood thinners","trimethylaminuria (fish odour syndrome)"]
  },
  {
    name:"HMB", aliases:["Beta-Hydroxy Beta-Methylbutyrate","HMB Free Acid","HMB-FA","BetaTOR"],
    category:"Gym — Muscle Retention", emoji:"🧱", color:"#16a34a",
    timing:"morning",
    timingNote:"Split 3× daily with meals. Free acid form is faster — take 30 min pre-workout for anti-catabolic benefits during training.",
    absorption:{ macro:"food", macroLabel:"🍽️ With Food", score:78, scoreLabel:"Good",
      tip:"HMB-Free Acid absorbs faster than calcium-HMB. Most benefit seen in untrained individuals or during caloric deficits / injury recovery. Takes 2+ weeks to show effect." },
    conflicts:[],
    pairsWith:"Creatine", pairsNote:"HMB + Creatine stack shows additive anti-catabolic and strength benefits in several studies.",
    healthWarnings:["no major concerns at recommended doses"]
  },
  {
    name:"Taurine", aliases:["Taurine","L-Taurine"],
    category:"Gym — Amino Acids", emoji:"💧", color:"#0ea5e9",
    timing:"anytime",
    timingNote:"Pre-workout (reduces caffeine jitteriness), or post-workout for recovery. Also well-tolerated at night.",
    absorption:{ macro:"water", macroLabel:"💧 With Water", score:88, scoreLabel:"Excellent",
      tip:"Rapidly absorbed, works fast. 1–3 g pre-workout is typical. Found in most energy drinks — don't double up if using those." },
    conflicts:[
      {name:"Beta-Alanine",sev:"medium",note:"Compete for the same intestinal transporter — take at different times if using both at high doses"},
      {name:"Lithium",sev:"high",note:"⚠️ MEDICATION: Taurine affects electrolyte balance — may alter lithium clearance. Consult doctor."}
    ],
    pairsWith:"Pre-Workout (Caffeine)", pairsNote:"Taurine blunts caffeine-induced anxiety and heart rate spikes — naturally synergistic.",
    healthWarnings:["on lithium medication","bipolar disorder (on medication)"]
  },
  {
    name:"Electrolytes", aliases:["Sports Electrolytes","Sodium","Potassium","LMNT","Liquid IV","Hydration mix"],
    category:"Gym — Hydration", emoji:"⚗️", color:"#06b6d4",
    timing:"anytime",
    timingNote:"During or after training, especially sessions >60 min or in heat. Also useful first thing in the morning.",
    absorption:{ macro:"water", macroLabel:"💧 With Water", score:92, scoreLabel:"Excellent",
      tip:"Dissolved in water for near-instant absorption. Sodium is the key driver — without adequate sodium, other electrolytes don't absorb as efficiently." },
    conflicts:[
      {name:"Blood pressure medication",sev:"medium",note:"High-sodium electrolytes may counteract blood pressure medication — choose low-sodium formulas if needed"}
    ],
    pairsWith:"Creatine", pairsNote:"Creatine pulls water into cells — staying well-hydrated with electrolytes reduces cramping and improves creatine effectiveness.",
    healthWarnings:["hypertension (watch sodium content)","kidney disease","on diuretics","heart failure"]
  },
  {
    name:"Tongkat Ali", aliases:["Eurycoma Longifolia","Longjack","Malaysian Ginseng","TA"],
    category:"Gym — Testosterone Support", emoji:"🌿", color:"#15803d",
    timing:"morning",
    timingNote:"Morning with food is standard. Cycle 5 days on / 2 days off, or 4 weeks on / 1 week off to prevent downregulation.",
    absorption:{ macro:"food", macroLabel:"🍽️ With Food", score:78, scoreLabel:"Good",
      tip:"Standardised extract (100:1 or 200:1 ratio) is required — raw powder is underdosed. Take with food to reduce GI upset. Evidence strongest in men with low testosterone." },
    conflicts:[
      {name:"Fadogia Agrestis",sev:"positive",note:"✅ SYNERGY: Tongkat Ali (testosterone signalling) + Fadogia (LH stimulation) is a popular test-support stack — but monitor hormone levels"},
      {name:"Hormone therapy",sev:"high",note:"⚠️ MEDICATION: May interfere with HRT, TRT, or contraceptives — consult doctor"},
      {name:"Immunosuppressants",sev:"medium",note:"May stimulate immune activity — potential interaction with immunosuppressant drugs"}
    ],
    pairsWith:"Fadogia Agrestis", pairsNote:"A popular synergistic stack — Tongkat Ali modulates testosterone signalling while Fadogia stimulates LH. Get bloodwork done.",
    healthWarnings:["prostate cancer or risk","hormone-sensitive conditions","on HRT or TRT","liver disease (high doses)"]
  },
  {
    name:"Fadogia Agrestis", aliases:["Fadogia","Fadogia Agrestis Extract"],
    category:"Gym — Testosterone Support", emoji:"🔩", color:"#854d0e",
    timing:"morning",
    timingNote:"Morning with food. Cycle strictly — 8 weeks on / 2–4 weeks off. Get testosterone and LH bloodwork every 8–12 weeks.",
    absorption:{ macro:"food", macroLabel:"🍽️ With Food", score:72, scoreLabel:"Good",
      tip:"Limited human research — most data from rodent studies. Use lowest effective dose. Safety profile not fully established for long-term use. Bloodwork before and during is strongly advised." },
    conflicts:[
      {name:"Tongkat Ali",sev:"positive",note:"✅ SYNERGY: Together they target different parts of the testosterone pathway — commonly stacked"},
      {name:"Hormone therapy",sev:"high",note:"⚠️ MEDICATION: Interacts with any hormone-based medication. Consult doctor."}
    ],
    pairsWith:"Tongkat Ali", pairsNote:"Frequently stacked — but monitor hormone levels with bloodwork, especially testosterone, LH, and FSH.",
    healthWarnings:["⚠️ Limited long-term safety data","prostate issues","hormone-sensitive conditions","on TRT or HRT","kidney toxicity concerns at high doses — stay within label dose"]
  },
  {
    name:"Turkesterone", aliases:["Turkesterone","Ajuga Turkestanica","Ecdysterone","Beta-Ecdysterone"],
    category:"Gym — Ecdysteroid", emoji:"🦂", color:"#7c3aed",
    timing:"meals",
    timingNote:"Split into 2 doses with meals. Cycloheptyl cyclisation (hydroxypropyl-β-cyclodextrin) complex has far better absorption than raw extract.",
    absorption:{ macro:"fat", macroLabel:"🥑 With Food + Fat", score:70, scoreLabel:"Good",
      tip:"Standard turkesterone has poor bioavailability — look for complexed forms (cyclodextrin). Take with a fat-containing meal. Results build over 8–12 weeks." },
    conflicts:[],
    pairsWith:"Whey Protein", pairsNote:"Ecdysteroids are hypothesised to boost protein synthesis — pairing with adequate protein intake is essential.",
    healthWarnings:["limited long-term safety data in humans","hormone-sensitive conditions (theoretical risk)"]
  },
  {
    name:"Alpha-GPC", aliases:["Alpha-Glyceryl Phosphoryl Choline","A-GPC","Choline Alfoscerate"],
    category:"Gym — Nootropic / Power", emoji:"🧠", color:"#0369a1",
    timing:"morning",
    timingNote:"30–60 min pre-workout. Also effective as a morning cognitive booster on non-training days.",
    absorption:{ macro:"food", macroLabel:"🍽️ With Food", score:82, scoreLabel:"Good",
      tip:"One of the most bioavailable choline sources — crosses the blood-brain barrier. Raises acetylcholine levels for focus and power output. 300–600 mg is the standard dose." },
    conflicts:[
      {name:"Anticholinergic drugs",sev:"high",note:"⚠️ MEDICATION: Directly opposes anticholinergic medications (some antihistamines, bladder meds, antidepressants). Consult doctor."}
    ],
    pairsWith:"Pre-Workout (Caffeine)", pairsNote:"Caffeine + Alpha-GPC is a popular nootropic pre-workout stack for focus, power, and mind-muscle connection.",
    healthWarnings:["on anticholinergic medications","bipolar disorder","epilepsy"]
  },
  {
    name:"Citrulline Malate", aliases:["Citrulline Malate 2:1","CM"],
    category:"Gym — Pump / Nitric Oxide", emoji:"🩺", color:"#be123c",
    timing:"morning",
    timingNote:"30–60 min pre-workout. 6–8 g of 2:1 citrulline malate (= ~4 g citrulline + malate) is a clinical dose.",
    absorption:{ macro:"empty", macroLabel:"⬜ Empty Stomach", score:86, scoreLabel:"Excellent",
      tip:"The malate component independently reduces muscle fatigue via the Krebs cycle. 2:1 ratio is the research-backed form. More effective than L-Arginine for NO production." },
    conflicts:[
      {name:"ED medication (Viagra/Cialis)",sev:"high",note:"⚠️ DANGEROUS: Combined vasodilation can cause severe hypotension. Do NOT combine."}
    ],
    pairsWith:"Beta-Alanine", pairsNote:"Citrulline (endurance + pump) + Beta-Alanine (lactate buffer) = popular endurance pre-workout stack.",
    healthWarnings:["on PDE5 inhibitor medication","low blood pressure"]
  }
];
