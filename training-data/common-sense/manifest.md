# Manifest

The manifest is split by template so a long table stays reviewable. Each template manifest holds one row per accepted example, and the index records the counts and the content hash of every template file. `distinct plans` counts the plan fingerprints of the template: the compiled circuits differ between variants of one template because they embed their instance values, so the plan fingerprint is the latent-plan measure.

| template | examples | train | eval | knowledge | no-knowledge | distinct plans | file | hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-01.md | 74759af9e121 |
| 2 | 50 | 0 | 50 | 0 | 50 | 1 | manifest/template-02.md | 2aac6dc9727b |
| 3 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-03.md | 57c858b21813 |
| 4 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-04.md | 43022ee96574 |
| 5 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-05.md | 4ec14ed33af3 |
| 6 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-06.md | dee33949ae23 |
| 7 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-07.md | 0e9f4885a38f |
| 8 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-08.md | 9a5280a1c582 |
| 9 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-09.md | 26d5bced7dfd |
| 10 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-10.md | f527436e5101 |
| 11 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-11.md | 1b0c49061303 |
| 12 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-12.md | 6fe7f91538dc |
| 13 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-13.md | f4bb40f20b2d |
| 14 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-14.md | 2fcaed36bd81 |
| 15 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-15.md | 386f39a4458e |
| 16 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-16.md | e8d446294f26 |
| 17 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-17.md | bd707fb9b7d8 |
| 18 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-18.md | 1d506cc7bba9 |
| 19 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-19.md | 778b542608fb |
| 20 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-20.md | 5a93e1713423 |

Total accepted examples: 1000.
