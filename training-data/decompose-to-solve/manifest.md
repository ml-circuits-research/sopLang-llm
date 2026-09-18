# Manifest

The manifest is split by pattern so a long table stays reviewable. Each pattern manifest holds one row per accepted example, and the index records the counts and the content hash of every pattern file. `distinct plans` counts the plan fingerprints of the pattern: the compiled circuits differ between variants of one template because they embed their instance values, so the plan fingerprint is the latent-plan measure.

| pattern | examples | train | eval | knowledge | no-knowledge | distinct plans | file | hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-01.md | 9a0f97fd55d3 |
| 2 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-02.md | 44e9cc2e120b |
| 3 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-03.md | 6121fbdd6d3d |
| 4 | 100 | 0 | 100 | 0 | 100 | 1 | manifest/pattern-04.md | 3d85d768fbcb |
| 5 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-05.md | 431b30b10c12 |
| 6 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-06.md | 12df45a49246 |
| 7 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-07.md | 95c894e7e69d |
| 8 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-08.md | 25f8bdd77a0a |
| 9 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-09.md | 1191a33600ef |
| 10 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-10.md | 8c6ce00917eb |

Total accepted examples: 1000.
