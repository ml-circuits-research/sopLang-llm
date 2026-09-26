# Manifest

The manifest is split by pattern so a long table stays reviewable. Each pattern manifest holds one row per accepted example, and the index records the counts and the content hash of every pattern file. `distinct plans` counts the plan fingerprints of the pattern: the compiled circuits differ between variants of one template because they embed their instance values, so the plan fingerprint is the latent-plan measure.

| pattern | examples | train | eval | knowledge | no-knowledge | distinct plans | file | hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-01.md | 67ea63dc2289 |
| 2 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-02.md | 28ceb711a153 |
| 3 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-03.md | 829f6b42209e |
| 4 | 100 | 0 | 100 | 0 | 100 | 1 | manifest/pattern-04.md | ef2259150629 |
| 5 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-05.md | b0f55011dc2f |
| 6 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-06.md | f0e99768a2b7 |
| 7 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-07.md | 69968a85a3c1 |
| 8 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-08.md | f304283482b3 |
| 9 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-09.md | 21d2d27af413 |
| 10 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-10.md | 681f7f4599d1 |

Total accepted examples: 1000.
