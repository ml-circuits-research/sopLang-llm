# Manifest

The manifest is split by pattern so a long table stays reviewable. Each pattern manifest holds one row per accepted example, and the index records the counts and the content hash of every pattern file. `distinct plans` counts the plan fingerprints of the pattern: the compiled circuits differ between variants of one template because they embed their instance values, so the plan fingerprint is the latent-plan measure.

| pattern | examples | train | eval | knowledge | no-knowledge | distinct plans | file | hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-01.md | ea2e261f012b |
| 2 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-02.md | 25e55a006bf8 |
| 3 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-03.md | 5a124e66e52c |
| 4 | 100 | 0 | 100 | 0 | 100 | 1 | manifest/pattern-04.md | f42a05c6dd8f |
| 5 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-05.md | b68afe7d42c2 |
| 6 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-06.md | ec44121aad4f |
| 7 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-07.md | fee8d62b6c07 |
| 8 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-08.md | a1a3bab1c8a1 |
| 9 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-09.md | 6ac1d7e0672b |
| 10 | 100 | 100 | 0 | 0 | 100 | 1 | manifest/pattern-10.md | 3f3e86a03d7b |

Total accepted examples: 1000.
