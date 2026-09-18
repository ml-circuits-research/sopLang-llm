# Explanation 10.3.8 — Uncertainty and Robustness

## Explanation

1. The average forecast of 138 field activities is widened first by the ±10% error bound, which gives the high forecast 151.8.
2. The 8% safety policy is applied to that high forecast and not to the average, so the robust requirement is 163.9.
3. Option A's capacity 184 reaches 163.9, and Option B's capacity 178 reaches 163.9.
4. Comparing costs only among the options that satisfy the rule, Option A at cost 128 is the cheapest, so it is the robust choice.

## Result

**Answer.** The robust capacity requirement is 163.9, and Option A is the lowest-cost option that meets it. The uncertainty interval and safety policy are separate transformations, which prevents double-counting the margin.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
