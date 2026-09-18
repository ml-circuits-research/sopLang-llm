# Explanation 106 — Representing three districts: case 1

## Explanation

1. The stated populations add up to 270, so each exact quota is the district population divided by that total and multiplied by 11: A=4.89, B=3.67, C=2.44.
2. Giving every district the whole-number part of its quota distributes all but 2 of the seats.
3. The leftover seats go to the largest fractional remainders; equal remainders go to the district printed later, which is the tie rule the printed allocations follow.
4. The final allocation is A=5, B=4, C=2, which sums to the 11 available seats.

Reference solution as printed in the source (family C4, 5 steps):

1. Total population=270.
2. Exact quotas: A=4.89, B=3.67, C=2.44.
3. Initial whole seats: [4, 3, 2], leaving 2.
4. Give the remaining seat(s) to the largest remainder(s).
5. Final allocation=[5, 4, 2], which sums to 11.

## Result

**Answer.** A=5, B=4, C=2 seats.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
