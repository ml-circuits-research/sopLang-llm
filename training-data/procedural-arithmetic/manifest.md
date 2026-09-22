# Manifest

The manifest is split by family so a long table stays reviewable. Each family manifest holds one row per accepted example, and the index records the counts and the content hash of every family file. `distinct plans` counts the plan fingerprints of the family: the compiled circuits differ between variants of one template because they embed their instance values, so the plan fingerprint is the latent-plan measure.

| family | examples | train | eval | knowledge | no-knowledge | distinct plans | file | hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| above-count | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-count.md | d39213b1f6c4 |
| above-count-double | 40 | 0 | 40 | 0 | 40 | 1 | manifest/family-above-count-double.md | 034dcc418ca7 |
| above-count-per-unit-add-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-count-per-unit-add-rate.md | 2d2d378a96de |
| above-largest-add-rate | 40 | 0 | 40 | 0 | 40 | 1 | manifest/family-above-largest-add-rate.md | cef7b93b81e8 |
| above-largest-double | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-largest-double.md | f9770ee614d8 |
| above-largest-per-unit-subtract-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-largest-per-unit-subtract-rate.md | d20f55a88706 |
| above-largest-square-area | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-largest-square-area.md | 240eb41ec33e |
| above-second-largest | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-second-largest.md | 5fff65e8ead4 |
| above-smallest-double | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-smallest-double.md | ba96be47546f |
| above-smallest-per-unit-add-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-smallest-per-unit-add-rate.md | 58fa13305366 |
| above-third-largest-percent | 40 | 0 | 40 | 0 | 40 | 1 | manifest/family-above-third-largest-percent.md | f1ee27771b00 |
| above-total | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-total.md | 01187d67b020 |
| above-total-add-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-total-add-rate.md | 6bd661d5720a |
| above-total-discount | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-total-discount.md | 837fa995af90 |
| above-total-double-per-unit-add-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-total-double-per-unit-add-rate.md | 7e87a10c47dd |
| above-total-modulo | 40 | 0 | 40 | 0 | 40 | 1 | manifest/family-above-total-modulo.md | e42697fa2a02 |
| above-total-modulo-add-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-total-modulo-add-rate.md | 9f720770fcf9 |
| above-total-per-unit-add-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-total-per-unit-add-rate.md | b59574a5b90f |
| above-total-percent | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-total-percent.md | 19e989a9c2c3 |
| above-total-percent-discount | 40 | 0 | 40 | 0 | 40 | 1 | manifest/family-above-total-percent-discount.md | 642982376a23 |
| above-total-ratio | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-total-ratio.md | 3e46857ac13c |
| above-total-subtract-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-total-subtract-rate.md | 2a27b4b68bd5 |
| above-unique-count | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-unique-count.md | 0c0eec7e0301 |
| above-unique-count-percent | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-unique-count-percent.md | 04bab4c4ab70 |
| average-of-qualifying | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-average-of-qualifying.md | 74767ddcbcff |
| below-count | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-below-count.md | 8db0fef18278 |
| below-count-per-unit-add-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-below-count-per-unit-add-rate.md | a391d7adcc28 |
| below-largest-add-rate | 40 | 0 | 40 | 0 | 40 | 1 | manifest/family-below-largest-add-rate.md | d2839ef2ec7f |
| below-largest-double | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-below-largest-double.md | 2b9d2e67e1d3 |
| below-largest-per-unit-double-add-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-below-largest-per-unit-double-add-rate.md | 3cb83dc35fa7 |
| below-total | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-below-total.md | 8ffc358c2a59 |
| below-total-add-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-below-total-add-rate.md | 6fc8b1bd96bc |
| below-total-double-subtract-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-below-total-double-subtract-rate.md | c3856d3a9a0a |
| below-total-per-unit-subtract-rate | 40 | 0 | 40 | 0 | 40 | 1 | manifest/family-below-total-per-unit-subtract-rate.md | e4c6041530d8 |
| cheaper-rate-per-unit | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-cheaper-rate-per-unit.md | 1a9ff31c1f2e |
| conversion-chain-leftover | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-conversion-chain-leftover.md | 65350575b8d8 |
| count-letter-in-word | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-count-letter-in-word.md | d7556dc443eb |
| count-self-referential-letter | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-count-self-referential-letter.md | b0cb9c41c9b0 |
| crate-count-with-partial-last | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-crate-count-with-partial-last.md | 09cb9c8a065d |
| depletion-days-and-lead-time | 40 | 0 | 40 | 0 | 40 | 1 | manifest/family-depletion-days-and-lead-time.md | f27d19477aa9 |
| distinct-letters-in-word | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-distinct-letters-in-word.md | 461e08cdefd2 |
| elapsed-minutes | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-elapsed-minutes.md | aac5304fc5a1 |
| filtered-records-above-a-threshold | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-filtered-records-above-a-threshold.md | 1115551f542e |
| filtered-records-at-least-a-threshold | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-filtered-records-at-least-a-threshold.md | 3ce38fc7e3f0 |
| filtered-total | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-filtered-total.md | b0d5f2698631 |
| first-and-last-letter | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-first-and-last-letter.md | 119a9135316f |
| grouped-label-totals | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-grouped-label-totals.md | 7f0f2aa8206e |
| higher-best-of-two | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-higher-best-of-two.md | 2fa9a9abd4fe |
| keep-below-total-ratio | 40 | 0 | 40 | 0 | 40 | 1 | manifest/family-keep-below-total-ratio.md | 41ccf2244793 |
| keep-divisible-count | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-keep-divisible-count.md | b3b27f8feea9 |
| keep-divisible-total | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-keep-divisible-total.md | a7e197f3a6f4 |
| keep-divisible-total-percent | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-keep-divisible-total-percent.md | c93c1e51ac54 |
| length-of-word | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-length-of-word.md | 3d38c9a81e4f |
| length-ranked-words | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-length-ranked-words.md | 4bb4b94b3c5d |
| longer-of-two-words | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-longer-of-two-words.md | 67f57a15a9c2 |
| net-balance-with-withdrawals | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-net-balance-with-withdrawals.md | f8156f946281 |
| parallel-join-deadline | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-parallel-join-deadline.md | 8a9d1936fc05 |
| percent-of-total | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-percent-of-total.md | 5af2a8a465e1 |
| raised-largest-record | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-raised-largest-record.md | 306f48846330 |
| raised-smallest-record | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-raised-smallest-record.md | 624c8a0d56b3 |
| reverse-word | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-reverse-word.md | c3c7d5274f0c |
| scaled-recipe | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-scaled-recipe.md | 5e0bffe7db36 |
| top-k-among-list | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-top-k-among-list.md | 562ef55bb3fe |
| total-plus-a-fixed-amount | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-total-plus-a-fixed-amount.md | a25b61c006c5 |
| total-plus-a-percentage | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-total-plus-a-percentage.md | 7633f30b3df4 |
| two-tier-price | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-two-tier-price.md | 6b1ae5967f70 |
| vowel-richest-word | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-vowel-richest-word.md | 6d68ed39e40f |
| whole-units-under-a-budget | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-whole-units-under-a-budget.md | 850cbef4059e |
| words-containing-letter | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-words-containing-letter.md | 68d5bc573401 |

Total accepted examples: 2760.
