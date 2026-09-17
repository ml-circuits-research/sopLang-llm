# Explanation 2.14 — A Transfer That Preserves the Total 4

## Explanation

1. Box A gives away 2 tokens and Box B receives exactly those 2 tokens, so nothing is created or lost.
2. Box A goes from 12 to 12 - 2 = 10, and Box B goes from 11 to 11 + 2 = 13.
3. The conserved total is 12 + 11 = 23, and the same total is 10 + 13, which is the check that the transfer was counted correctly.

Reference solution as printed in the source (chapter 2, 4 steps):

1. A has 12-2=10 left.
2. B receives 11+2=13.
3. Initial total: 12+11=23.
4. Final total: 10+13=23. It is the same, so the transfer was modeled correctly.

## Result

**Answer.** A=10, B=13, total=23.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
