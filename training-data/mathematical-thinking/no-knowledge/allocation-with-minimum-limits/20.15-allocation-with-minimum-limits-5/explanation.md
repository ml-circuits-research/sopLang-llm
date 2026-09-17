# Explanation 20.15 — Allocation with Minimum Limits 5

## Explanation

1. All 54 resources are split between A, B, and C, so C receives whatever A and B leave.
2. Every extra resource given to A or B above its minimum takes one resource away from C, so C is largest when A and B sit exactly at their limits.
3. Giving A 18 and B 20 leaves 54 − 18 − 20 = 16 for C.
4. Any other allocation with A ≥ 18 and B ≥ 20 leaves strictly less for C, so 16 is the greatest possible value.

Reference solution as printed in the source (chapter 20, 3 steps):

1. To maximize C, choose the smallest permitted values: A=18, B=20.
2. The remainder is 54-18-20=16.
3. Any increase in A or B would decrease C, so this is the maximum value.

## Result

**Answer.** 16

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
