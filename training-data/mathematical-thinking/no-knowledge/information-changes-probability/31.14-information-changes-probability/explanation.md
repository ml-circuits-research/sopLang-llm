# Explanation 31.14 — Information changes probability

## Explanation

1. New information does not rescale the chances; it removes every outcome that is now known to be impossible and leaves the rest equally likely.
2. The outcomes left after learning the number is greater than 2 are 3, 4, a space of 2.
3. The value 4 is one of them, so the conditional probability is 1/2, that is 1/2.

Reference solution as printed in the source (chapter 31, 4 steps):

1. The information eliminates 1 and2.
2. Only 3 and4 remain.
3. The outcomes that were initially equally likely remain equally likely after this restriction.
4. One of the two is 4.

## Result

**Answer.** 1/2.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
