# Explanation 28.15 — A code that must contain a given digit

## Explanation

1. All 3-digit codes over 3 choices number 9.
2. Codes without the digit 1 use only the other 2 digits, giving 4.
3. Keeping the codes that contain 1 at least once leaves 5.

Reference solution as printed in the source (chapter 28, 4 steps):

1. There are 3×3=9 total codes.
2. It is easier to count codes with no 1 at all.
3. Each position then has only 2 or3: 2×2=4.
4. 9−4=5 contain at least one 1.

## Result

**Answer.** 5 codes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
