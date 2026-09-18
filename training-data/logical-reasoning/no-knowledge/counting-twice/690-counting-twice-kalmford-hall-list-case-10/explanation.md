# Explanation 690 — Counting twice — Kalmford hall list — case 10

## Explanation

1. The list in Kalmford names 12 people in choir, 9 in drama, 4 in both, and 3 in neither but in the building.
2. Adding the two groups already counts the 4 people in both twice, so the union is 12 + 9 − 4 + 3 = 20.
3. Una states that correction, while the speaker who reaches 24 leaves the overlap counted twice.
4. Wes preaches about the overlap; the overlap is a number to subtract once.

Reference solution as printed in the source (section 69, 5 steps):

1. |A ∪ B| = |A| + |B| − |A ∩ B|.
2. 12 + 9 − 4 = 17 from the two groups.
3. Plus 3 outside both = 20.
4. Double-counting inflates a house.
5. Draw the overlap; do not preach it.

## Result

**Answer.** 20. Choir plus drama counts the overlap twice unless you subtract it once.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
