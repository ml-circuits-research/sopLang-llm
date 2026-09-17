# Explanation 13.25 — Three Quantities, Three Clues 5

## Explanation

1. The three quantities 14, 18, 22 are used exactly once, so one box gets the smallest, one the middle, and one the largest.
2. The clues say B has more than A and C has less than A, which orders the boxes as C < A < B.
3. Reading the sorted quantities in that order gives A = 18, B = 22, and C = 14.

Reference solution as printed in the source (chapter 13, 3 steps):

1. B must be greater than A, while C must be less than A; therefore A can be neither the smallest nor the largest value.
2. A must be the middle value: 18.
3. B receives the larger value 22, and C the smaller value 14.

## Result

**Answer.** A=18, B=22, C=14.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
