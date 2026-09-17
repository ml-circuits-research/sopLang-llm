# Explanation 13.21 — Three Quantities, Three Clues 1

## Explanation

1. The three quantities 10, 14, 18 are used exactly once, so one box gets the smallest, one the middle, and one the largest.
2. The clues say B has more than A and C has less than A, which orders the boxes as C < A < B.
3. Reading the sorted quantities in that order gives A = 14, B = 18, and C = 10.

Reference solution as printed in the source (chapter 13, 3 steps):

1. B must be greater than A, while C must be less than A; therefore A can be neither the smallest nor the largest value.
2. A must be the middle value: 14.
3. B receives the larger value 18, and C the smaller value 10.

## Result

**Answer.** A=14, B=18, C=10.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
