# Explanation 7.8.7 — Network Routes and Bottlenecks

## Explanation

1. The source statements are decomposed into three route summaries: Route A takes 43 minutes and is limited by its narrowest link at 36 units, so it is not feasible for a flow of 41 within 39 minutes; Route B takes 34 minutes and is limited by its narrowest link at 41 units, so it is feasible for a flow of 41 within 39 minutes; Route C takes 48 minutes and is limited by its narrowest link at 39 units, so it is not feasible for a flow of 41 within 39 minutes.
2. The two meanings are aggregated separately: the sequential link times add up, while the serial link capacities take a minimum because the narrowest link caps the whole route.
3. The shared constraints then filter the whole-route summaries, and among the feasible routes Route B is the fastest at 34 minutes, so it is the answer; the sum of link capacities is a distractor.

## Result

**Answer.** Choose Route B. The decomposition uses different aggregation operators for different meanings: sequential times add, serial capacities take a minimum, then shared constraints filter entire-route summaries.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
