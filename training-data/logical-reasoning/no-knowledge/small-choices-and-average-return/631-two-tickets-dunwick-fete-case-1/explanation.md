# Explanation 631 — Two tickets — Dunwick fete — case 1

## Explanation

1. Game One in Dunwick wins 4 on a printed share of the tickets for a stake of 2, so its average return is 2, exactly the stake.
2. Game Two wins 1600 on one ticket in 100 for a stake of 20, so its average return is 16.
3. The comparison is Tess’s: average return is prize times chance, and size of prize is not size of average.
4. The huge prize is rare, which is why Sam’s feeling and Owen’s luck never enter the arithmetic.

Reference solution as printed in the source (section 64, 5 steps):

1. Average return ≈ prize × chance of winning.
2. Game One: 4 × 1/2 = 2, equal to the stake.
3. Game Two: 1600 × 1/100 = 16, less than 20.
4. Size of prize ≠ size of average.
5. Compare fractions, not theatre.

## Result

**Answer.** Game One breaks even on average. Game Two returns 16 on average for a stake of 20, so 80 percent of the stake. The huge prize is rare.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
