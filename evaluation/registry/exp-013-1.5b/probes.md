# Capability probes — exp-013-1.5b

Suite `capability-probes-1.0.0`, 10 probes, **5/10 passed**, served artifact `evaluation/registry/exp-013-1.5b/gguf/checkpoint-450.gguf`.

| kind | passed | items |
| --- | --- | --- |
| instruction | 3 | 4 |
| javascript | 2 | 6 |

| probe | kind | class | expected | answer |
| --- | --- | --- | --- | --- |
| probe/ins-exact-word | instruction | answer_match | ready | ready |
| probe/ins-label-and-number | instruction | answer_match | OK:3 | OK:3 |
| probe/ins-ordered-digits | instruction | answer_mismatch | 5,7,9 | 7,5,9 |
| probe/ins-repeat-three | instruction | answer_match | sop sop sop | sop sop sop |
| probe/js-array-filter-length | javascript | answer_mismatch | 2 | (async () => {   const w_slots = {   "values": [     1,      |
| probe/js-nullish | javascript | answer_mismatch | 7 | const value = null; return String(value ?? 7); |
| probe/js-object-keys-join | javascript | answer_match | first-second | "first-second" |
| probe/js-reduce-sum | javascript | answer_mismatch | 10 | [1, 2, 3, 4].reduce((sum, value) => sum + value, 0) |
| probe/js-string-slice | javascript | answer_mismatch | sop | "so" |
| probe/js-typeof-nan | javascript | answer_match | number | "number" |

The probe suite is a loss detector for the language and code substrate, not a score of the compilation task: a checkpoint that passes fewer probes than the untuned base has lost general capability while gaining SOP Lang syntax, which is the signal `DS009` uses to change the mixture or the recipe.
