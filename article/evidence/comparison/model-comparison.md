# All-model comparison (semantic level)

## Main comparison: the same 115 held-out problems

| Model | Condition | Held-out compositions | Book types | Withheld type |
| --- | --- | --- | --- | --- |
| 0.5B untuned | direct | 9/55 | 5/55 | 0/5 |
| 0.5B untuned | JavaScript | 33/55 | 1/55 | 0/5 |
| 0.5B untuned | SOP Lang in prompt | 4/55 | 2/55 | 0/5 |
| 1.5B untuned | direct | 2/55 | 13/55 | 0/5 |
| 1.5B untuned | JavaScript | 49/55 | 10/55 | 0/5 |
| 1.5B untuned | SOP Lang in prompt | 19/55 | 9/55 | 0/5 |
| 1.7B untuned | direct | 17/55 | 11/55 | 0/5 |
| 1.7B untuned | JavaScript | 45/55 | 10/55 | 4/5 |
| 1.7B untuned | SOP Lang in prompt | 34/55 | 1/55 | 0/5 |
| 0.5B fine-tuned (final data) | SOP Lang | 45/55 | 4/55 | 0/5 |
| 1.5B fine-tuned | SOP Lang | 55/55 | 6/55 | 0/5 |
| 1.7B fine-tuned (compact) | SOP Lang | 55/55 | 32/55 | 0/5 |
| 1.7B fine-tuned (final data) | SOP Lang | 51/55 | 27/55 | 0/5 |
| Haiku 4.5 | direct | 48/55 | 41/55 | 0/5 |
| Haiku 4.5 | JavaScript | 55/55 | 52/55 | 5/5 |
| Haiku 4.5 | SOP Lang in prompt | 55/55 | 47/55 | 5/5 |
| Sonnet 5 | direct | 55/55 | 53/55 | 5/5 |
| Sonnet 5 | JavaScript | 55/55 | 54/55 | 5/5 |
| Sonnet 5 | SOP Lang in prompt | 55/55 | 53/55 | 5/5 |

## Abstraction level and wording: 33 held-out compositions, identical instances in both wordings

| Model | Form | Generator wording | Narrative wording |
| --- | --- | --- | --- |
| 0.5B untuned | Operator plan | 11/33 | 6/33 |
| 0.5B untuned | Plain JavaScript | 22/33 | 13/33 |
| 0.5B untuned | SOP Lang, jsEval | 5/33 | 10/33 |
| 1.5B untuned | Operator plan | 30/33 | 9/33 |
| 1.5B untuned | Plain JavaScript | 30/33 | 19/33 |
| 1.5B untuned | SOP Lang, jsEval | 13/33 | 1/33 |
| 1.7B untuned | Operator plan | 31/33 | 15/33 |
| 1.7B untuned | Plain JavaScript | 26/33 | 26/33 |
| 1.7B untuned | SOP Lang, jsEval | 23/33 | 6/33 |
| Haiku 4.5 | Operator plan | 33/33 | 33/33 |
| Haiku 4.5 | Plain JavaScript | 33/33 | 33/33 |
| Haiku 4.5 | SOP Lang, jsEval | 31/33 | 33/33 |
| Sonnet 5 | Operator plan | 33/33 | 33/33 |
| Sonnet 5 | Plain JavaScript | 33/33 | 33/33 |
| Sonnet 5 | SOP Lang, jsEval | 33/33 | 33/33 |

## Book problems in their own and in the teaching wording (15 scheduling, 15 coalition; same problems)

| Model | Condition | Scheduling, book | Scheduling, procedural | Coalitions, book | Coalitions, procedural |
| --- | --- | --- | --- | --- | --- |
| 1.7B fine-tuned (compact) | SOP Lang | 15/15 | 15/15 | 15/15 | 15/15 |
| 1.7B fine-tuned (final data) | SOP Lang | 0/15 | 15/15 | 15/15 | 15/15 |
| Haiku 4.5 | JavaScript | 15/15 | 15/15 | 15/15 | 15/15 |
| Haiku 4.5 | SOP Lang in prompt | 15/15 | 15/15 | 15/15 | 15/15 |
| Sonnet 5 | JavaScript | 15/15 | 15/15 | 15/15 | 15/15 |
| Sonnet 5 | SOP Lang in prompt | 15/15 | 15/15 | 15/15 | 15/15 |

## Withheld stock type, all 40 problems

| Model | Condition | Correct |
| --- | --- | --- |
| 1.5B untuned | JavaScript | 2/40 |
| 1.7B untuned | JavaScript | 24/40 |
| 1.7B fine-tuned (compact) | SOP Lang | 2/40 |
| 1.7B fine-tuned (final data) | SOP Lang | 0/40 |
| Haiku 4.5 | JavaScript | 40/40 |
| Haiku 4.5 | SOP Lang in prompt | 40/40 |
| Sonnet 5 | JavaScript | 40/40 |
| Sonnet 5 | SOP Lang in prompt | 40/40 |
