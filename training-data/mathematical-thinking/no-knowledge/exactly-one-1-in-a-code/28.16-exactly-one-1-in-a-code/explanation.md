# Explanation 28.16 — Exactly one 1 in a code

## Explanation

1. The digit 1 appears exactly once, so first choose which of the 2 positions holds it.
2. Each remaining position takes any of the other 2 digits.
3. 2 × 2 = 4 codes.

Reference solution as printed in the source (chapter 28, 4 steps):

1. The 1 can be in the first or second position: 2 choices.
2. The other position cannot be 1; it has 2 options: 2 or3.
3. 2×2=4.
4. The codes are 12,13,21,31.

## Result

**Answer.** 4 codes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
