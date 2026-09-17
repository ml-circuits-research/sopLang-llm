# Explanation 29.11 — “Exactly two” does not mean “at least two”

## Explanation

1. "Exactly 2" is an equality, not a minimum, so 2 pressed buttons are required while one more is already too many.
2. The problem says 3 of the 3 buttons are pressed.
3. Since the count does not equal the required value, the gate stays closed.

Reference solution as printed in the source (chapter 29, 4 steps):

1. Count three pressed buttons.
2. The condition requires exactly 2.
3. 3 is greater than 2 but not equal to 2.
4. “Exactly” excludes cases with more.

## Result

**Answer.** No.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
