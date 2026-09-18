# Explanation 3.8.8 — Uncertainty and Robustness

## Explanation

1. The average forecast of 118 printed copies is widened first by the ±12% error bound, which gives the high forecast 132.16.
2. The 8% safety policy is applied to that high forecast and not to the average, so the robust requirement is 142.7.
3. Option A's capacity 151 reaches 142.7, and Option B's capacity 153 reaches 142.7.
4. Comparing costs only among the options that satisfy the rule, Option A at cost 117 is the cheapest, so it is the robust choice.

## Result

**Answer.** The robust capacity requirement is 142.7, and Option A is the lowest-cost option that meets it. The uncertainty interval and safety policy are separate transformations, which prevents double-counting the margin.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
