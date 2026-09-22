# Capability probes — exp-009-mix10

Suite `capability-probes-1.0.0`, 10 probes, **1/10 passed**, served artifact `evaluation/registry/exp-009-mix10/gguf/checkpoint-728.gguf`.

| kind | passed | items |
| --- | --- | --- |
| instruction | 1 | 4 |
| javascript | 0 | 6 |

| probe | kind | class | expected | answer |
| --- | --- | --- | --- | --- |
| probe/ins-exact-word | instruction | answer_mismatch | ready | {"word":"reply","reply":"With exactly the word ready and not |
| probe/ins-label-and-number | instruction | answer_match | OK:3 | OK:3 |
| probe/ins-ordered-digits | instruction | answer_mismatch | 5,7,9 | {"digits": [   7,   5,   9 ], "ordered": [   5,   7,   9 ],  |
| probe/ins-repeat-three | instruction | answer_mismatch | sop sop sop | sop |
| probe/js-array-filter-length | javascript | answer_mismatch | 2 | @jsEvaluated |
| probe/js-nullish | javascript | answer_mismatch | 7 | @value is not defined |
| probe/js-object-keys-join | javascript | answer_mismatch | first-second | @object-keys {"first": 1, "second": 2}  @result |
| probe/js-reduce-sum | javascript | answer_mismatch | 10 | [1, 2, 3, 4].reduce((sum, value) => sum + value, 0) = 10 |
| probe/js-string-slice | javascript | answer_mismatch | sop | {"kind":"slice","start":0,"length":3} |
| probe/js-typeof-nan | javascript | answer_mismatch | number | { "kind": "object", "value": null, "message": "the compiled  |

The probe suite is a loss detector for the language and code substrate, not a score of the compilation task: a checkpoint that passes fewer probes than the untuned base has lost general capability while gaining SOP Lang syntax, which is the signal `DS009` uses to change the mixture or the recipe.
