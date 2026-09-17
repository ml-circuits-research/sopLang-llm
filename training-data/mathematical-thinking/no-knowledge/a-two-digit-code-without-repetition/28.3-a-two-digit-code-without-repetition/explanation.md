# Explanation 28.3 — A two-digit code without repetition

## Explanation

1. The code uses 3 digits and has 2 positions, with no digit repeated.
2. The first position has every digit available, and each later position loses the digits already used.
3. Multiplying the shrinking choices gives 6 codes.

Reference solution as printed in the source (chapter 28, 4 steps):

1. The first position can be 1,2, or3: 3 choices.
2. After choosing the first, 2 allowed digits remain.
3. For each first choice there are 2 continuations.
4. 3×2=6.

## Result

**Answer.** 6 codes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
