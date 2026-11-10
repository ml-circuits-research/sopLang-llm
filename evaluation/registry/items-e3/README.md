# Experiment E3 items: book problems in procedural wording

Built by `article/experiments/build-procedural-rewrites.mjs` for experiment E3 of `article/experiments/no-training-plan.md`. No model was run to build these files.

## Construction

- Sources: the 100 held-out scheduling problems of `training-data/decompose-to-solve/eval/no-knowledge/dependency-chain-and-join/*` and the 20 held-out coalition problems of `training-data/world-as-a-system/eval/no-knowledge/negotiation-coalitions-and-agreement-grade-{1..4}/*`. `original.jsonl` holds their statements unchanged (the `problem.md` body after the heading, trailing newline removed).
- Rewrites: each book statement is parsed with a strict pattern of the book wording, and the values are rendered by the `statement()` of the procedural family that teaches the shape in `teacher/procedural/bookshapes.mjs` (`dependency-chain-join`, `minimal-winning-coalition`), so the rewrite is that training template word for word. The book's "Knowledge context" and "Rules" paragraphs of the coalition items and the "safety or review buffer" wording of the scheduling items are replaced by the template's own sentences; no number changes.
- Oracle: both wordings keep the book item's manifest oracle (data version 13), for example `46 minutes: not feasible.` and `AB with 8 seats; AC with 8 seats; BC with 6 seats.`. The procedural types' own answer sentences ("The earliest safe completion time is 46 minutes, so the plan is not feasible. ...") are not the oracle; the restricted parsers of the evaluation read the values.
- Row shape: `book`, `folder` (the book folder for `original`, the book folder plus `-procedural` for the rewrite), `plan` (null), `category`, `statement`, `oracle`, `split` (`held-out-scheduling` or `held-out-coalition`, so `evaluation/run-items.mjs` summarises the two types separately), `type` (the procedural family), and `rung` (`original` or `procedural`).

## Checks (`checks.json`)

- The earliest safe completion time (A + max(B, C) + D + E + buffer) and the verdict (time <= limit), computed here and by the procedural family's `solve`, equal the minutes and the verdict of the oracle.
- The minimal winning coalitions (bitmask enumeration: winning when the seats reach the threshold, minimal when removing any member loses) and their seat counts, computed here and by the procedural family's `solve`, equal the oracle list in order.
- The procedural family's `parse` recovers exactly the book values from the rewrite, and the rewrite states exactly the numbers of the source statement, with multiplicity.

## Counts

| file | scheduling | coalition | total |
| --- | --- | --- | --- |
| original.jsonl | 100 | 20 | 120 |
| procedural.jsonl | 100 | 20 | 120 |

Check failures: 0.

## Known limitations

- The book package durations range from 5 to 18 minutes (216 of 500 durations exceed 12), the buffers from 3 to 10 minutes, and the limits from 36 to 80 minutes, while the procedural sampler draws durations of 3 to 12 minutes and buffers of 2 to 6 minutes, so the rewrite keeps the template wording but not the number range the template was trained on.
- Some coalition items have a single-group minimal winning coalition (for example `A with 6 seats.`); the book says "Any two groups may cooperate" and the procedural template does not, which does not change the answer.

## Examples

- `decompose-to-solve/eval/no-knowledge/dependency-chain-and-join/1.1.4-dependency-chain-and-join`, oracle `46 minutes: not feasible.`

  original:

  > Five work packages A–E must be completed. A takes 7 minutes. B (11 min) and C (17 min) can start only after A but may then run in parallel. D (6 min) needs both B and C finished. E (12 min) follows D. A final safety or review buffer of 4 minutes is mandatory, and the completion limit is 43 minutes.
  > 
  > Question. What is the earliest safe completion time, and does the plan meet the limit?

  procedural:

  > A project runs five work packages in a chain. A takes 7 minutes. B (11 min) and C (17 min) can start only after A but may then run in parallel. D (6 min) needs both B and C finished. E (12 min) follows D. A final safety buffer of 4 minutes is mandatory, and the completion limit is 43 minutes. What is the earliest safe completion time, and is the plan feasible?

- `decompose-to-solve/eval/no-knowledge/dependency-chain-and-join/9.9.4-dependency-chain-and-join`, oracle `54 minutes: not feasible.`

  original:

  > Five work packages A–E must be completed. A takes 7 minutes. B (8 min) and C (12 min) can start only after A but may then run in parallel. D (18 min) needs both B and C finished. E (9 min) follows D. A final safety or review buffer of 8 minutes is mandatory, and the completion limit is 48 minutes.
  > 
  > Question. What is the earliest safe completion time, and does the plan meet the limit?

  procedural:

  > A project runs five work packages in a chain. A takes 7 minutes. B (8 min) and C (12 min) can start only after A but may then run in parallel. D (18 min) needs both B and C finished. E (9 min) follows D. A final safety buffer of 8 minutes is mandatory, and the completion limit is 48 minutes. What is the earliest safe completion time, and is the plan feasible?

- `world-as-a-system/eval/no-knowledge/negotiation-coalitions-and-agreement-grade-1/226-coalition-formation-case-1`, oracle `AB with 8 seats; AC with 8 seats; BC with 6 seats.`

  original:

  > Knowledge context. In representative bodies, groups may need to cooperate to reach a decision threshold.
  > 
  > Given facts. Three groups have seats A=5, B=3, C=3. A governing coalition needs at least 6 seats. Any two groups may cooperate.
  > 
  > Rules. A coalition is winning if the sum of its members’ seats reaches the threshold. Minimal winning means it is winning but removing any member makes it lose.
  > 
  > Task. Which coalitions are minimal winning coalitions?

  procedural:

  > A council has three groups: A=5, B=3, C=3. A governing coalition needs at least 6 seats. A coalition is winning when the seats of its members reach the threshold, and a minimal winning coalition is winning but removing any member makes it lose. Which coalitions are minimal winning coalitions?

- `world-as-a-system/eval/no-knowledge/negotiation-coalitions-and-agreement-grade-4/980-coalition-formation-case-5`, oracle `AB with 15 seats; AC with 10 seats; BC with 9 seats.`

  original:

  > Knowledge context. In representative bodies, groups may need to cooperate to reach a decision threshold.
  > 
  > Given facts. Three groups have seats A=8, B=7, C=2. A governing coalition needs at least 9 seats. Any two groups may cooperate.
  > 
  > Rules. A coalition is winning if the sum of its members’ seats reaches the threshold. Minimal winning means it is winning but removing any member makes it lose.
  > 
  > Task. Which coalitions are minimal winning coalitions?

  procedural:

  > A council has three groups: A=8, B=7, C=2. A governing coalition needs at least 9 seats. A coalition is winning when the seats of its members reach the threshold, and a minimal winning coalition is winning but removing any member makes it lose. Which coalitions are minimal winning coalitions?
