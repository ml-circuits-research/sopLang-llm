# Explanation 4.10.7 — Network Routes and Bottlenecks

## Explanation

1. The measurements are decomposed into three route summaries: Route A takes 37 minutes and is limited by its narrowest link at 55 units, so it is feasible for a flow of 51 within 42 minutes; Route B takes 31 minutes and is limited by its narrowest link at 51 units, so it is feasible for a flow of 51 within 42 minutes; Route C takes 42 minutes and is limited by its narrowest link at 56 units, so it is feasible for a flow of 51 within 42 minutes.
2. The two meanings are aggregated separately: the sequential link times add up, while the serial link capacities take a minimum because the narrowest link caps the whole route.
3. The shared constraints then filter the whole-route summaries, and among the feasible routes Route B is the fastest at 31 minutes, so it is the answer; the sum of link capacities is a distractor.

## Result

**Answer.** Choose Route B. The decomposition uses different aggregation operators for different meanings: sequential times add, serial capacities take a minimum, then shared constraints filter entire-route summaries.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
