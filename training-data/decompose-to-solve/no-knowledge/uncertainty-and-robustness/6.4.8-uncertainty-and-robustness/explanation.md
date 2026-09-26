# Explanation 6.4.8 — Uncertainty and Robustness

## Explanation

1. The average forecast of 76 votes or seats is widened first by the ±15% error bound, which gives the high forecast 87.4.
2. The 5% safety policy is applied to that high forecast and not to the average, so the robust requirement is 91.8.
3. Option A's capacity 87 falls short of 91.8, and Option B's capacity 113 reaches 91.8.
4. Comparing costs only among the options that satisfy the rule, Option B at cost 147 is the cheapest, so it is the robust choice.
5. The robust capacity requirement is 91.8, and Option B is the lowest-cost option that meets it. The uncertainty interval and safety policy are separate transformations, which prevents double-counting the margin.

**Source answer.** The robust capacity requirement is 91.8, and Option B is the lowest-cost option that meets it. The uncertainty interval and safety policy are separate transformations, which prevents double-counting the margin. — the source prints the answer in a prose sentence; the shipped answer keeps only the value-bearing tokens, and the removed prose moves into the explanation. The shipped answer is computed from the statement, and this example is `computed_verified` rather than `exact_verified`.

## Result

**Answer.** 91.8 units: Option B.

**Verification.** computed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
