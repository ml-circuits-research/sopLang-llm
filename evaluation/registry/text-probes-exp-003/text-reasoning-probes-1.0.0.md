# Capability probes — text-probes-exp-003

Suite `text-reasoning-probes-1.0.0`, 49 probes, **1/49 passed**, served artifact `/home/salboaie/work/sopLang-llm/evaluation/registry/exp-003-sft-lr1e-4/gguf/checkpoint-540.gguf`.

| kind | passed | items |
| --- | --- | --- |
| character-count | 0 | 16 |
| string-transform | 0 | 8 |
| word-count | 1 | 9 |
| situation-trick | 0 | 10 |
| ordering | 0 | 6 |

| probe | kind | class | expected | answer |
| --- | --- | --- | --- | --- |
| probe/count-assessment-s | character-count | answer_mismatch | 4 | 2 |
| probe/count-banana-a | character-count | answer_mismatch | 3 | 2 |
| probe/count-bookkeeper-o | character-count | answer_mismatch | 2 | 4 |
| probe/count-committee-t | character-count | answer_mismatch | 2 | 4 |
| probe/count-congratulations-r | character-count | answer_mismatch | 1 | 2 |
| probe/count-mississippi-s | character-count | answer_mismatch | 4 | 2 |
| probe/count-necessary-e | character-count | answer_mismatch | 2 | 4 |
| probe/count-parallel-l | character-count | answer_mismatch | 3 | 2 |
| probe/count-raspberry-r | character-count | answer_mismatch | 3 | 2 |
| probe/count-receive-e | character-count | answer_mismatch | 3 | 4 |
| probe/count-refrigerator-r | character-count | answer_mismatch | 4 | 2 |
| probe/count-strawberry-r | character-count | answer_mismatch | 3 | 2 |
| probe/count-text-a-man-a-a | character-count | answer_mismatch | 10 | 4 |
| probe/count-text-raspberry-raisins-are-r | character-count | answer_mismatch | 7 | 2 |
| probe/count-text-she-sells-sea-s | character-count | answer_mismatch | 8 | 2 |
| probe/count-text-the-quick-brown-o | character-count | answer_mismatch | 4 | The quick brown fox jumps over the lazy dog |
| probe/every-second-banana | string-transform | answer_mismatch | bnn | bna |
| probe/every-second-compiler | string-transform | answer_mismatch | cmie | cprg |
| probe/every-second-deterministic | string-transform | answer_mismatch | dtriitc | dete |
| probe/every-second-strawberry | string-transform | answer_mismatch | srwer | srtw |
| probe/longest-word-plan | word-count | answer_mismatch | executed | plan |
| probe/longest-word-small | word-count | answer_mismatch | compiles | plan |
| probe/longest-word-the | word-count | answer_mismatch | carefully | count |
| probe/reverse-banana | string-transform | answer_mismatch | ananab | banana |
| probe/reverse-compiler | string-transform | answer_mismatch | relipmoc | Compiler |
| probe/reverse-deterministic | string-transform | answer_mismatch | citsinimreted | determined |
| probe/reverse-strawberry | string-transform | answer_mismatch | yrrebwarts | strawberry |
| probe/situation-bat-and-ball | situation-trick | answer_mismatch | 0.05 | 1.0 2.0 |
| probe/situation-clock-quarter | situation-trick | answer_mismatch | 30 | (12 - 11) * 60 = 300 |
| probe/situation-half-double | situation-trick | answer_mismatch | 8 | 8 * 2 = 16, then 16 / 2 = 8. |
| probe/situation-kg-feathers-iron | situation-trick | answer_mismatch | the same | iron |
| probe/situation-months-28-days | situation-trick | answer_mismatch | 12 | 28 |
| probe/situation-palindrome-word | situation-trick | answer_mismatch | level | level, lever, loved, liver |
| probe/situation-race-overtake | situation-trick | answer_mismatch | 2 | 4 |
| probe/situation-sheep-alive | situation-trick | answer_mismatch | 9 | 18 |
| probe/situation-two-fathers | situation-trick | answer_mismatch | 3 | Three |
| probe/situation-water-litre-mass | situation-trick | answer_mismatch | the same | the litre |
| probe/sort-crate | ordering | answer_mismatch | crane,crank,crate,craze | crate, crane, crank, craze |
| probe/sort-length-crate | ordering | answer_mismatch | crane,crank,crate,craze | crate, crane, crank, craze |
| probe/sort-length-pear | ordering | answer_mismatch | fig,pear,apple,banana | pear, apple, fig, banana |
| probe/sort-length-three | ordering | answer_mismatch | one,two,four,three | three, one, four, two. |
| probe/sort-pear | ordering | answer_mismatch | apple,banana,fig,pear | pear, apple, fig, banana |
| probe/sort-three | ordering | answer_mismatch | four,one,three,two | three, one, four, two. |
| probe/word-count-11-small | word-count | answer_mismatch | 11 | 4 |
| probe/word-count-12-the | word-count | answer_mismatch | 12 | 42 |
| probe/word-count-13-plan | word-count | answer_mismatch | 13 | 4 |
| probe/words-with-r-plan | word-count | answer_mismatch | 3 | 2 |
| probe/words-with-r-small | word-count | answer_mismatch | 1 | 4 |
| probe/words-with-r-the | word-count | answer_match | 4 | 4 |

The probe suite is a loss detector for the language and code substrate, not a score of the compilation task: a checkpoint that passes fewer probes than the untuned base has lost general capability while gaining SOP Lang syntax, which is the signal `DS009` uses to change the mixture or the recipe.

## Distribution of the answers

- answer_match: 1
- answer_mismatch (answered): 48
