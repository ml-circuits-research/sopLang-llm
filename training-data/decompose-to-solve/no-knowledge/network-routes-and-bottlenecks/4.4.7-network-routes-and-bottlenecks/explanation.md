# Explanation 4.4.7 — Network Routes and Bottlenecks

## Explanation

1. The optical elements are decomposed into three route summaries: Route A takes 33 minutes and is limited by its narrowest link at 57 units, so it is feasible for a flow of 52 within 55 minutes; Route B takes 24 minutes and is limited by its narrowest link at 52 units, so it is feasible for a flow of 52 within 55 minutes; Route C takes 33 minutes and is limited by its narrowest link at 64 units, so it is feasible for a flow of 52 within 55 minutes.
2. The two meanings are aggregated separately: the sequential link times add up, while the serial link capacities take a minimum because the narrowest link caps the whole route.
3. The shared constraints then filter the whole-route summaries, and among the feasible routes Route B is the fastest at 24 minutes, so it is the answer; the sum of link capacities is a distractor.

## Result

**Answer.** Choose Route B. The decomposition uses different aggregation operators for different meanings: sequential times add, serial capacities take a minimum, then shared constraints filter entire-route summaries.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
