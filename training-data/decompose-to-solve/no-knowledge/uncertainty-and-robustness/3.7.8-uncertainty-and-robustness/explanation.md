# Explanation 3.7.8 — Uncertainty and Robustness

## Explanation

1. The average forecast of 62 population groups is widened first by the ±10% error bound, which gives the high forecast 68.2.
2. The 10% safety policy is applied to that high forecast and not to the average, so the robust requirement is 75.0.
3. Option A's capacity 71 falls short of 75.0, and Option B's capacity 81 reaches 75.0.
4. Comparing costs only among the options that satisfy the rule, Option B at cost 163 is the cheapest, so it is the robust choice.
5. The robust capacity requirement is 75.0, and Option B is the lowest-cost option that meets it. The uncertainty interval and safety policy are separate transformations, which prevents double-counting the margin.

**Source answer.** The robust capacity requirement is 75.0, and Option B is the lowest-cost option that meets it. The uncertainty interval and safety policy are separate transformations, which prevents double-counting the margin. — the source prints the answer in a prose sentence; the shipped answer keeps only the value-bearing tokens, and the removed prose moves into the explanation. The shipped answer is computed from the statement, and this example is `computed_verified` rather than `exact_verified`.

## Result

**Answer.** 75.0 units: Option B.

**Verification.** computed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
