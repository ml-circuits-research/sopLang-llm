# Explanation 35.16 — Can the battery support the duration?

## Explanation

1. 4 complete hours at 6 units per hour would need 6 × 4 = 24 units.
2. The battery holds only 20 units.
3. Because 24 is greater than 20, the battery cannot support the whole duration.

Reference solution as printed in the source (chapter 35, 4 steps):

1. Four hours would require 6×4=24.
2. Only 20 are available.
3. 20<24.
4. The resource is insufficient for 4 complete hours.

## Result

**Answer.** No.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
