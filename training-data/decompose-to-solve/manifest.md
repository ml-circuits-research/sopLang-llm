# Manifest

The manifest is split by pattern so a long table stays reviewable. Each pattern manifest holds one row per accepted example, and the index records the counts and the content hash of every pattern file. `distinct plans` counts the plan fingerprints of the pattern: the compiled circuits differ between variants of one template because they embed their instance values, so the plan fingerprint is the latent-plan measure.

| pattern | examples | train | eval | knowledge | no-knowledge | distinct plans | file | hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-01.md | aac3ac72f649 |
| 2 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-02.md | b1731f05083b |
| 3 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-03.md | a20a331c09d0 |
| 4 | 100 | 0 | 100 | 0 | 100 | 1 | manifest/pattern-04.md | 01668817db9b |
| 5 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-05.md | 136a3c10b943 |
| 6 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-06.md | 21c1442fdf8b |
| 7 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-07.md | 041fdb4a01cc |
| 8 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-08.md | d3199d9fd78c |
| 9 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-09.md | 7a329614b3d7 |
| 10 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-10.md | d856469c4523 |

Total accepted examples: 1000.
