# Explanation 4.1.7 — Network Routes and Bottlenecks

## Explanation

1. The measurements are decomposed into three route summaries: Route A takes 44 minutes and is limited by its narrowest link at 44 units, so it is feasible for a flow of 35 within 51 minutes; Route B takes 42 minutes and is limited by its narrowest link at 68 units, so it is feasible for a flow of 35 within 51 minutes; Route C takes 41 minutes and is limited by its narrowest link at 35 units, so it is feasible for a flow of 35 within 51 minutes.
2. The two meanings are aggregated separately: the sequential link times add up, while the serial link capacities take a minimum because the narrowest link caps the whole route.
3. The shared constraints then filter the whole-route summaries, and among the feasible routes Route C is the fastest at 41 minutes, so it is the answer; the sum of link capacities is a distractor.
4. The decomposition uses different aggregation operators for different meanings: sequential times add, serial capacities take a minimum, then shared constraints filter entire-route summaries.

**Source answer.** Choose Route C. The decomposition uses different aggregation operators for different meanings: sequential times add, serial capacities take a minimum, then shared constraints filter entire-route summaries. — the source prints the answer in a prose sentence; the shipped answer keeps only the value-bearing tokens, and the removed prose moves into the explanation. The shipped answer is computed from the statement, and this example is `computed_verified` rather than `exact_verified`.

## Result

**Answer.** Choose Route C.

**Verification.** computed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
