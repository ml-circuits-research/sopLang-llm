# Manifest

The manifest is split by family so a long table stays reviewable. Each family manifest holds one row per accepted example, and the index records the counts and the content hash of every family file. `distinct plans` counts the plan fingerprints of the family: the compiled circuits differ between variants of one template because they embed their instance values, so the plan fingerprint is the latent-plan measure.

| family | examples | train | eval | knowledge | no-knowledge | distinct plans | file | hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| cheaper-rate-per-unit | 40 | 0 | 40 | 0 | 40 | 1 | manifest/family-cheaper-rate-per-unit.md | f5c7795d3162 |
| net-balance-with-withdrawals | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-net-balance-with-withdrawals.md | 752d6157742d |
| whole-units-under-a-budget | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-whole-units-under-a-budget.md | 171d0430c1d9 |

Total accepted examples: 120.
