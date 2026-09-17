# Explanation 4.20 — Two Transformations in the Same Machine 5

## Explanation

1. The machine performs add 6 first and then doubles, so the doubling applies to the whole sum 6 + 6.
2. In the printed order the output is (6 + 6) × 2 = 24.
3. Reversing the order doubles the input first and adds 6 afterward: 6 × 2 + 6 = 18.
4. The two results differ because doubling gives back what the addition added, so the order of the two instructions changes the outcome.

Reference solution as printed in the source (chapter 4, 4 steps):

1. Required order: 6+6=12.
2. Then double it: 12+12=24.
3. If we double first: 6+6=12, then add 6: 18.
4. The results are 24 and 18; the order of the instructions matters.

## Result

**Answer.** Correct output: 24; with the reversed order: 18.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
