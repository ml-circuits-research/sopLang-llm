# Explanation 36.25 — Intuitive dimensional check

## Explanation

1. The wanted unit is kilometers, and the given units are km/h and h.
2. Multiplying (km/h) × h lets the hours cancel and leaves km, while adding km/h + h would combine different units.
3. So the correct operation is 5 × 3, giving 15 km.

Reference solution as printed in the source (chapter 36, 4 steps):

1. Multiplication allows the h units to cancel: km/h×h=km.
2. Addition would mix a rate with a time.
3. Numerically, 5×3=15.
4. The units confirm the operation.

## Result

**Answer.** 5×3=15 km.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
