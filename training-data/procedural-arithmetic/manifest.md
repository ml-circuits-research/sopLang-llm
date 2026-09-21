# Manifest

The manifest is split by family so a long table stays reviewable. Each family manifest holds one row per accepted example, and the index records the counts and the content hash of every family file. `distinct plans` counts the plan fingerprints of the family: the compiled circuits differ between variants of one template because they embed their instance values, so the plan fingerprint is the latent-plan measure.

| family | examples | train | eval | knowledge | no-knowledge | distinct plans | file | hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| cheaper-rate-per-unit | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-cheaper-rate-per-unit.md | 2870902acdc4 |
| crate-count-with-partial-last | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-crate-count-with-partial-last.md | 2fee913ed7b6 |
| depletion-days-and-lead-time | 40 | 0 | 40 | 0 | 40 | 1 | manifest/family-depletion-days-and-lead-time.md | fe3697f43e1c |
| net-balance-with-withdrawals | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-net-balance-with-withdrawals.md | 752d6157742d |
| parallel-join-deadline | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-parallel-join-deadline.md | 0fb163f26b45 |
| two-tier-price | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-two-tier-price.md | 4ff989459533 |
| whole-units-under-a-budget | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-whole-units-under-a-budget.md | 171d0430c1d9 |

Total accepted examples: 280.
