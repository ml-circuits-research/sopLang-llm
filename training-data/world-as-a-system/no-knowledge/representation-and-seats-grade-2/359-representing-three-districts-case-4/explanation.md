# Explanation 359 — Representing three districts: case 4

## Explanation

1. The stated populations add up to 385, so each exact quota is the district population divided by that total and multiplied by 12: A=5.61, B=3.12, C=3.27.
2. Giving every district the whole-number part of its quota distributes all but 1 of the seats.
3. The leftover seats go to the largest fractional remainders; equal remainders go to the district printed later, which is the tie rule the printed allocations follow.
4. The final allocation is A=6, B=3, C=3, which sums to the 12 available seats.

Reference solution as printed in the source (family C4, 5 steps):

1. Total population=385.
2. Exact quotas: A=5.61, B=3.12, C=3.27.
3. Initial whole seats: [5, 3, 3], leaving 1.
4. Give the remaining seat(s) to the largest remainder(s).
5. Final allocation=[6, 3, 3], which sums to 12.

## Result

**Answer.** A=6, B=3, C=3 seats.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
