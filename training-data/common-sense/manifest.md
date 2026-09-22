# Manifest

The manifest is split by template so a long table stays reviewable. Each template manifest holds one row per accepted example, and the index records the counts and the content hash of every template file. `distinct plans` counts the plan fingerprints of the template: the compiled circuits differ between variants of one template because they embed their instance values, so the plan fingerprint is the latent-plan measure.

| template | examples | train | eval | knowledge | no-knowledge | distinct plans | file | hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-01.md | 7b4828c73882 |
| 2 | 50 | 0 | 50 | 0 | 50 | 1 | manifest/template-02.md | 85907b621b3a |
| 3 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-03.md | 001091720ce8 |
| 4 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-04.md | e491935d6b14 |
| 5 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-05.md | 36727ad29a45 |
| 6 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-06.md | 82444e824947 |
| 7 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-07.md | aec731da4e5d |
| 8 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-08.md | f908db3dc6dc |
| 9 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-09.md | 57a96421250f |
| 10 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-10.md | d2e182ef7f00 |
| 11 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-11.md | f7aaf8efe311 |
| 12 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-12.md | 4a20cd6508a2 |
| 13 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-13.md | 30f78daf0f57 |
| 14 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-14.md | 5c816c2f77e5 |
| 15 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-15.md | e6f628fa21d0 |
| 16 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-16.md | c7244d365189 |
| 17 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-17.md | f4845c989312 |
| 18 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-18.md | 3003388e7eb6 |
| 19 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-19.md | 6ffa6b96bbef |
| 20 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-20.md | 903d83994a7b |

Total accepted examples: 1000.
