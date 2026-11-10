# Experiment E2 items: the surface ladder

Built by `article/experiments/build-surface-ladder.mjs` for experiment E2 of `article/experiments/no-training-plan.md`. No model was run to build these files.

## Construction

- Held-out items: the 11 held-out compositions (below-largest-add-rate, above-count-double, below-total-per-unit-subtract-rate, above-largest-add-rate, above-total-modulo, above-total-percent-discount, above-third-largest-percent, keep-below-total-ratio, below-largest-path-exists, below-total-elapsed, below-largest-rectangle-area), 40 problems each, read from `training-data/procedural-arithmetic/eval/no-knowledge/<composition>/*/problem.md` (body after the heading, trailing newline removed) and parsed into slots by the composition family's own `parse`. The oracle is the manifest answer the holdout resolver uses; the build asserts that the family's `render(solve(slots))` and an independent walk of `OPERATORS[*].apply` both reproduce it, and that the family's `statement(slots)` reproduces the shipped statement.
- Controls: 4 trained compositions (above-total-percent, below-total-add-rate, above-largest-per-unit-subtract-rate, above-total-elapsed), 20 fresh instances each, drawn by `sampleInstances` with seed 20260928; statements already present in the training tree are skipped, each control round-trips through `parse`, and the oracle is `render(solve(slots))`, checked against the independent walk.
- Rungs: L0 is the generator statement (identical to the shipped `problem.md` body except that the trailing newline the holdout resolver passes on is removed, for every rung alike); L1 is a paraphrase with the same structure (ledger, step list, report instruction); L2 is book style (scenario, one distractor sentence with an irrelevant number, the operations as narrative prose, the question last); L3 is book style with a single question naming the quantity and no step list. The phrase banks are in `article/experiments/surface-phrases.mjs`; each choice is drawn from a stream seeded by the composition, the instance, and the rung.
- Row shape: `book`, `folder`, `plan` (null), `category`, `statement`, `oracle`, `split` (`held-out` or `trained-control`), `composition`, `rung`, plus `chain`, `slots`, and `distractor`, which the checks and `article/experiments/items.test.mjs` read. `evaluation/run-items.mjs --items` reads only the statement and oracle for the prompt and the score.

## Mechanical checks (`checks.json`)

- `numbers`: the digits in the statement are exactly the slot numbers with multiplicity (the ledger, each stage parameter, the edges and target of a path stage), plus the declared distractor at L2 and L3, which never equals a slot number.
- `threshold`: at least one mention of the threshold reads as the filter's exclusive side ("above T", "greater than T", "discard every entry of T or less" for keepAbove, and the mirror for keepBelow), and no mention reads as the opposite side or an inclusive boundary.
- `parameters`: each stage states its parameter in an unambiguous phrase (factor, fixed charge or deduction, labels per record, divisor, percent, rank ordinal, rectangle width, conversion factor and target unit, path target node and edge list), and the ledger unit is named.
- `numberWords`: L1 to L3 contain no English number word (one, two, twice, double, half, and so on), except the ordinal of the `nthLargest` rank. L0 is exempt, because the generator's own wording says "double it by the factor of N" and is kept verbatim.

## Counts

| rung | items | held-out | trained-control |
| --- | --- | --- | --- |
| L0 | 520 | 440 | 80 |
| L1 | 520 | 440 | 80 |
| L2 | 520 | 440 | 80 |
| L3 | 520 | 440 | 80 |

Check failures: 0.

## Known limitations

- `nthLargest` (above-third-largest-percent) counts repeated values separately, as the generator does. L0 does not say so; L1 and L2 say "rank ... from largest to smallest and take the third", and L3 says "the third-largest of the readings above T", so the tie convention is as implicit as in the original.
- The L3 phrase of a deep chain is a nested noun phrase (for example "the amount left after a fixed deduction of 5 is taken off the number of labels for the sum of the readings below 20 at 3 labels per unit"); it names every stage once, in nesting order, but it is harder to read than the original list.
- The distractor sentence is one of three templates (parking spaces, months of service, a gate number); the distractor for elapsed compositions is a number of months, which is a time unit, and is kept deliberately as a distractor.

## Examples

### L0

- `eval/no-knowledge/above-third-largest-percent/above-third-largest-percent-instance-001-L0` (held-out, above-third-largest-percent), oracle `15 units.`

  > The harbour depot recorded 26, 30, 33, 30, 9 and 5 tickets. Please keep only the records above 20, then take the third largest kept record, then take 50 percent of it. Report the result in tickets.

- `eval/no-knowledge/below-largest-path-exists/below-largest-path-exists-instance-001-L0` (held-out, below-largest-path-exists), oracle `yes.`

  > The market depot recorded 3, 5, 41, 29 and 42 litres. Please keep only the records below 19, then take the largest kept record, then check whether a path exists from that node to node 29 in the edges 5-29, 41-42. Report whether a path exists.

- `control/above-total-percent/001-L0` (trained-control, above-total-percent), oracle `73 units.`

  > The harbour depot recorded 8, 38, 36, 36 and 36 litres. Please keep only the records above 23, then add the kept records, then take 50 percent of it. Report the result in litres.


### L1

- `eval/no-knowledge/above-third-largest-percent/above-third-largest-percent-instance-001-L1` (held-out, above-third-largest-percent), oracle `15 units.`

  > At the harbour warehouse, the stock sheet shows 26, 30, 33, 30, 9 and 5 tickets. Remove the entries that are 20 or lower, then rank the remaining entries from largest to smallest and take the third entry in that ranking, then work out 50 percent of it. Give the result in tickets.

- `eval/no-knowledge/below-largest-path-exists/below-largest-path-exists-instance-001-L1` (held-out, below-largest-path-exists), oracle `yes.`

  > At the market store, the stock sheet shows 3, 5, 41, 29 and 42 litres. Proceed as follows: remove the items that are 19 or higher; next, find the maximum of the remaining items; next, treat it as a node and check whether it can reach node 29 along the undirected links 5-29, 41-42. Say whether a path exists.

- `control/above-total-percent/001-L1` (trained-control, above-total-percent), oracle `73 units.`

  > At the harbour warehouse, the stock sheet shows 8, 38, 36, 36 and 36 litres. Remove the entries that are 23 or lower, then find the sum of the remaining entries, then take 50 percent of that. Give the result in litres.


### L2

- `eval/no-knowledge/above-third-largest-percent/above-third-largest-percent-instance-001-L2` (held-out, above-third-largest-percent), oracle `15 units.`

  > Scenario. During the weekly audit at the harbour store, Tomas listed items of 26, 30, 33, 30, 9 and 5 tickets. The harbour store also has 97 parking spaces, which play no part in this question. To begin, Tomas keeps only the items above 20. Next, the keeper ranks the remaining items from largest to smallest and picks the third item in that order. Finally, the keeper takes 50 percent of that figure. Question. What is the final figure, in tickets?

- `eval/no-knowledge/below-largest-path-exists/below-largest-path-exists-instance-001-L2` (held-out, below-largest-path-exists), oracle `yes.`

  > Scenario. During the weekly audit at the market stockroom, Ines listed items of 3, 5, 41, 29 and 42 litres. The market stockroom also has 36 parking spaces, which play no part in this question. To begin, Ines sets aside every item of 19 or more. Next, the keeper picks out the largest remaining item. Finally, the keeper treats it as a node and checks whether a path connects it to node 29 through the undirected links 5-29, 41-42. Question. Is there such a path?

- `control/above-total-percent/001-L2` (trained-control, above-total-percent), oracle `73 units.`

  > Scenario. During the weekly audit at the harbour store, Mara listed items of 8, 38, 36, 36 and 36 litres. The gate of the harbour store carries the number 39, which is irrelevant here. To begin, Mara keeps only the items above 23. Next, the keeper adds up the items that remain. Finally, the keeper takes 50 percent of that figure. Question. What is the final figure, in litres?


### L3

- `eval/no-knowledge/above-third-largest-percent/above-third-largest-percent-instance-001-L3` (held-out, above-third-largest-percent), oracle `15 units.`

  > Scenario. At the harbour warehouse, Tomas keeps a ledger of items: 26, 30, 33, 30, 9 and 5 tickets. Tomas has worked there for 42 months, which does not affect the items. Question. What is 50 percent of the third-largest of the items above 20? Give the answer in tickets.

- `eval/no-knowledge/below-largest-path-exists/below-largest-path-exists-instance-001-L3` (held-out, below-largest-path-exists), oracle `yes.`

  > Scenario. At the market warehouse, Luca keeps a ledger of items: 3, 5, 41, 29 and 42 litres. The gate of the market warehouse carries the number 27, which is irrelevant here. Question. Is the node whose number is the largest of the items below 19 connected to node 29 through the undirected links 5-29, 41-42?

- `control/above-total-percent/001-L3` (trained-control, above-total-percent), oracle `73 units.`

  > Scenario. At the harbour stockroom, Priya keeps a ledger of readings: 8, 38, 36, 36 and 36 litres. Priya has worked there for 94 months, which does not affect the readings. Question. What is 50 percent of the sum of the readings above 23? Give the answer in litres.

