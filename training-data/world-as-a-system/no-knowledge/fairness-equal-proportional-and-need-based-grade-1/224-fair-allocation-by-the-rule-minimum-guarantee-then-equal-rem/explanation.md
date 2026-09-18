# Explanation 224 — Fair allocation by the rule: minimum guarantee then equal remainder

## Explanation

1. The minimum-guarantee principle pays each district its 5-unit floor first, using 15 units of the fund.
2. The remainder 35 − 15 = 20 is split equally, adding 6.67 to each floor.
3. The resulting allocation is A=11.67, B=11.67, C=11.67.

Reference solution as printed in the source (family N20, 4 steps):

1. Minimum guarantees use 15 units.
2. Remainder=35-15=20.
3. Each gets an additional 6.67.
4. Allocation result: A=11.67, B=11.67, C=11.67.

## Result

**Answer.** A=11.67, B=11.67, C=11.67.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
