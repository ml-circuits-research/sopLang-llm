# Capability probes — exp-017-qwen3-17b

Suite `capability-probes-1.0.0`, 10 probes, **4/10 passed**, served artifact `evaluation/registry/exp-017-qwen3-17b/gguf/checkpoint-450.gguf`.

| kind | passed | items |
| --- | --- | --- |
| instruction | 3 | 4 |
| javascript | 1 | 6 |

| probe | kind | class | expected | answer |
| --- | --- | --- | --- | --- |
| probe/ins-exact-word | instruction | answer_match | ready | ready |
| probe/ins-label-and-number | instruction | answer_match | OK:3 | OK:3 |
| probe/ins-ordered-digits | instruction | answer_mismatch | 5,7,9 | 7,5,9 |
| probe/ins-repeat-three | instruction | answer_match | sop sop sop | sop sop sop |
| probe/js-array-filter-length | javascript | answer_mismatch | 2 | <think>  </think> |
| probe/js-nullish | javascript | answer_match | 7 | 7 |
| probe/js-object-keys-join | javascript | answer_mismatch | first-second | "first-2" |
| probe/js-reduce-sum | javascript | answer_mismatch | 10 | 0 + 1 + 2 + 3 + 4 = 10 |
| probe/js-string-slice | javascript | answer_mismatch | sop | @slice source: "sopLang" start: 0 length: 3 |
| probe/js-typeof-nan | javascript | answer_mismatch | number | "object" |

The probe suite is a loss detector for the language and code substrate, not a score of the compilation task: a checkpoint that passes fewer probes than the untuned base has lost general capability while gaining SOP Lang syntax, which is the signal `DS009` uses to change the mixture or the recipe.
