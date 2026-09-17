# Explanation 4.17 — Two Transformations in the Same Machine 2

## Explanation

1. The machine performs add 3 first and then doubles, so the doubling applies to the whole sum 3 + 3.
2. In the printed order the output is (3 + 3) × 2 = 12.
3. Reversing the order doubles the input first and adds 3 afterward: 3 × 2 + 3 = 9.
4. The two results differ because doubling gives back what the addition added, so the order of the two instructions changes the outcome.

Reference solution as printed in the source (chapter 4, 4 steps):

1. Required order: 3+3=6.
2. Then double it: 6+6=12.
3. If we double first: 3+3=6, then add 3: 9.
4. The results are 12 and 9; the order of the instructions matters.

## Result

**Answer.** Correct output: 12; with the reversed order: 9.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
