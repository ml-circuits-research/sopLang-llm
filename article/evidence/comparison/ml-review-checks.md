# Checks for the Machine Learning manuscript review (recomputed from records)

## 1. Rewording, compact-target 1.7B run, on the 24 + 9 items shared with the inventory-era runs

| Wording | Held-out | Trained controls |
| --- | --- | --- |
| Original | 24/24 (100%) | 9/9 (100%) |
| Paraphrase | 15/24 (63%) | 6/9 (67%) |
| Narrative | 17/24 (71%) | 8/9 (89%) |

## 2. Book types of the main comparison (semantic level): taught shapes and the other families

| Condition | Coalition (20) | Scheduling (5) | Other book problems (30) | All book (55) |
| --- | --- | --- | --- | --- |
| 0.5B untuned, direct | 0/20 (0%) | 0/5 (0%) | 5/30 (17%) | 5/55 (9%) |
| 0.5B untuned, JavaScript | 1/20 (5%) | 0/5 (0%) | 0/30 (0%) | 1/55 (2%) |
| 0.5B untuned, SOP Lang in prompt | 0/20 (0%) | 0/5 (0%) | 2/30 (7%) | 2/55 (4%) |
| 1.5B untuned, direct | 0/20 (0%) | 1/5 (20%) | 12/30 (40%) | 13/55 (24%) |
| 1.5B untuned, JavaScript | 4/20 (20%) | 0/5 (0%) | 6/30 (20%) | 10/55 (18%) |
| 1.5B untuned, SOP Lang in prompt | 0/20 (0%) | 0/5 (0%) | 9/30 (30%) | 9/55 (16%) |
| 1.7B untuned, direct | 2/20 (10%) | 0/5 (0%) | 9/30 (30%) | 11/55 (20%) |
| 1.7B untuned, JavaScript | 2/20 (10%) | 0/5 (0%) | 8/30 (27%) | 10/55 (18%) |
| 1.7B untuned, SOP Lang in prompt | 0/20 (0%) | 0/5 (0%) | 1/30 (3%) | 1/55 (2%) |
| 0.5B fine-tuned, final data | 0/20 (0%) | 1/5 (20%) | 3/30 (10%) | 4/55 (7%) |
| 1.5B fine-tuned, declarative-command data | 0/20 (0%) | 0/5 (0%) | 6/30 (20%) | 6/55 (11%) |
| 1.7B fine-tuned, compact targets | 20/20 (100%) | 5/5 (100%) | 7/30 (23%) | 32/55 (58%) |
| 1.7B fine-tuned, final data | 20/20 (100%) | 0/5 (0%) | 7/30 (23%) | 27/55 (49%) |

## 3. SOP Lang taught in the prompt (main comparison, 115 problems): outcome classes

| Model | Parse invalid | Graph invalid | Execution error | Answer mismatch | Match |
| --- | --- | --- | --- | --- | --- |
| 0.5B | 4 | 21 | 4 | 86 | 0 |
| 1.5B | 0 | 41 | 13 | 56 | 5 |
| 1.7B | 1 | 22 | 27 | 61 | 4 |

## 4. Book-wording programs identical to the original held-out evaluation of the same checkpoint

Statements of the scheduling problems changed after some runs were evaluated, so only coalition problems (whose statements never changed) isolate the prompt bytes.

| Run | Newline removed: coalition | Newline removed: scheduling | Newline restored: coalition | Newline restored: scheduling |
| --- | --- | --- | --- | --- |
| exp017 | 2/15 | 0/15 | 13/15 | 0/15 |
| exp021 | 14/15 | 8/15 | 15/15 | 3/15 |
| exp025 | 7/15 | 12/15 | 15/15 | 14/15 |
| exp027 | 15/15 | 4/15 | 15/15 | 12/15 |

## 5. Held-out scheduling answers (100 per run): accepted by the restricted parser, and right but outside its grammar

| Run | Parser accepts | Right duration and verdict, other wording | Right number, unit "work packages" |
| --- | --- | --- | --- |
| exp-021-1.7b-qwen3-dv7 | 64 | 0 | 0 |
| exp-022-1.7b-qwen3-dv8 | 0 | 0 | 0 |
| exp-023-1.7b-qwen3-dv9 | 0 | 18 | 20 |
| exp-024-1.7b-qwen3-dv11 | 2 | 5 | 0 |
| exp-025-1.7b-qwen3-dv12 | 54 | 0 | 0 |
| exp-027-1.7b-qwen3-dv13 | 0 | 0 | 0 |

## 6. Book problems in both wordings with the trailing newline restored (15 per cell; semantic, exact in parentheses)

| Run | Scheduling, book | Scheduling, template | Coalitions, book | Coalitions, template |
| --- | --- | --- | --- | --- |
| exp017 | 0/15 0% (0%) | 0/15 0% (0%) | 0/15 0% (0%) | 0/15 0% (0%) |
| exp021 | 15/15 100% (0%) | 15/15 100% (0%) | 15/15 100% (100%) | 15/15 100% (100%) |
| exp025 | 8/15 53% (0%) | 15/15 100% (0%) | 15/15 100% (100%) | 15/15 100% (100%) |
| exp027 | 0/15 0% (0%) | 15/15 100% (0%) | 15/15 100% (20%) | 15/15 100% (100%) |

## 7. Withheld type, untuned 1.7B model writing SOP Lang from the prompt (40 problems)

Semantic 0/40 (0%); strict value 2/40; exact 0/40. Classes: graph invalid 21 (of which no wire named answer: 20), parse invalid 0, execution error 1, answer mismatch 18.
