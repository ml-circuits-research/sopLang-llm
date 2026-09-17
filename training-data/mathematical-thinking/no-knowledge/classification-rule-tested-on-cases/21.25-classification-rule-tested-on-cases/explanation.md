# Explanation 21.25 — Classification Rule Tested on Cases

## Explanation

1. The machine applies one test: is the number less than 5?
2. Numbers that pass go to box A, and "otherwise" sends every remaining number to box B.
3. Applying the test to 2, 4, 5, 7 gives 2→A, 4→A, 5→B, 7→B.

Reference solution as printed in the source (chapter 21, 4 steps):

1. For 2, the condition 2<5 is true, so A.
2. For 4, 4<5 is true, so A.
3. For 5, 5<5 is false; it goes into the “otherwise” branch, so B.
4. For 7, the condition is false, so B.

## Result

**Answer.** 2→A, 4→A, 5→B, 7→B.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
