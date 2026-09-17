# Explanation 24.24 — Adding errors in the worst case

## Explanation

1. Each length may lie 1 cm below or above its measured value, so the first is in 9–11 cm and the second in 19–21 cm.
2. The errors add in the worst case: the smallest total is 9 + 19 = 28 cm and the largest is 11 + 21 = 32 cm.

Reference solution as printed in the source (chapter 24, 4 steps):

1. The first segment may be between 9 and 11 cm.
2. The second may be between 19 and 21 cm.
3. The smallest total occurs when both are minimum: 9+19=28.
4. The largest occurs when both are maximum: 11+21=32.

## Result

**Answer.** Between 28 cm and 32 cm.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
