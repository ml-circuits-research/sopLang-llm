# Explanation 37.6 — Median of an ordered list

## Explanation

1. The definition given in the statement sorts the list and takes the middle value.
2. Sorting 9, 2, 5, 1, 7 gives 1, 2, 5, 7, 9, and the middle of the 5 values is 5.

Reference solution as printed in the source (chapter 37, 4 steps):

1. Sort in increasing order.
2. We obtain 1,2,5,7,9.
3. There are 5 values; the third is in the middle.
4. The median is 5.

## Result

**Answer.** 5.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
