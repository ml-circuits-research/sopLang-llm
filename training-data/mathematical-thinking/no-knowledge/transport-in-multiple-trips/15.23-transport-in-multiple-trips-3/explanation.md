# Explanation 15.23 — Transport in Multiple Trips 3

## Explanation

1. The statement gives the rule: fill whole trips as far as possible, and add one more trip if anybody is left over.
2. 73 people divide into 4 full trips of 18 with 1 people left over.
3. Because any remainder still has to travel, the last group forces one extra trip, giving 5 trips in total.

Reference solution as printed in the source (chapter 15, 4 steps):

1. 18×4=72 people can be transported in 4 full trips.
2. 1 people remain.
3. Because the remainder is nonzero, one more trip is needed.
4. Total: 5 trips; the last carries 1 people.

## Result

**Answer.** 5 trips.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
