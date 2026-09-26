# Manifest

The manifest is split by pattern so a long table stays reviewable. Each pattern manifest holds one row per accepted example, and the index records the counts and the content hash of every pattern file. `distinct plans` counts the plan fingerprints of the pattern: the compiled circuits differ between variants of one template because they embed their instance values, so the plan fingerprint is the latent-plan measure.

| pattern | examples | train | eval | knowledge | no-knowledge | distinct plans | file | hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-01.md | 773ec9032413 |
| 2 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-02.md | a597c6fda1c9 |
| 3 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-03.md | abe6e6c9e7c5 |
| 4 | 100 | 0 | 100 | 0 | 100 | 1 | manifest/pattern-04.md | c0d07cd942e2 |
| 5 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-05.md | 389dc4f1bb7b |
| 6 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-06.md | 808a0318451a |
| 7 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-07.md | 96b26554ab54 |
| 8 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-08.md | 969536e4d5f6 |
| 9 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-09.md | 17d6c2e60207 |
| 10 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-10.md | b0dfdab628b2 |

Total accepted examples: 1000.
