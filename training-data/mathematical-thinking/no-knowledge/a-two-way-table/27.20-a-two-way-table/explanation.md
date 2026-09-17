# Explanation 27.20 — A two-way table

## Explanation

1. A two-way table is indexed by two labels, so a question about an intersection is a lookup and not an addition.
2. Following row Dan to column Monday lands on the single cell 4.

Reference solution as printed in the source (chapter 27, 4 steps):

1. Select the Dan row.
2. Then select the Monday column.
3. Their common cell contains 4.
4. We do not add other cells because the question asks for one intersection.

## Result

**Answer.** 4.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
