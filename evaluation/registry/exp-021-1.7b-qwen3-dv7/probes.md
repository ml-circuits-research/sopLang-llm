# Capability probes — exp-021-1.7b-qwen3-dv7

Suite `capability-probes-1.0.0`, 10 probes, **1/10 passed**, served artifact `evaluation/registry/exp-021-1.7b-qwen3-dv7/gguf/checkpoint-450.gguf`.

| kind | passed | items |
| --- | --- | --- |
| instruction | 1 | 4 |
| javascript | 0 | 6 |

| probe | kind | class | expected | answer |
| --- | --- | --- | --- | --- |
| probe/ins-exact-word | instruction | answer_mismatch | ready | <think>  </think> |
| probe/ins-label-and-number | instruction | answer_mismatch | OK:3 | <think>  </think> |
| probe/ins-ordered-digits | instruction | answer_mismatch | 5,7,9 | <think>  </think> |
| probe/ins-repeat-three | instruction | answer_match | sop sop sop | sop sop sop |
| probe/js-array-filter-length | javascript | answer_mismatch | 2 | <think>  </think> |
| probe/js-nullish | javascript | answer_mismatch | 7 | <think>  </think> |
| probe/js-object-keys-join | javascript | answer_mismatch | first-second | <think>  </think> |
| probe/js-reduce-sum | javascript | answer_mismatch | 10 | <think>  </think> |
| probe/js-string-slice | javascript | answer_mismatch | sop | <think>  </think> |
| probe/js-typeof-nan | javascript | answer_mismatch | number | <think>  </think> |

The probe suite is a loss detector for the language and code substrate, not a score of the compilation task: a checkpoint that passes fewer probes than the untuned base has lost general capability while gaining SOP Lang syntax, which is the signal `DS009` uses to change the mixture or the recipe.
