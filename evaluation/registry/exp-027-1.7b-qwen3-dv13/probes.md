# Capability probes — exp-027-1.7b-qwen3-dv13

Suite `capability-probes-1.0.0`, 10 probes, **3/10 passed**, served artifact `evaluation/registry/exp-027-1.7b-qwen3-dv13/gguf/checkpoint-600.gguf`.

| kind | passed | items |
| --- | --- | --- |
| instruction | 3 | 4 |
| javascript | 0 | 6 |

| probe | kind | class | expected | answer |
| --- | --- | --- | --- | --- |
| probe/ins-exact-word | instruction | answer_match | ready | ready |
| probe/ins-label-and-number | instruction | answer_match | OK:3 | OK:3 |
| probe/ins-ordered-digits | instruction | answer_mismatch | 5,7,9 | 7,5,9 |
| probe/ins-repeat-three | instruction | answer_match | sop sop sop | sop sop sop |
| probe/js-array-filter-length | javascript | answer_mismatch | 2 | (async () => {   const w_slots = {   "array": [     1,     2 |
| probe/js-nullish | javascript | answer_mismatch | 7 | const value = null; return value === null ? 7 : value; |
| probe/js-object-keys-join | javascript | answer_mismatch | first-second | {"first":1,"second":2}  -join  {"first":"1","second":"2"} →  |
| probe/js-reduce-sum | javascript | answer_mismatch | 10 | @reduce const list = [1, 2, 3, 4]; const initial = 0; const  |
| probe/js-string-slice | javascript | answer_mismatch | sop | @eval const sopLang = "sopLang"; const slice = sopLang.slice |
| probe/js-typeof-nan | javascript | answer_mismatch | number | typeof NaN "object" |

The probe suite is a loss detector for the language and code substrate, not a score of the compilation task: a checkpoint that passes fewer probes than the untuned base has lost general capability while gaining SOP Lang syntax, which is the signal `DS009` uses to change the mixture or the recipe.
