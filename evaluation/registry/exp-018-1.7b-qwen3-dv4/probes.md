# Capability probes — exp-018-1.7b-qwen3-dv4

Suite `capability-probes-1.0.0`, 10 probes, **2/10 passed**, served artifact `evaluation/registry/exp-018-1.7b-qwen3-dv4/gguf/checkpoint-600.gguf`.

| kind | passed | items |
| --- | --- | --- |
| instruction | 2 | 4 |
| javascript | 0 | 6 |

| probe | kind | class | expected | answer |
| --- | --- | --- | --- | --- |
| probe/ins-exact-word | instruction | answer_match | ready | ready |
| probe/ins-label-and-number | instruction | answer_mismatch | OK:3 | _OK:3 |
| probe/ins-ordered-digits | instruction | answer_mismatch | 5,7,9 | 7,5,9 |
| probe/ins-repeat-three | instruction | answer_match | sop sop sop | sop sop sop |
| probe/js-array-filter-length | javascript | answer_mismatch | 2 | <think>  </think> |
| probe/js-nullish | javascript | answer_mismatch | 7 | null ?? 7 |
| probe/js-object-keys-join | javascript | answer_mismatch | first-second | ["first","second"].join("-") + " → " + String(Object.keys({  |
| probe/js-reduce-sum | javascript | answer_mismatch | 10 | (async () => {   const w_slots = {   "list": [     1,     2, |
| probe/js-string-slice | javascript | answer_mismatch | sop | <think>  </think> |
| probe/js-typeof-nan | javascript | answer_mismatch | number | typeof NaN |

The probe suite is a loss detector for the language and code substrate, not a score of the compilation task: a checkpoint that passes fewer probes than the untuned base has lost general capability while gaining SOP Lang syntax, which is the signal `DS009` uses to change the mixture or the recipe.
