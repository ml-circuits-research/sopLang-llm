# Capability probes — text-probes-exp-005-direct

Suite `text-reasoning-probes-1.0.0`, 49 probes, **0/49 passed**, served artifact `/home/salboaie/work/sopLang-llm/evaluation/registry/exp-005-sft-widened/gguf/checkpoint-360.gguf`.

| kind | passed | items |
| --- | --- | --- |
| character-count | 0 | 16 |
| string-transform | 0 | 8 |
| word-count | 0 | 9 |
| situation-trick | 0 | 10 |
| ordering | 0 | 6 |

| probe | kind | class | expected | answer |
| --- | --- | --- | --- | --- |
| probe/count-assessment-s | character-count | answer_mismatch | 4 | The word "assessment" contains 2 occurrences of the letter " |
| probe/count-banana-a | character-count | answer_mismatch | 3 | The word is "banana", and the letter is "a". There are 3 occ |
| probe/count-bookkeeper-o | character-count | answer_mismatch | 2 | The word "bookkeeper" contains 2 occurrences of "o". |
| probe/count-committee-t | character-count | answer_mismatch | 2 | The word "committee" contains 3 occurrences of the letter "t |
| probe/count-congratulations-r | character-count | answer_mismatch | 1 | The word "congratulations" contains 2 occurrences of the let |
| probe/count-mississippi-s | character-count | answer_mismatch | 4 | The word "mississippi" contains the letter "s" 2 times. |
| probe/count-necessary-e | character-count | answer_mismatch | 2 | The word is necessary, and the letter appears twice. |
| probe/count-parallel-l | character-count | answer_mismatch | 3 | The word is "parallel", and the letter is "l". There are 2 o |
| probe/count-raspberry-r | character-count | answer_mismatch | 3 | The word "raspberry" contains 2 occurrences of the letter "r |
| probe/count-receive-e | character-count | answer_mismatch | 3 | The word is "receive", and the letter is "e". There are 2 oc |
| probe/count-refrigerator-r | character-count | answer_mismatch | 4 | The word "refrigerator" contains 4 occurrences of the letter |
| probe/count-strawberry-r | character-count | answer_mismatch | 3 | The word "strawberry" contains 2 occurrences of the letter " |
| probe/count-text-a-man-a-a | character-count | answer_mismatch | 10 | To count the occurrences of the letter "a" in the sentence " |
| probe/count-text-raspberry-raisins-are-r | character-count | answer_mismatch | 7 | To count the occurrences of the letter "r" in the sentence " |
| probe/count-text-she-sells-sea-s | character-count | answer_mismatch | 8 | To count the occurrences of the letter "s" in the sentence " |
| probe/count-text-the-quick-brown-o | character-count | answer_mismatch | 4 | To count the occurrences of the letter "o" in the sentence " |
| probe/every-second-banana | string-transform | answer_mismatch | bnn | banana |
| probe/every-second-compiler | string-transform | answer_mismatch | cmie | compiler |
| probe/every-second-deterministic | string-transform | answer_mismatch | dtriitc | deterministic |
| probe/every-second-strawberry | string-transform | answer_mismatch | srwer | strawberr |
| probe/longest-word-plan | word-count | answer_mismatch | executed | The word that stands most at the end of the sentence is "the |
| probe/longest-word-small | word-count | answer_mismatch | compiles | the large model |
| probe/longest-word-the | word-count | answer_mismatch | carefully | count |
| probe/reverse-banana | string-transform | answer_mismatch | ananab | banana |
| probe/reverse-compiler | string-transform | answer_mismatch | relipmoc | Compiler |
| probe/reverse-deterministic | string-transform | answer_mismatch | citsinimreted | deterministic |
| probe/reverse-strawberry | string-transform | answer_mismatch | yrrebwarts | strawberry |
| probe/situation-bat-and-ball | situation-trick | answer_mismatch | 0.05 | 1. First, let's define what "cost" means. In this case, it c |
| probe/situation-clock-quarter | situation-trick | answer_mismatch | 30 | To find the duration between two clock times, you subtract t |
| probe/situation-half-double | situation-trick | answer_mismatch | 8 | 8 × 2 = 16 16 ÷ 2 = 8 |
| probe/situation-kg-feathers-iron | situation-trick | answer_mismatch | the same | Iron  The iron is heavier than the air. The weight of the ob |
| probe/situation-months-28-days | situation-trick | answer_mismatch | 12 | To determine how many months of the year have at least 28 da |
| probe/situation-palindrome-word | situation-trick | answer_mismatch | level | level, lever, loved, liver |
| probe/situation-race-overtake | situation-trick | answer_mismatch | 2 | I am in third place. |
| probe/situation-sheep-alive | situation-trick | answer_mismatch | 9 | The farmer has 17 - 9 = 8 sheep left. |
| probe/situation-two-fathers | situation-trick | answer_mismatch | 3 | Three people are sharing the apples. |
| probe/situation-water-litre-mass | situation-trick | answer_mismatch | the same | The litre.  The kilogram is a smaller unit of weight than th |
| probe/sort-crate | ordering | answer_mismatch | crane,crank,crate,craze | crane, crate, hum, toss. |
| probe/sort-length-crate | ordering | answer_mismatch | crane,crank,crate,craze | The sorted words are: crate, crane, crank, craze. |
| probe/sort-length-pear | ordering | answer_mismatch | fig,pear,apple,banana | {   "words": [     "pear",     "apple",     "fig",     "bana |
| probe/sort-length-three | ordering | answer_mismatch | one,two,four,three | three, one, four, two |
| probe/sort-pear | ordering | answer_mismatch | apple,banana,fig,pear | pear, apple, fig, banana |
| probe/sort-three | ordering | answer_mismatch | four,one,three,two | Three, one, four, two. |
| probe/word-count-11-small | word-count | answer_mismatch | 11 | 4 |
| probe/word-count-12-the | word-count | answer_mismatch | 12 | Count the words in this sentence carefully and reply with th |
| probe/word-count-13-plan | word-count | answer_mismatch | 13 | 20 |
| probe/words-with-r-plan | word-count | answer_mismatch | 3 | The sentence is: "A plan is executed by the runtime and its  |
| probe/words-with-r-small | word-count | answer_mismatch | 1 | To count the number of words containing the letter "r" in th |
| probe/words-with-r-the | word-count | answer_mismatch | 4 | Count the words in this sentence carefully and reply with th |

The probe suite is a loss detector for the language and code substrate, not a score of the compilation task: a checkpoint that passes fewer probes than the untuned base has lost general capability while gaining SOP Lang syntax, which is the signal `DS009` uses to change the mixture or the recipe.

## Distribution of the answers

- answer_mismatch (answered): 49
