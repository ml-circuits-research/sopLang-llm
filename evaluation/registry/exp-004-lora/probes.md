# Capability probes — exp-004-lora

Suite `capability-probes-1.0.0`, 10 probes, **0/10 passed**, served artifact `evaluation/registry/exp-004-lora/gguf/checkpoint-540.gguf`.

| kind | passed | items |
| --- | --- | --- |
| instruction | 0 | 4 |
| javascript | 0 | 6 |

| probe | kind | class | expected | answer |
| --- | --- | --- | --- | --- |
| probe/ins-exact-word | instruction | answer_mismatch | ready | Safety. |
| probe/ins-label-and-number | instruction | answer_mismatch | OK:3 | OK: 3  The cooling tower is designed to cool water to a temp |
| probe/ins-ordered-digits | instruction | answer_mismatch | 5,7,9 | 745 |
| probe/ins-repeat-three | instruction | answer_mismatch | sop sop sop | Sop of strength, Sop of efficiency, Sop of reliability. |
| probe/js-array-filter-length | javascript | answer_mismatch | 2 | 5  The length of the array is the count of even numbers. The |
| probe/js-nullish | javascript | answer_mismatch | 7 | undefined |
| probe/js-object-keys-join | javascript | answer_mismatch | first-second | -1 -2 -3 -4 -5 -6 -7 -8 -9 -10 -11 -12 -13 -14 -15 -16 -17 - |
| probe/js-reduce-sum | javascript | answer_mismatch | 10 | 5 |
| probe/js-string-slice | javascript | answer_mismatch | sop | The word is "South Africa." |
| probe/js-typeof-nan | javascript | answer_mismatch | number | number  The value of `NaN` is not a number, so the compariso |

The probe suite is a loss detector for the language and code substrate, not a score of the compilation task: a checkpoint that passes fewer probes than the untuned base has lost general capability while gaining SOP Lang syntax, which is the signal `DS009` uses to change the mixture or the recipe.
