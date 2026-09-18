# Explanation 10.4.8 — Uncertainty and Robustness

## Explanation

1. The average forecast of 135 relief deliveries is widened first by the ±20% error bound, which gives the high forecast 162.
2. The 10% safety policy is applied to that high forecast and not to the average, so the robust requirement is 178.2.
3. Option A's capacity 149 falls short of 178.2, and Option B's capacity 210 reaches 178.2.
4. Comparing costs only among the options that satisfy the rule, Option B at cost 138 is the cheapest, so it is the robust choice.

## Result

**Answer.** The robust capacity requirement is 178.2, and Option B is the lowest-cost option that meets it. The uncertainty interval and safety policy are separate transformations, which prevents double-counting the margin.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
