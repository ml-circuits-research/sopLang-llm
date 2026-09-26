# Manifest

The manifest is split by template so a long table stays reviewable. Each template manifest holds one row per accepted example, and the index records the counts and the content hash of every template file. `distinct plans` counts the plan fingerprints of the template: the compiled circuits differ between variants of one template because they embed their instance values, so the plan fingerprint is the latent-plan measure.

| template | examples | train | eval | knowledge | no-knowledge | distinct plans | file | hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-01.md | 7c283a8eceb2 |
| 2 | 50 | 0 | 50 | 0 | 50 | 1 | manifest/template-02.md | 0ee9b2bbecfb |
| 3 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-03.md | 6248ddfc6190 |
| 4 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-04.md | 434880e60090 |
| 5 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-05.md | 8fd31278bca2 |
| 6 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-06.md | ad76458355ea |
| 7 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-07.md | 242a66c60182 |
| 8 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-08.md | fc86cb85c499 |
| 9 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-09.md | 27c1ea8ce26c |
| 10 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-10.md | 15b1befdf3b9 |
| 11 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-11.md | 7268a8813ff0 |
| 12 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-12.md | bab4bc0ab7fa |
| 13 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-13.md | 84c3b5d1716c |
| 14 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-14.md | 155b0f508c2e |
| 15 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-15.md | eccd16694c7a |
| 16 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-16.md | 5fe16652cc8a |
| 17 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-17.md | 6bc0b7802786 |
| 18 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-18.md | 818317810895 |
| 19 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-19.md | 56ac3925ff24 |
| 20 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-20.md | ce7449777f9d |

Total accepted examples: 1000.
