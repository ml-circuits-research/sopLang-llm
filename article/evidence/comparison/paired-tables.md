# Paired evaluation-only tables (semantic level, exact in parentheses)

## E2 rewording (3 instances per composition, identical at every wording)

| Run | Wording | Held-out | Trained controls |
| --- | --- | --- | --- |
| 0.5B, extended inventory | Original | 18/24 (18) | 9/9 (9) |
| 0.5B, extended inventory | Paraphrase | 4/24 (4) | 5/9 (5) |
| 0.5B, extended inventory | Narrative | 5/24 (3) | 6/9 (5) |
| 1.5B, extended inventory | Original | 24/24 (24) | 9/9 (9) |
| 1.5B, extended inventory | Paraphrase | 16/24 (4) | 7/9 (2) |
| 1.5B, extended inventory | Narrative | 8/24 (4) | 2/9 (0) |
| 1.7B, compact targets | Original | 33/33 (33) | 12/12 (12) |
| 1.7B, compact targets | Paraphrase | 18/33 (13) | 9/12 (8) |
| 1.7B, compact targets | Narrative | 24/33 (20) | 11/12 (9) |

## E8 abstraction level, untuned models (identical instances in both wordings)

| Model | Form | Original held-out | Original controls | Narrative held-out | Narrative controls |
| --- | --- | --- | --- | --- | --- |
| 0.5B | Operator plan | 11/33 (11) | 3/12 (3) | 6/33 (6) | 2/12 (2) |
| 0.5B | Plain JavaScript | 22/33 (3) | 10/12 (2) | 13/33 (2) | 3/12 (0) |
| 0.5B | SOP Lang, jsEval | 5/33 (0) | 7/12 (1) | 10/33 (0) | 7/12 (0) |
| 1.5B | Operator plan | 30/33 (30) | 11/12 (9) | 9/33 (9) | 8/12 (6) |
| 1.5B | Plain JavaScript | 30/33 (10) | 12/12 (2) | 19/33 (7) | 9/12 (2) |
| 1.5B | SOP Lang, jsEval | 13/33 (3) | 4/12 (3) | 1/33 (0) | 1/12 (0) |
| 1.7B | Operator plan | 31/33 (28) | 10/12 (7) | 15/33 (15) | 10/12 (10) |
| 1.7B | Plain JavaScript | 26/33 (6) | 12/12 (6) | 26/33 (2) | 12/12 (3) |
| 1.7B | SOP Lang, jsEval | 23/33 (3) | 12/12 (5) | 6/33 (0) | 5/12 (0) |

## E3 book problems, both wordings (same 15 scheduling and 15 coalition problems)

| Run | Scheduling, book | Scheduling, procedural | Coalitions, book | Coalitions, procedural |
| --- | --- | --- | --- | --- |
| exp017 | 0/15 (0) | 0/15 (0) | 0/15 (0) | 0/15 (0) |
| exp021 | 15/15 (0) | 15/15 (0) | 15/15 (15) | 15/15 (15) |
| exp025 | 8/15 (0) | 15/15 (0) | 7/15 (7) | 15/15 (15) |
| exp027 | 0/15 (0) | 15/15 (0) | 15/15 (3) | 15/15 (15) |
