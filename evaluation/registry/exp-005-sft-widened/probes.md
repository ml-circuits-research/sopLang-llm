# Capability probes — exp-005-sft-widened

Suite `capability-probes-1.0.0`, 10 probes, **1/10 passed**, served artifact `evaluation/registry/exp-005-sft-widened/gguf/checkpoint-360.gguf`.

| kind | passed | items |
| --- | --- | --- |
| instruction | 1 | 4 |
| javascript | 0 | 6 |

| probe | kind | class | expected | answer |
| --- | --- | --- | --- | --- |
| probe/ins-exact-word | instruction | answer_mismatch | ready | The reply is ready. |
| probe/ins-label-and-number | instruction | answer_match | OK:3 | OK:3 |
| probe/ins-ordered-digits | instruction | answer_mismatch | 5,7,9 | 759 |
| probe/ins-repeat-three | instruction | answer_mismatch | sop sop sop | sop sop sop sop |
| probe/js-array-filter-length | javascript | answer_mismatch | 2 | The given JavaScript expression filters an array and counts  |
| probe/js-nullish | javascript | answer_mismatch | 7 | const value = null; const answer = value ?? 7; return answer |
| probe/js-object-keys-join | javascript | answer_mismatch | first-second | const keys = Object.keys({ first: 1, second: 2 }); return "- |
| probe/js-reduce-sum | javascript | answer_mismatch | 10 | [1, 2, 3, 4].reduce((sum, value) => sum + value, 0) = 10 |
| probe/js-string-slice | javascript | answer_mismatch | sop | The slice operation returns a new string, so the exact outpu |
| probe/js-typeof-nan | javascript | answer_mismatch | number | The JavaScript constant `NaN` has no type. It is not compara |

The probe suite is a loss detector for the language and code substrate, not a score of the compilation task: a checkpoint that passes fewer probes than the untuned base has lost general capability while gaining SOP Lang syntax, which is the signal `DS009` uses to change the mixture or the recipe.
