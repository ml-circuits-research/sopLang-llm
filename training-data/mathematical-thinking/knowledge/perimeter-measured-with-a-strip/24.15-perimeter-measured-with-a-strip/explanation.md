# Explanation 24.15 — Perimeter measured with a strip

## Explanation

1. The statement names the two side lengths but never states the geometry of a rectangle, so the circuit carries the fact that a rectangle has four sides in two pairs of equal length.
2. Following all four sides once walks 6 cm and 4 cm twice each: 2 × 10 = 20 cm, and the interior needs no strip.

Reference solution as printed in the source (chapter 24, 4 steps):

1. A rectangle has two sides of 6 cm and two of 4 cm.
2. The boundary includes all four segments.
3. 6+4+6+4=20.
4. We measure only the edge, not the interior.

## Result

**Answer.** 20 cm.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
