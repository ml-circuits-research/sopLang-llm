# Explanation 4.7.8 — Uncertainty and Robustness

## Explanation

1. The average forecast of 101 field observations is widened first by the ±8% error bound, which gives the high forecast 109.08.
2. The 10% safety policy is applied to that high forecast and not to the average, so the robust requirement is 120.0.
3. Option A's capacity 133 reaches 120.0, and Option B's capacity 126 reaches 120.0.
4. Comparing costs only among the options that satisfy the rule, Option A at cost 101 is the cheapest, so it is the robust choice.

## Result

**Answer.** The robust capacity requirement is 120.0, and Option A is the lowest-cost option that meets it. The uncertainty interval and safety policy are separate transformations, which prevents double-counting the margin.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
