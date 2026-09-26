# Explanation 2.2.2 — Competing Alternatives

## Explanation

1. Each option is evaluated on its own: Option A finishes in 59 minutes and costs 165.48 units, while Option B finishes in 48 minutes and costs 190.56 units.
2. Both summaries are checked against the shared constraints of 63 minutes and 200.42 units, and both options are feasible.
3. Comparing the two summaries under the lower-cost preference selects Option A: 165.48 units is the cheaper feasible cost.
4. Interleaving the arithmetic of the two options would hide that the local evaluations are independent; keeping them separate is what makes the comparison trustworthy.
5. The important architecture is “evaluate each option locally, then compare summaries under shared constraints,” rather than interleaving the arithmetic of both options.

**Source answer.** Choose Option A. The important architecture is “evaluate each option locally, then compare summaries under shared constraints,” rather than interleaving the arithmetic of both options. — the source prints the answer in a prose sentence; the shipped answer keeps only the value-bearing tokens, and the removed prose moves into the explanation. The shipped answer is computed from the statement, and this example is `computed_verified` rather than `exact_verified`.

## Result

**Answer.** Choose Option A.

**Verification.** computed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
