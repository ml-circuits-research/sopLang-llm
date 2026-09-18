# Explanation 7.3.8 — Uncertainty and Robustness

## Explanation

1. The average forecast of 61 responses is widened first by the ±10% error bound, which gives the high forecast 67.1.
2. The 5% safety policy is applied to that high forecast and not to the average, so the robust requirement is 70.5.
3. Option A's capacity 67 falls short of 70.5, and Option B's capacity 93 reaches 70.5.
4. Comparing costs only among the options that satisfy the rule, Option B at cost 138 is the cheapest, so it is the robust choice.

## Result

**Answer.** The robust capacity requirement is 70.5, and Option B is the lowest-cost option that meets it. The uncertainty interval and safety policy are separate transformations, which prevents double-counting the margin.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
