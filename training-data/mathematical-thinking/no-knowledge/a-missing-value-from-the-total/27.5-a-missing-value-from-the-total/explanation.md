# Explanation 27.5 — A missing value from the total

## Explanation

1. The total of the table splits into the printed values plus the missing one, and the printed values add up to 13.
2. Taking that part away from the stated total 20 leaves 7 for C.

Reference solution as printed in the source (chapter 27, 4 steps):

1. A and B sum to 5+8=13.
2. The total of all categories is 20.
3. The missing part is 20−13=7.
4. Check: 5+8+7=20.

## Result

**Answer.** 7.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
