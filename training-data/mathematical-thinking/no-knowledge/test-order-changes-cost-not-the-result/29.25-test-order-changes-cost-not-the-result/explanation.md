# Explanation 29.25 — Test order changes cost, not the result

## Explanation

1. For a conjunction, one false part is enough to make the whole rule false, so the search can stop as soon as a failing test is found.
2. For the value 3 the comparison fails, and it is also the cheapest test to run.
3. Evaluating the cheap failing comparison first gives the answer without ever running the slow parity test.

Reference solution as printed in the source (chapter 29, 4 steps):

1. For an “and” condition, if one part is false, the whole condition is false.
2. The fast test x>10 for 3 gives false.
3. We can stop without computing parity.
4. The logical result would be the same, but this order saves work.

## Result

**Answer.** Test x>10 first.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
