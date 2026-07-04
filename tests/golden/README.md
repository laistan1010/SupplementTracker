# Golden scan-accuracy test 黃金測試集

Measure real-world scan accuracy with YOUR OWN bottles. Re-run after any scan change
to catch regressions. 用你自己嘅樽измерить真實準確度，改完 code 再跑一次就知有冇整爛嘢。

## How to run 點跑

1. Copy bottle photos into `tests/golden/photos/`
   （將樽嘅相 copy 入 `tests/golden/photos/`，影**正面**，同喺 app 影嗰種一樣）
2. Name each file to match a key in `expected.json` (e.g. `biotin.jpg`)
   （檔名要對返 `expected.json` 入面嘅 key）
3. Run 跑:

   ```
   node tests/golden/run.mjs
   ```

## Adding a new bottle 加新樽

Add an entry to `expected.json` — the truth as printed on the bottle:

```json
"my-new-bottle.jpg": {
  "product": "keyword that must appear in the product name",
  "ingredients": [{ "name": "Ingredient", "dose": 500, "unit": "mg" }]
}
```

`"dose": null` = don't check the dose （唔核對劑量）.

## Scoring 計分

Per bottle, 1 point each 每支樽三樣嘢各 1 分:
- **name-read** — vision read the product name 讀啱產品名
- **clean-ingredients** — every expected ingredient found, correct dose, no extra
  hallucinated rows 成分齊、劑量啱、冇多出嚟嘅幻覺行
- **DSLD-findable** — the right product appears in the NIH top-3 picker
  （NIH 資料庫頭 3 個候選入面有你支產品）

Notes: each run makes a few paid Grok vision calls (cents). Photos stay local —
they are gitignored. 每次跑會用幾個 Grok vision call（好平）。相唔會 commit 上 GitHub。
