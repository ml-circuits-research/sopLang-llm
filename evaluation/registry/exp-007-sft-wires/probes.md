# Capability probes — exp-007-sft-wires

Suite `capability-probes-1.0.0`, 10 probes, **0/10 passed**, served artifact `evaluation/registry/exp-007-sft-wires/gguf/checkpoint-540.gguf`.

| kind | passed | items |
| --- | --- | --- |
| instruction | 0 | 4 |
| javascript | 0 | 6 |

| probe | kind | class | expected | answer |
| --- | --- | --- | --- | --- |
| probe/ins-exact-word | instruction | answer_mismatch | ready | The reply is ready. |
| probe/ins-label-and-number | instruction | answer_mismatch | OK:3 | OK: NUMBER THREE |
| probe/ins-ordered-digits | instruction | answer_mismatch | 5,7,9 | 7, 5, 9 |
| probe/ins-repeat-three | instruction | answer_mismatch | sop sop sop | sop sop sop sop |
| probe/js-array-filter-length | javascript | answer_mismatch | 2 | The JavaScript expression `[1, 2, 3, 4].filter((value) => va |
| probe/js-nullish | javascript | answer_mismatch | 7 | null ?? 7 = 7 |
| probe/js-object-keys-join | javascript | answer_mismatch | first-second | The output is a string of all the enumerable properties of t |
| probe/js-reduce-sum | javascript | answer_mismatch | 10 | [1, 2, 3, 4].reduce((sum, value) => sum + value, 0) evaluate |
| probe/js-string-slice | javascript | answer_mismatch | sop | `sopLang`.slice(0, 3) evaluates to "sop". |
| probe/js-typeof-nan | javascript | answer_mismatch | number | The value of `NaN` is not a real number, so its type remains |

The probe suite is a loss detector for the language and code substrate, not a score of the compilation task: a checkpoint that passes fewer probes than the untuned base has lost general capability while gaining SOP Lang syntax, which is the signal `DS009` uses to change the mixture or the recipe.
