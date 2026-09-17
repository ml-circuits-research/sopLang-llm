# Explanation 27.19 — Two successive filters on a table

## Explanation

1. Two filters applied one after the other keep a category only when it satisfies the value condition and then the colour condition.
2. The value filter keeps the categories with at least 6, and the colour filter then keeps only the red ones, leaving A.

Reference solution as printed in the source (chapter 27, 4 steps):

1. The numerical filter keeps A and B.
2. C and D are eliminated because their values are below 6.
3. Of A and B, only A is red.
4. The final result is A.

## Result

**Answer.** A.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
