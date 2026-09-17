# Explanation 36.21 — Compare two unit prices

## Explanation

1. Totals cannot be compared directly because the offers contain different numbers of objects.
2. Offer A costs 12 ÷ 4 = 3 lei per object, while offer B costs 15 ÷ 6 = 2.5 lei per object.
3. The lower unit price decides the better offer, so the smaller quotient wins.

Reference solution as printed in the source (chapter 36, 4 steps):

1. A: 12÷4=3 lei/object.
2. B: 15÷6=2.5 lei/object.
3. 2.5<3.
4. B is cheaper per unit.

## Result

**Answer.** Offer B.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
