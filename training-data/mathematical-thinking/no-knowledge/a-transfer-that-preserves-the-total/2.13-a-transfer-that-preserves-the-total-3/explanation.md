# Explanation 2.13 — A Transfer That Preserves the Total 3

## Explanation

1. Box A gives away 4 tokens and Box B receives exactly those 4 tokens, so nothing is created or lost.
2. Box A goes from 11 to 11 - 4 = 7, and Box B goes from 9 to 9 + 4 = 13.
3. The conserved total is 11 + 9 = 20, and the same total is 7 + 13, which is the check that the transfer was counted correctly.

Reference solution as printed in the source (chapter 2, 4 steps):

1. A has 11-4=7 left.
2. B receives 9+4=13.
3. Initial total: 11+9=20.
4. Final total: 7+13=20. It is the same, so the transfer was modeled correctly.

## Result

**Answer.** A=7, B=13, total=20.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
