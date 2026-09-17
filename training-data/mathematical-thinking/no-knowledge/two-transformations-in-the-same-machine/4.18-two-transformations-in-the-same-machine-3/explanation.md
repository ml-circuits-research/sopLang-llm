# Explanation 4.18 — Two Transformations in the Same Machine 3

## Explanation

1. The machine performs add 4 first and then doubles, so the doubling applies to the whole sum 4 + 4.
2. In the printed order the output is (4 + 4) × 2 = 16.
3. Reversing the order doubles the input first and adds 4 afterward: 4 × 2 + 4 = 12.
4. The two results differ because doubling gives back what the addition added, so the order of the two instructions changes the outcome.

Reference solution as printed in the source (chapter 4, 4 steps):

1. Required order: 4+4=8.
2. Then double it: 8+8=16.
3. If we double first: 4+4=8, then add 4: 12.
4. The results are 16 and 12; the order of the instructions matters.

## Result

**Answer.** Correct output: 16; with the reversed order: 12.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
