# Manifest

The manifest is split by template so a long table stays reviewable. Each template manifest holds one row per accepted example, and the index records the counts and the content hash of every template file. `distinct plans` counts the plan fingerprints of the template: the compiled circuits differ between variants of one template because they embed their instance values, so the plan fingerprint is the latent-plan measure.

| template | examples | train | eval | knowledge | no-knowledge | distinct plans | file | hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-01.md | 82a9dae6dc29 |
| 2 | 50 | 0 | 50 | 0 | 50 | 1 | manifest/template-02.md | 571481e787a8 |
| 3 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-03.md | 56c3c3ddd1f5 |
| 4 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-04.md | f17a93e903df |
| 5 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-05.md | 78f91f7f205b |
| 6 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-06.md | 33e457a7d49f |
| 7 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-07.md | 832b5ee96874 |
| 8 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-08.md | f2ea032591f1 |
| 9 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-09.md | 8775e8931c7a |
| 10 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-10.md | 159a2043a01f |
| 11 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-11.md | 7268a8813ff0 |
| 12 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-12.md | bab4bc0ab7fa |
| 13 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-13.md | c54e59bc4436 |
| 14 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-14.md | 93f08e2fe82c |
| 15 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-15.md | bf25a2b4bfd6 |
| 16 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-16.md | 81fd43196b0d |
| 17 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-17.md | 6bc0b7802786 |
| 18 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-18.md | 88d71e2153e2 |
| 19 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-19.md | 6eb00609f641 |
| 20 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-20.md | ef5fe9b53bf7 |

Total accepted examples: 1000.
