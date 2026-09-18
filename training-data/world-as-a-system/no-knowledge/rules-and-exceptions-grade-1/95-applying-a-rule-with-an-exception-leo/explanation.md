# Explanation 95 — Applying a rule with an exception: Leo

## Explanation

1. The exception is checked first: during an evacuation drill nobody may enter, so it overrides ordinary eligibility.
2. The evacuation drill is active here, so the exception decides the case and the conditions of the general rule need not be examined.

Reference solution as printed in the source (family C1, 2 steps):

1. The evacuation exception applies and overrides ordinary eligibility.
2. Therefore entry is not allowed.

## Result

**Answer.** No, Leo may not enter.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
