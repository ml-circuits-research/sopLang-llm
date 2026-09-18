# Explanation 8.5.8 — Uncertainty and Robustness

## Explanation

1. The average forecast of 124 records is widened first by the ±15% error bound, which gives the high forecast 142.6.
2. The 5% safety policy is applied to that high forecast and not to the average, so the robust requirement is 149.7.
3. Option A's capacity 148 falls short of 149.7, and Option B's capacity 173 reaches 149.7.
4. Comparing costs only among the options that satisfy the rule, Option B at cost 157 is the cheapest, so it is the robust choice.

## Result

**Answer.** The robust capacity requirement is 149.7, and Option B is the lowest-cost option that meets it. The uncertainty interval and safety policy are separate transformations, which prevents double-counting the margin.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
