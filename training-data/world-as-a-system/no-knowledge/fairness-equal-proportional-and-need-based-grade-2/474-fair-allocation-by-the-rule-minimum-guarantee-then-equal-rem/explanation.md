# Explanation 474 — Fair allocation by the rule: minimum guarantee then equal remainder

## Explanation

1. The minimum-guarantee principle pays each district its 5-unit floor first, using 15 units of the fund.
2. The remainder 40 − 15 = 25 is split equally, adding 8.33 to each floor.
3. The resulting allocation is A=13.33, B=13.33, C=13.33.

Reference solution as printed in the source (family N20, 4 steps):

1. Minimum guarantees use 15 units.
2. Remainder=40-15=25.
3. Each gets an additional 8.33.
4. Allocation result: A=13.33, B=13.33, C=13.33.

## Result

**Answer.** A=13.33, B=13.33, C=13.33.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
