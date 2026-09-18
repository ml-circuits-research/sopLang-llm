# Explanation 5.3.8 — Uncertainty and Robustness

## Explanation

1. The average forecast of 121 climate observations is widened first by the ±20% error bound, which gives the high forecast 145.2.
2. The 8% safety policy is applied to that high forecast and not to the average, so the robust requirement is 156.8.
3. Option A's capacity 151 falls short of 156.8, and Option B's capacity 177 reaches 156.8.
4. Comparing costs only among the options that satisfy the rule, Option B at cost 102 is the cheapest, so it is the robust choice.

## Result

**Answer.** The robust capacity requirement is 156.8, and Option B is the lowest-cost option that meets it. The uncertainty interval and safety policy are separate transformations, which prevents double-counting the margin.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
