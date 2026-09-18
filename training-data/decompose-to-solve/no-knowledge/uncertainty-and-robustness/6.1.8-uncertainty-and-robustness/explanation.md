# Explanation 6.1.8 — Uncertainty and Robustness

## Explanation

1. The average forecast of 97 events is widened first by the ±8% error bound, which gives the high forecast 104.76.
2. The 10% safety policy is applied to that high forecast and not to the average, so the robust requirement is 115.2.
3. Option A's capacity 110 falls short of 115.2, and Option B's capacity 142 reaches 115.2.
4. Comparing costs only among the options that satisfy the rule, Option B at cost 138 is the cheapest, so it is the robust choice.

## Result

**Answer.** The robust capacity requirement is 115.2, and Option B is the lowest-cost option that meets it. The uncertainty interval and safety policy are separate transformations, which prevents double-counting the margin.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
