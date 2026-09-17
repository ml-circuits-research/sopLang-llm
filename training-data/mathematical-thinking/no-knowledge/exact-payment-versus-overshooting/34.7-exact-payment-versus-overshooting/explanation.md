# Explanation 34.7 — Exact payment versus overshooting

## Explanation

1. Only combinations 4a + 6b can be paid, so each amount is tested by checking whether the rest after some 4-coins divides by 6.
2. 10 splits into whole coins while 11 leaves a remainder for every count, because both coin values are even and 11 is odd.
3. So the first amount can be paid exactly and the second cannot.

Reference solution as printed in the source (chapter 34, 4 steps):

1. 10 is obtained directly as 4+6.
2. Every sum of 4s and 6s is a sum of even numbers, so it is even.
3. 11 is odd.
4. Therefore 11 cannot be made exactly.

## Result

**Answer.** 10: yes; 11: no.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
