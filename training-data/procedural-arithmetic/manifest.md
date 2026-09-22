# Manifest

The manifest is split by family so a long table stays reviewable. Each family manifest holds one row per accepted example, and the index records the counts and the content hash of every family file. `distinct plans` counts the plan fingerprints of the family: the compiled circuits differ between variants of one template because they embed their instance values, so the plan fingerprint is the latent-plan measure.

| family | examples | train | eval | knowledge | no-knowledge | distinct plans | file | hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| above-count | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-count.md | d1c1e0a9b0d6 |
| above-count-double | 40 | 0 | 40 | 0 | 40 | 1 | manifest/family-above-count-double.md | bb69cc981ec7 |
| above-count-per-unit-add-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-count-per-unit-add-rate.md | 144a77d47cda |
| above-largest-add-rate | 40 | 0 | 40 | 0 | 40 | 1 | manifest/family-above-largest-add-rate.md | 0da7ff6f69db |
| above-largest-double | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-largest-double.md | 4e0eeb4e5fa0 |
| above-largest-per-unit-subtract-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-largest-per-unit-subtract-rate.md | 049b7d57fb3a |
| above-smallest-double | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-smallest-double.md | de08832a64ce |
| above-smallest-per-unit-add-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-smallest-per-unit-add-rate.md | 652be9143b55 |
| above-total | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-total.md | 48b4de6fef46 |
| above-total-add-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-total-add-rate.md | 8fb2cbeb558f |
| above-total-double-per-unit-add-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-total-double-per-unit-add-rate.md | fc83a5022a60 |
| above-total-per-unit-add-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-total-per-unit-add-rate.md | e6c35423efb8 |
| above-total-subtract-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-total-subtract-rate.md | 5f408904e323 |
| average-of-qualifying | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-average-of-qualifying.md | f337a004b9f6 |
| below-count | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-below-count.md | a32463e747db |
| below-count-per-unit-add-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-below-count-per-unit-add-rate.md | 72389aa312b2 |
| below-largest-add-rate | 40 | 0 | 40 | 0 | 40 | 1 | manifest/family-below-largest-add-rate.md | 84504c7d8acd |
| below-largest-double | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-below-largest-double.md | fd6e7125587f |
| below-largest-per-unit-double-add-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-below-largest-per-unit-double-add-rate.md | de9a61fae45e |
| below-total | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-below-total.md | c5e1d851eacc |
| below-total-add-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-below-total-add-rate.md | b71908fa7af1 |
| below-total-double-subtract-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-below-total-double-subtract-rate.md | 546fbc491b1c |
| below-total-per-unit-subtract-rate | 40 | 0 | 40 | 0 | 40 | 1 | manifest/family-below-total-per-unit-subtract-rate.md | e4522e9f71f2 |
| cheaper-rate-per-unit | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-cheaper-rate-per-unit.md | badeaa201fa1 |
| conversion-chain-leftover | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-conversion-chain-leftover.md | b2b6a413bac5 |
| count-letter-in-word | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-count-letter-in-word.md | 7b83c37f4885 |
| count-self-referential-letter | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-count-self-referential-letter.md | 01196b4982ab |
| crate-count-with-partial-last | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-crate-count-with-partial-last.md | d8e7f3dbac84 |
| depletion-days-and-lead-time | 40 | 0 | 40 | 0 | 40 | 1 | manifest/family-depletion-days-and-lead-time.md | bb29f212e8fa |
| distinct-letters-in-word | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-distinct-letters-in-word.md | 5bc2235fc744 |
| elapsed-minutes | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-elapsed-minutes.md | be701df4ba04 |
| filtered-records-above-a-threshold | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-filtered-records-above-a-threshold.md | 961e8d70c1ca |
| filtered-records-at-least-a-threshold | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-filtered-records-at-least-a-threshold.md | 99fd75ed2640 |
| filtered-total | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-filtered-total.md | 1dbf96d3303a |
| first-and-last-letter | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-first-and-last-letter.md | 399c4d2ee082 |
| grouped-label-totals | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-grouped-label-totals.md | 74ea016c581c |
| higher-best-of-two | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-higher-best-of-two.md | c289f983b272 |
| length-of-word | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-length-of-word.md | 98fee689ee38 |
| length-ranked-words | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-length-ranked-words.md | 57d5737f86e2 |
| longer-of-two-words | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-longer-of-two-words.md | 86c8765f0987 |
| net-balance-with-withdrawals | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-net-balance-with-withdrawals.md | 9b8d4156d770 |
| parallel-join-deadline | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-parallel-join-deadline.md | 6319e4ae2164 |
| percent-of-total | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-percent-of-total.md | b35f5bcadbdb |
| raised-largest-record | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-raised-largest-record.md | 3c05af59305f |
| raised-smallest-record | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-raised-smallest-record.md | 1ae05fec0713 |
| reverse-word | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-reverse-word.md | 921d920d17f4 |
| scaled-recipe | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-scaled-recipe.md | 130bc9ac2211 |
| top-k-among-list | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-top-k-among-list.md | 39e2f88541e2 |
| total-plus-a-fixed-amount | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-total-plus-a-fixed-amount.md | 316b6ec069cc |
| total-plus-a-percentage | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-total-plus-a-percentage.md | 918320f2c72a |
| two-tier-price | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-two-tier-price.md | 1c0782e3f149 |
| vowel-richest-word | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-vowel-richest-word.md | a0900eabe476 |
| whole-units-under-a-budget | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-whole-units-under-a-budget.md | 9d9edcc9746e |
| words-containing-letter | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-words-containing-letter.md | e66c5ab1bb7c |

Total accepted examples: 2160.
