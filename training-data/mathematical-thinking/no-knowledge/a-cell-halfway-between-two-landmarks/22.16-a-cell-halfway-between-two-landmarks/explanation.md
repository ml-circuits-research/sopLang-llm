# Explanation 22.16 — A cell halfway between two landmarks

## Explanation

1. Being equally far from both landmarks means the two distances to the ends must be equal, so the middle column is their average.
2. Averaging columns 2 and 6 gives column 4.

Reference solution as printed in the source (chapter 22, 4 steps):

1. There are 6−2=4 column steps from A to C.
2. Half of 4 is 2.
3. Moving 2 columns from column 2 gives column 4.
4. Check: the distances 4−2 and 6−4 are both 2.

## Result

**Answer.** Column 4.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
