# Explanation 23.18 — Information from the absence of a result

## Explanation

1. A failed test is information: the key does not open that box, so that box leaves the list of possibilities.
2. After removing A the remaining possibilities are B or C, which is more than one, so the exact box is not yet known.

Reference solution as printed in the source (chapter 23, 4 steps):

1. The rule says there is exactly one matching box.
2. The failed test shows that A is not that box.
3. B and C remain.
4. With two possibilities left, we cannot yet identify the exact box.

## Result

**Answer.** We know it is not A; it could be B or C.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
