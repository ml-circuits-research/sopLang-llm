# Explanation 4.16 — Two Transformations in the Same Machine 1

## Explanation

1. The machine performs add 2 first and then doubles, so the doubling applies to the whole sum 2 + 2.
2. In the printed order the output is (2 + 2) × 2 = 8.
3. Reversing the order doubles the input first and adds 2 afterward: 2 × 2 + 2 = 6.
4. The two results differ because doubling gives back what the addition added, so the order of the two instructions changes the outcome.

Reference solution as printed in the source (chapter 4, 4 steps):

1. Required order: 2+2=4.
2. Then double it: 4+4=8.
3. If we double first: 2+2=4, then add 2: 6.
4. The results are 8 and 6; the order of the instructions matters.

## Result

**Answer.** Correct output: 8; with the reversed order: 6.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
