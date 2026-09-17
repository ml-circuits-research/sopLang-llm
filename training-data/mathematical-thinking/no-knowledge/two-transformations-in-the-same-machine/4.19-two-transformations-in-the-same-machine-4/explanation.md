# Explanation 4.19 — Two Transformations in the Same Machine 4

## Explanation

1. The machine performs add 5 first and then doubles, so the doubling applies to the whole sum 5 + 5.
2. In the printed order the output is (5 + 5) × 2 = 20.
3. Reversing the order doubles the input first and adds 5 afterward: 5 × 2 + 5 = 15.
4. The two results differ because doubling gives back what the addition added, so the order of the two instructions changes the outcome.

Reference solution as printed in the source (chapter 4, 4 steps):

1. Required order: 5+5=10.
2. Then double it: 10+10=20.
3. If we double first: 5+5=10, then add 5: 15.
4. The results are 20 and 15; the order of the instructions matters.

## Result

**Answer.** Correct output: 20; with the reversed order: 15.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
