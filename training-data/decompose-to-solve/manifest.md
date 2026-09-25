# Manifest

The manifest is split by pattern so a long table stays reviewable. Each pattern manifest holds one row per accepted example, and the index records the counts and the content hash of every pattern file. `distinct plans` counts the plan fingerprints of the pattern: the compiled circuits differ between variants of one template because they embed their instance values, so the plan fingerprint is the latent-plan measure.

| pattern | examples | train | eval | knowledge | no-knowledge | distinct plans | file | hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-01.md | ea2e261f012b |
| 2 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-02.md | e6ba716080fe |
| 3 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-03.md | 5a124e66e52c |
| 4 | 100 | 0 | 100 | 0 | 100 | 1 | manifest/pattern-04.md | f42a05c6dd8f |
| 5 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-05.md | 821f826e34e5 |
| 6 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-06.md | 8b2fa416b725 |
| 7 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-07.md | af418ccc87b6 |
| 8 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-08.md | 6080a5425153 |
| 9 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-09.md | 2e29e1b3e978 |
| 10 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-10.md | 3f3e86a03d7b |

Total accepted examples: 1000.
