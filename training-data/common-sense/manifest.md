# Manifest

The manifest is split by template so a long table stays reviewable. Each template manifest holds one row per accepted example, and the index records the counts and the content hash of every template file. `distinct plans` counts the plan fingerprints of the template: the compiled circuits differ between variants of one template because they embed their instance values, so the plan fingerprint is the latent-plan measure.

| template | examples | train | eval | knowledge | no-knowledge | distinct plans | file | hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-01.md | 568f3c9a2c85 |
| 2 | 50 | 0 | 50 | 0 | 50 | 1 | manifest/template-02.md | 14160d6a7327 |
| 3 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-03.md | c0b9367cde5e |
| 4 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-04.md | 434880e60090 |
| 5 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-05.md | ba77e346524c |
| 6 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-06.md | b798b6f7c88a |
| 7 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-07.md | a5945436cefa |
| 8 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-08.md | cf059a763b06 |
| 9 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-09.md | efaa6804a2e1 |
| 10 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-10.md | e3de911a6b95 |
| 11 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-11.md | 9881f2fc997e |
| 12 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-12.md | 17e1e98a125f |
| 13 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-13.md | 03b140fd0c6f |
| 14 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-14.md | 983389b88960 |
| 15 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-15.md | 4eaf00539bb5 |
| 16 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-16.md | b8f341ef443c |
| 17 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-17.md | 6bc0b7802786 |
| 18 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-18.md | 7f46daf12c19 |
| 19 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-19.md | cde525615c75 |
| 20 | 50 | 50 | 0 | 0 | 50 | 1 | manifest/template-20.md | ce7449777f9d |

Total accepted examples: 1000.
