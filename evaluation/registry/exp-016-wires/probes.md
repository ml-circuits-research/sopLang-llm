# Capability probes — exp-016-wires

Suite `capability-probes-1.0.0`, 10 probes, **3/10 passed**, served artifact `evaluation/registry/exp-016-wires/gguf/checkpoint-600.gguf`.

| kind | passed | items |
| --- | --- | --- |
| instruction | 2 | 4 |
| javascript | 1 | 6 |

| probe | kind | class | expected | answer |
| --- | --- | --- | --- | --- |
| probe/ins-exact-word | instruction | answer_match | ready | ready |
| probe/ins-label-and-number | instruction | answer_mismatch | OK:3 | @label OK  @number 3  @unit seconds |
| probe/ins-ordered-digits | instruction | answer_mismatch | 5,7,9 | 7,5,9 |
| probe/ins-repeat-three | instruction | answer_match | sop sop sop | sop sop sop |
| probe/js-array-filter-length | javascript | answer_mismatch | 2 | (async () => {   const w_slots = {   "values": [     1,      |
| probe/js-nullish | javascript | answer_mismatch | 7 | (async () => {   const w_slots = {   "value": null,   "fallb |
| probe/js-object-keys-join | javascript | answer_mismatch | first-second | {   "first": 1,   "second": 2 } |
| probe/js-reduce-sum | javascript | answer_mismatch | 10 | (async () => {   const w_slots = {   "list": [     1,     2, |
| probe/js-string-slice | javascript | answer_mismatch | sop | "so".slice(0, 3) |
| probe/js-typeof-nan | javascript | answer_match | number | "number" |

The probe suite is a loss detector for the language and code substrate, not a score of the compilation task: a checkpoint that passes fewer probes than the untuned base has lost general capability while gaining SOP Lang syntax, which is the signal `DS009` uses to change the mixture or the recipe.
