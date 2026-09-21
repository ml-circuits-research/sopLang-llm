# Capability probes — exp-003-sft-lr1e-4-q8-0

Suite `capability-probes-1.0.0`, 10 probes, **1/10 passed**, served artifact `/home/salboaie/work/sopLang-llm/evaluation/registry/exp-003-sft-lr1e-4/gguf/checkpoint-540-q8-0.gguf`.

| kind | passed | items |
| --- | --- | --- |
| instruction | 1 | 4 |
| javascript | 0 | 6 |

| probe | kind | class | expected | answer |
| --- | --- | --- | --- | --- |
| probe/ins-exact-word | instruction | answer_mismatch | ready | Reply with exactly the word ready. |
| probe/ins-label-and-number | instruction | answer_match | OK:3 | OK:3 |
| probe/ins-ordered-digits | instruction | answer_mismatch | 5,7,9 | 759 |
| probe/ins-repeat-three | instruction | answer_mismatch | sop sop sop | sop sop sop sop |
| probe/js-array-filter-length | javascript | answer_mismatch | 2 | {1, 2, 3, 4}.filter((value) => value % 2 === 0).length = 2; |
| probe/js-nullish | javascript | answer_mismatch | 7 | null ?? 7 |
| probe/js-object-keys-join | javascript | answer_mismatch | first-second | {"first": 1, "second": 2} |
| probe/js-reduce-sum | javascript | answer_mismatch | 10 | {1: 1, 2: 2, 3: 3, 4: 4} |
| probe/js-string-slice | javascript | answer_mismatch | sop | {"lang":"SOP","code":"lang"} |
| probe/js-typeof-nan | javascript | answer_mismatch | number | "object" |

The probe suite is a loss detector for the language and code substrate, not a score of the compilation task: a checkpoint that passes fewer probes than the untuned base has lost general capability while gaining SOP Lang syntax, which is the signal `DS009` uses to change the mixture or the recipe.
