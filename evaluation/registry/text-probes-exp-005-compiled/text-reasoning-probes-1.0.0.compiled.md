# Capability probes — text-probes-exp-005-compiled

Suite `text-reasoning-probes-1.0.0`, 49 probes, **30/49 passed**, served artifact `/home/salboaie/work/sopLang-llm/evaluation/registry/exp-005-sft-widened/gguf/checkpoint-360.gguf`.

| kind | passed | items |
| --- | --- | --- |
| character-count | 16 | 16 |
| string-transform | 4 | 8 |
| word-count | 9 | 9 |
| situation-trick | 1 | 10 |
| ordering | 0 | 6 |

| probe | kind | class | expected | answer |
| --- | --- | --- | --- | --- |
| probe/count-assessment-s | character-count | answer_match | 4 | 4 times. |
| probe/count-banana-a | character-count | answer_match | 3 | 3 times. |
| probe/count-bookkeeper-o | character-count | answer_match | 2 | 2 times. |
| probe/count-committee-t | character-count | answer_match | 2 | 2 times. |
| probe/count-congratulations-r | character-count | answer_match | 1 | 1 times. |
| probe/count-mississippi-s | character-count | answer_match | 4 | 4 times. |
| probe/count-necessary-e | character-count | answer_match | 2 | 2 times. |
| probe/count-parallel-l | character-count | answer_match | 3 | 3 times. |
| probe/count-raspberry-r | character-count | answer_match | 3 | 3 times. |
| probe/count-receive-e | character-count | answer_match | 3 | 3 times. |
| probe/count-refrigerator-r | character-count | answer_match | 4 | 4 times. |
| probe/count-strawberry-r | character-count | answer_match | 3 | 3 times. |
| probe/count-text-a-man-a-a | character-count | answer_match | 10 | 10 times. |
| probe/count-text-raspberry-raisins-are-r | character-count | answer_match | 7 | 7 times. |
| probe/count-text-she-sells-sea-s | character-count | answer_match | 8 | 8 times. |
| probe/count-text-the-quick-brown-o | character-count | answer_match | 4 | 4 times. |
| probe/every-second-banana | string-transform | answer_mismatch | bnn | aaa. |
| probe/every-second-compiler | string-transform | answer_mismatch | cmie | oplr. |
| probe/every-second-deterministic | string-transform | answer_mismatch | dtriitc | eemnsi. |
| probe/every-second-strawberry | string-transform | answer_mismatch | srwer | tabry. |
| probe/longest-word-plan | word-count | answer_match | executed | executed. |
| probe/longest-word-small | word-count | answer_match | compiles | compiles. |
| probe/longest-word-the | word-count | answer_match | carefully | carefully. |
| probe/reverse-banana | string-transform | answer_match | ananab | ananab. |
| probe/reverse-compiler | string-transform | answer_match | relipmoc | relipmoc. |
| probe/reverse-deterministic | string-transform | answer_match | citsinimreted | citsinimreted. |
| probe/reverse-strawberry | string-transform | answer_match | yrrebwarts | yrrebwarts. |
| probe/situation-bat-and-ball | situation-trick | answer_mismatch | 0.05 | 1.1 |
| probe/situation-clock-quarter | situation-trick | answer_mismatch | 30 | -0.5:-30. |
| probe/situation-half-double | situation-trick | answer_match | 8 | 8 |
| probe/situation-kg-feathers-iron | situation-trick | answer_mismatch | the same | iron |
| probe/situation-months-28-days | situation-trick | answer_mismatch | 12 | 365 months. |
| probe/situation-palindrome-word | situation-trick | execution_error | level | (empty) |
| probe/situation-race-overtake | situation-trick | answer_mismatch | 2 | second place. |
| probe/situation-sheep-alive | situation-trick | answer_mismatch | 9 | 8 sheep. |
| probe/situation-two-fathers | situation-trick | answer_mismatch | 3 | 4 people. |
| probe/situation-water-litre-mass | situation-trick | answer_mismatch | the same | the litre |
| probe/sort-crate | ordering | answer_mismatch | crane,crank,crate,craze | crane, crank, crate, craz. |
| probe/sort-length-crate | ordering | answer_mismatch | crane,crank,crate,craze | craz, crate, crane, crank. |
| probe/sort-length-pear | ordering | answer_mismatch | fig,pear,apple,banana | fig, pear, apple, banana. |
| probe/sort-length-three | ordering | answer_mismatch | one,two,four,three | one, two, four, three. |
| probe/sort-pear | ordering | answer_mismatch | apple,banana,fig,pear | apple, banana, fig, pear. |
| probe/sort-three | ordering | answer_mismatch | four,one,three,two | four, one, three, two. |
| probe/word-count-11-small | word-count | answer_match | 11 | 11 words. |
| probe/word-count-12-the | word-count | answer_match | 12 | 12. |
| probe/word-count-13-plan | word-count | answer_match | 13 | 13 words. |
| probe/words-with-r-plan | word-count | answer_match | 3 | 3 words. |
| probe/words-with-r-small | word-count | answer_match | 1 | 1 words. |
| probe/words-with-r-the | word-count | answer_match | 4 | 4 words. |

The probe suite is a loss detector for the language and code substrate, not a score of the compilation task: a checkpoint that passes fewer probes than the untuned base has lost general capability while gaining SOP Lang syntax, which is the signal `DS009` uses to change the mixture or the recipe.

## Distribution of the answers

- answer_match: 30
- answer_mismatch (answered): 18
- execution_error: 1
