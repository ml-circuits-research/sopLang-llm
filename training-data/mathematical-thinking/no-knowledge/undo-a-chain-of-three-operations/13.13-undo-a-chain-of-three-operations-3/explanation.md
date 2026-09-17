# Explanation 13.13 — Undo a Chain of Three Operations 3

## Explanation

1. The number starts unknown and the chain applies +5, then -6, then +9 to reach 28.
2. Working backward means undoing the operations from right to left, each with its opposite operation.
3. Undoing the chain one step at a time brings 28 back to the starting value 20.
4. Checking forward, applying the chain to 20 ends exactly at 28.

Reference solution as printed in the source (chapter 13, 4 steps):

1. Undo +9: 28-9=19.
2. Undo −6 by applying +6: 19+6=25.
3. Undo +5 by applying −5: 25-5=20.
4. Forward check: 20+5-6+9=28.

## Result

**Answer.** 20

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
