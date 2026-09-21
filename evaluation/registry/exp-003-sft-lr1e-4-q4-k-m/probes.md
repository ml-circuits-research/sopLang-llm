# Capability probes — exp-003-sft-lr1e-4-q4-k-m

Suite `capability-probes-1.0.0`, 10 probes, **1/10 passed**, served artifact `/home/salboaie/work/sopLang-llm/evaluation/registry/exp-003-sft-lr1e-4/gguf/checkpoint-540-q4-k-m.gguf`.

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
| probe/js-array-filter-length | javascript | answer_mismatch | 2 | The length of the filter results is 3. |
| probe/js-nullish | javascript | answer_mismatch | 7 | null ?? 7 |
| probe/js-object-keys-join | javascript | answer_mismatch | first-second | {"first": 1, "second": 2} |
| probe/js-reduce-sum | javascript | answer_mismatch | 10 | {1, 2, 3, 4}.reduce((sum, value) => sum + value, 0) = 10 |
| probe/js-string-slice | javascript | answer_mismatch | sop | {"kind":"stringSlice","start":0,"length":3} |
| probe/js-typeof-nan | javascript | answer_mismatch | number | "object" |

The probe suite is a loss detector for the language and code substrate, not a score of the compilation task: a checkpoint that passes fewer probes than the untuned base has lost general capability while gaining SOP Lang syntax, which is the signal `DS009` uses to change the mixture or the recipe.
