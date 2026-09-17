# Explanation 40.17 — Sensors and majority voting

## Explanation

1. With 4 sensors and at most 1 faulty, the two agreeing sensors cannot both be faulty.
2. The majority value is yes, and the faulty sensors can change at most 1 of the answers, so the majority still holds.
3. The value guaranteed correct by majority is Yes.

Reference solution as printed in the source (chapter 40, 4 steps):

1. There are two “yes” answers and one “no.”
2. If “yes” were wrong, two sensors would have to be wrong.
3. But at most one error is allowed.
4. Therefore the true value must be “yes.”

## Result

**Answer.** Yes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
