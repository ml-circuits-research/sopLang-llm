# Manifest

The manifest is split by family so a long table stays reviewable. Each family manifest holds one row per accepted example, and the index records the counts and the content hash of every family file. `distinct plans` counts the plan fingerprints of the family: the compiled circuits differ between variants of one template because they embed their instance values, so the plan fingerprint is the latent-plan measure.

| family | examples | train | eval | knowledge | no-knowledge | distinct plans | file | hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| above-count | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-count.md | dd0038f61966 |
| above-count-double | 40 | 0 | 40 | 0 | 40 | 1 | manifest/family-above-count-double.md | d2cc40f67789 |
| above-count-per-unit-add-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-count-per-unit-add-rate.md | 07c725f26e1d |
| above-largest-add-rate | 40 | 0 | 40 | 0 | 40 | 1 | manifest/family-above-largest-add-rate.md | 0cd2458c2769 |
| above-largest-double | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-largest-double.md | eb3c6e106753 |
| above-largest-per-unit-subtract-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-largest-per-unit-subtract-rate.md | 2bec2715b83b |
| above-smallest-double | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-smallest-double.md | d3869fdf93ff |
| above-smallest-per-unit-add-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-smallest-per-unit-add-rate.md | 99f9e70c5ed7 |
| above-total | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-total.md | 6bef6e75364f |
| above-total-add-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-total-add-rate.md | 69286e70d5fa |
| above-total-double-per-unit-add-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-total-double-per-unit-add-rate.md | e51fb94143bd |
| above-total-per-unit-add-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-total-per-unit-add-rate.md | 1b997713bda5 |
| above-total-subtract-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-above-total-subtract-rate.md | 11d651dccbef |
| average-of-qualifying | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-average-of-qualifying.md | 74767ddcbcff |
| below-count | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-below-count.md | b041f956f36f |
| below-count-per-unit-add-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-below-count-per-unit-add-rate.md | 15d6ef7bd441 |
| below-largest-add-rate | 40 | 0 | 40 | 0 | 40 | 1 | manifest/family-below-largest-add-rate.md | c19c2d9b3c0f |
| below-largest-double | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-below-largest-double.md | 5d8c988ed5c3 |
| below-largest-per-unit-double-add-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-below-largest-per-unit-double-add-rate.md | cbd310e1d16b |
| below-total | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-below-total.md | cfdb1486400f |
| below-total-add-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-below-total-add-rate.md | 7a9184fd6853 |
| below-total-double-subtract-rate | 40 | 40 | 0 | 0 | 40 | 1 | manifest/family-below-total-double-subtract-rate.md | 1370640c53f1 |
| below-total-per-unit-subtract-rate | 40 | 0 | 40 | 0 | 40 | 1 | manifest/family-below-total-per-unit-subtract-rate.md | 3a9481add77a |
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

Total accepted examples: 2160.
