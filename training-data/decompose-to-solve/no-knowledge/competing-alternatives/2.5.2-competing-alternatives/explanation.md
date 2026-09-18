# Explanation 2.5.2 — Competing Alternatives

## Explanation

1. Each option is evaluated on its own: Option A finishes in 78 minutes and costs 251.01 units, while Option B finishes in 53 minutes and costs 142.22 units.
2. Both summaries are checked against the shared constraints of 82 minutes and 260.58 units, and both options are feasible.
3. Comparing the two summaries under the lower-cost preference selects Option B: 142.22 units is the cheaper feasible cost.
4. Interleaving the arithmetic of the two options would hide that the local evaluations are independent; keeping them separate is what makes the comparison trustworthy.

## Result

**Answer.** Choose Option B. The important architecture is “evaluate each option locally, then compare summaries under shared constraints,” rather than interleaving the arithmetic of both options.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
