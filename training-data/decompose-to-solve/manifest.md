# Manifest

The manifest is split by pattern so a long table stays reviewable. Each pattern manifest holds one row per accepted example, and the index records the counts and the content hash of every pattern file. `distinct plans` counts the plan fingerprints of the pattern: the compiled circuits differ between variants of one template because they embed their instance values, so the plan fingerprint is the latent-plan measure.

| pattern | examples | train | eval | knowledge | no-knowledge | distinct plans | file | hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-01.md | 34b44fce541b |
| 2 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-02.md | 203f548434c4 |
| 3 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-03.md | f7871eb7ee06 |
| 4 | 100 | 0 | 100 | 0 | 100 | 1 | manifest/pattern-04.md | c230bc6cf56f |
| 5 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-05.md | 1c9cc96795c5 |
| 6 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-06.md | 5e7a8874de7e |
| 7 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-07.md | df055c827a53 |
| 8 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-08.md | 3fe68cbb1f40 |
| 9 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-09.md | b75a074df9a2 |
| 10 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-10.md | b6c55367934d |

Total accepted examples: 1000.
