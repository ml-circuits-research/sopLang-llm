# Explanation 30.18 — Scaling and perimeter

## Explanation

1. The statement fixes the relation between side and perimeter: a side of 3 has perimeter 12, so the perimeter is 4 times the side.
2. Doubling all lengths makes the side 6, so the perimeter becomes 24, which is 2 times the original.
3. The perimeter therefore doubles.

Reference solution as printed in the source (chapter 30, 4 steps):

1. The new side is 3×2=6.
2. The new perimeter is 4×6=24.
3. The old perimeter was 12.
4. 24 is twice 12.

## Result

**Answer.** It becomes 24, so it doubles.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
