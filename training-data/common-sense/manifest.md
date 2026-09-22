# Manifest

The manifest is split by template so a long table stays reviewable. Each template manifest holds one row per accepted example, and the index records the counts and the content hash of every template file. `distinct plans` counts the plan fingerprints of the template: the compiled circuits differ between variants of one template because they embed their instance values, so the plan fingerprint is the latent-plan measure.

| template | examples | train | eval | knowledge | no-knowledge | distinct plans | file | hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-01.md | 2f7b5bd006e2 |
| 2 | 50 | 0 | 50 | 0 | 50 | 1 | manifest/template-02.md | 0a900161f70d |
| 3 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-03.md | 94d0df4b411c |
| 4 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-04.md | d3413b479799 |
| 5 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-05.md | 5b158c03d56b |
| 6 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-06.md | f808260c3ace |
| 7 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-07.md | b8d1cb2ad260 |
| 8 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-08.md | 2fd95676cf38 |
| 9 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-09.md | ce91bfc3bce0 |
| 10 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-10.md | 5fce44da651b |
| 11 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-11.md | 6e060fd37349 |
| 12 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-12.md | 240d126ca1bb |
| 13 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-13.md | 0c007a858c5f |
| 14 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-14.md | fac6e60e3e45 |
| 15 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-15.md | 9ad7b52a499a |
| 16 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-16.md | 720b752e67c0 |
| 17 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-17.md | 827427d7a7be |
| 18 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-18.md | fb0363f66edd |
| 19 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-19.md | 0f00e4003691 |
| 20 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-20.md | 91fb349a6727 |

Total accepted examples: 1000.
