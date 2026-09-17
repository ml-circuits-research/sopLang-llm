# Explanation 39.3 — “There exists” is proved by a witness

## Explanation

1. An existence claim is proved by exhibiting one element of the domain that satisfies the condition.
2. Testing the elements for division with no remainder by the stated divisor names that witness, which is enough by itself.

Reference solution as printed in the source (chapter 39, 4 steps):

1. 10 leaves remainder 1 when divided by 3.
2. 11 leaves remainder 2.
3. 12=3×4.
4. The example 12 is sufficient for the existential statement.

## Result

**Answer.** 12.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
