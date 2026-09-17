# Explanation 38.16 — Run-length coding and when it compresses

## Explanation

1. Run-length coding replaces a run by a count followed by the repeated symbol, so the original of 4 symbols becomes 4A.
2. The code has 2 characters against 4 in the original, so it is shorter and does compress.

Reference solution as printed in the source (chapter 38, 4 steps):

1. The original contains four As.
2. The code uses the digit 4 and the letter A: two characters.
3. 2<4.
4. In this case the representation is shorter.

## Result

**Answer.** Yes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
