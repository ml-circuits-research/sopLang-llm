# Explanation 2.12 — A Transfer That Preserves the Total 2

## Explanation

1. Box A gives away 3 tokens and Box B receives exactly those 3 tokens, so nothing is created or lost.
2. Box A goes from 10 to 10 - 3 = 7, and Box B goes from 7 to 7 + 3 = 10.
3. The conserved total is 10 + 7 = 17, and the same total is 7 + 10, which is the check that the transfer was counted correctly.

Reference solution as printed in the source (chapter 2, 4 steps):

1. A has 10-3=7 left.
2. B receives 7+3=10.
3. Initial total: 10+7=17.
4. Final total: 7+10=17. It is the same, so the transfer was modeled correctly.

## Result

**Answer.** A=7, B=10, total=17.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
