# Explanation 29.20 — A necessary condition for acceptance

## Explanation

1. Acceptance is the conjunction red AND star, so every accepted object has both properties.
2. red is therefore required and is a necessary condition.
3. It is not sufficient on its own, because an object with red but without star is still not accepted.

Reference solution as printed in the source (chapter 29, 4 steps):

1. Every accepted object must pass both tests.
2. Therefore being red is required: it is necessary.
3. A red object without a star fails the second test.
4. Therefore red alone is not sufficient.

## Result

**Answer.** Necessary, but not sufficient.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
