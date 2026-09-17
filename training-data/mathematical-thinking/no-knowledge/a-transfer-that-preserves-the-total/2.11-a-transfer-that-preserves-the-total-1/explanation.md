# Explanation 2.11 — A Transfer That Preserves the Total 1

## Explanation

1. Box A gives away 2 tokens and Box B receives exactly those 2 tokens, so nothing is created or lost.
2. Box A goes from 9 to 9 - 2 = 7, and Box B goes from 5 to 5 + 2 = 7.
3. The conserved total is 9 + 5 = 14, and the same total is 7 + 7, which is the check that the transfer was counted correctly.

Reference solution as printed in the source (chapter 2, 4 steps):

1. A has 9-2=7 left.
2. B receives 5+2=7.
3. Initial total: 9+5=14.
4. Final total: 7+7=14. It is the same, so the transfer was modeled correctly.

## Result

**Answer.** A=7, B=7, total=14.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
