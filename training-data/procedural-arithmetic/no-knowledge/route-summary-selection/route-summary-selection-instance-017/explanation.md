# Explanation route-summary-selection-17 — Route Summary Selection

## Explanation

1. The goods are decomposed into three route summaries: Route A takes 17 minutes and is limited by its narrowest link at 4 units, so it is feasible for a flow of 4 within 19 minutes; Route B takes 21 minutes and is limited by its narrowest link at 5 units, so it is not feasible for a flow of 4 within 19 minutes; Route C takes 12 minutes and is limited by its narrowest link at 2 units, so it is not feasible for a flow of 4 within 19 minutes.
2. The two meanings are aggregated separately: the sequential link times add up, while the serial link capacities take a minimum because the narrowest link caps the whole route.
3. The shared constraints then filter the whole-route summaries, and among the feasible routes Route A is the fastest at 17 minutes, so it is the answer.

**Generator provenance.** arithmetic.mjs 1.3.0, family route-summary-selection, instance 17, sampled with seed 20260921 from the latent plan `route-summary-selection`; this example carries no source span because its statement was generated.

## Result

**Answer.** Choose Route A. The decomposition uses different aggregation operators for different meanings: sequential times add, serial capacities take a minimum, then shared constraints filter entire-route summaries.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
