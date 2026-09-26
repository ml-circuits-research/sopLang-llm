# Explanation 6.5.8 — Uncertainty and Robustness

## Explanation

1. The average forecast of 117 legal instruments is widened first by the ±15% error bound, which gives the high forecast 134.55.
2. The 10% safety policy is applied to that high forecast and not to the average, so the robust requirement is 148.0.
3. Option A's capacity 142 falls short of 148.0, and Option B's capacity 156 reaches 148.0.
4. Comparing costs only among the options that satisfy the rule, Option B at cost 128 is the cheapest, so it is the robust choice.
5. The robust capacity requirement is 148.0, and Option B is the lowest-cost option that meets it. The uncertainty interval and safety policy are separate transformations, which prevents double-counting the margin.

**Source answer.** The robust capacity requirement is 148.0, and Option B is the lowest-cost option that meets it. The uncertainty interval and safety policy are separate transformations, which prevents double-counting the margin. — the source prints the answer in a prose sentence; the shipped answer keeps only the value-bearing tokens, and the removed prose moves into the explanation. The shipped answer is computed from the statement, and this example is `computed_verified` rather than `exact_verified`.

## Result

**Answer.** 148.0 units: Option B.

**Verification.** computed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
