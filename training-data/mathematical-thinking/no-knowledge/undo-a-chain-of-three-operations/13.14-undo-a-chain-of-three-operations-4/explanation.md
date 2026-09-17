# Explanation 13.14 — Undo a Chain of Three Operations 4

## Explanation

1. The number starts unknown and the chain applies +7, then -5, then +8 to reach 32.
2. Working backward means undoing the operations from right to left, each with its opposite operation.
3. Undoing the chain one step at a time brings 32 back to the starting value 22.
4. Checking forward, applying the chain to 22 ends exactly at 32.

Reference solution as printed in the source (chapter 13, 4 steps):

1. Undo +8: 32-8=24.
2. Undo −5 by applying +5: 24+5=29.
3. Undo +7 by applying −7: 29-7=22.
4. Forward check: 22+7-5+8=32.

## Result

**Answer.** 22

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
