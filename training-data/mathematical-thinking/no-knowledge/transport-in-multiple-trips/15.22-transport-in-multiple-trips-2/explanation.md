# Explanation 15.22 — Transport in Multiple Trips 2

## Explanation

1. The statement gives the rule: fill whole trips as far as possible, and add one more trip if anybody is left over.
2. 58 people divide into 3 full trips of 15 with 13 people left over.
3. Because any remainder still has to travel, the last group forces one extra trip, giving 4 trips in total.

Reference solution as printed in the source (chapter 15, 4 steps):

1. 15×3=45 people can be transported in 3 full trips.
2. 13 people remain.
3. Because the remainder is nonzero, one more trip is needed.
4. Total: 4 trips; the last carries 13 people.

## Result

**Answer.** 4 trips.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
