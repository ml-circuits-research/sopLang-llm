# Explanation 7.7.8 — Uncertainty and Robustness

## Explanation

1. The average forecast of 74 measurements is widened first by the ±20% error bound, which gives the high forecast 88.8.
2. The 10% safety policy is applied to that high forecast and not to the average, so the robust requirement is 97.7.
3. Option A's capacity 96 falls short of 97.7, and Option B's capacity 105 reaches 97.7.
4. Comparing costs only among the options that satisfy the rule, Option B at cost 171 is the cheapest, so it is the robust choice.

## Result

**Answer.** The robust capacity requirement is 97.7, and Option B is the lowest-cost option that meets it. The uncertainty interval and safety policy are separate transformations, which prevents double-counting the margin.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
