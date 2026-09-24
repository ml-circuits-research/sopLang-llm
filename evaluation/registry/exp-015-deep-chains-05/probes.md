# Capability probes — exp-015-deep-chains-05

Suite `capability-probes-1.0.0`, 10 probes, **0/10 passed**, served artifact `evaluation/registry/exp-015-deep-chains-05/gguf/checkpoint-600.gguf`.

| kind | passed | items |
| --- | --- | --- |
| instruction | 0 | 4 |
| javascript | 0 | 6 |

| probe | kind | class | expected | answer |
| --- | --- | --- | --- | --- |
| probe/ins-exact-word | instruction | answer_mismatch | ready | Reply with exactly the word "thank you". |
| probe/ins-label-and-number | instruction | answer_mismatch | OK:3 | OK: 3 |
| probe/ins-ordered-digits | instruction | answer_mismatch | 5,7,9 | 759 |
| probe/ins-repeat-three | instruction | answer_mismatch | sop sop sop | sop sop sop sop sop sop sop sop sop sop sop sop sop sop sop  |
| probe/js-array-filter-length | javascript | answer_mismatch | 2 | (async () => {   const w_slots = {   "items": [     1,     2 |
| probe/js-nullish | javascript | answer_mismatch | 7 | null ?? 7 |
| probe/js-object-keys-join | javascript | answer_mismatch | first-second | { first: 1, second: 2 } |
| probe/js-reduce-sum | javascript | answer_mismatch | 10 | [1, 2, 3, 4].reduce((sum, value) => sum + value, 0) |
| probe/js-string-slice | javascript | answer_mismatch | sop | sopLang |
| probe/js-typeof-nan | javascript | answer_mismatch | number | NaN is not a number in the strict sense. It has no numeric v |

The probe suite is a loss detector for the language and code substrate, not a score of the compilation task: a checkpoint that passes fewer probes than the untuned base has lost general capability while gaining SOP Lang syntax, which is the signal `DS009` uses to change the mixture or the recipe.
