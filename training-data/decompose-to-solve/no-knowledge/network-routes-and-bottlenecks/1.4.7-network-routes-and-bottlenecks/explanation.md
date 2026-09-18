# Explanation 1.4.7 — Network Routes and Bottlenecks

## Explanation

1. The scheduled tasks are decomposed into three route summaries: Route A takes 25 minutes and is limited by its narrowest link at 50 units, so it is feasible for a flow of 50 within 48 minutes; Route B takes 44 minutes and is limited by its narrowest link at 46 units, so it is not feasible for a flow of 50 within 48 minutes; Route C takes 38 minutes and is limited by its narrowest link at 46 units, so it is not feasible for a flow of 50 within 48 minutes.
2. The two meanings are aggregated separately: the sequential link times add up, while the serial link capacities take a minimum because the narrowest link caps the whole route.
3. The shared constraints then filter the whole-route summaries, and among the feasible routes Route A is the fastest at 25 minutes, so it is the answer; the sum of link capacities is a distractor.

## Result

**Answer.** Choose Route A. The decomposition uses different aggregation operators for different meanings: sequential times add, serial capacities take a minimum, then shared constraints filter entire-route summaries.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
