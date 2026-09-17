# Explanation 21.14 — The Missing Number in Two Circles

## Explanation

1. Every child choosing at least one fruit is counted once as apples-only, once as both, and once as pears-only.
2. Those three parts give 5 + 4 + 4 = 13 children, but the group has 15.
3. The counts therefore cannot describe the same group of children, so the data are incompatible.

Reference solution as printed in the source (chapter 21, 4 steps):

1. Of the 9 who choose apples, 4 are also in the pear group, so apples only: 9-4=5.
2. Of the 8 who choose pears, 4 are also in the apple group, so pears only: 8-4=4.
3. Check: 5+4+4=13, not 15.
4. This contradicts the statement that every child chooses at least one. The data cannot all be true simultaneously.

## Result

**Answer.** The data are incompatible; they account for only 13 children.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
