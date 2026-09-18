# Explanation 7.8.7 — Successive percentage changes

## Explanation

1. The first change increases 1700 service units by 10% of that value, which gives 1870 service units and is the base the second percentage sees.
2. The second change reduces the new base by 5%, so the final value is 1776.5 service units rather than the original value changed once.
3. Applying '+10% - 5%' once to 1700 service units instead gives 1785 service units, so the two methods differ by the original value times 50/10000, which is 8.5 service units.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 1700 × (1 + 10/100) = 1870 service units.
2. The second percentage applies to that new base: 1870 × (1 − 5/100) = 1776.5 service units.
3. The shortcut would give 1700 × [1 + (10−5)/100] = 1785. The absolute difference is 8.5 service units.
4. Because the difference is greater than 1 service units, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 1776.5 service units. The simplified method gives 1785, a difference of 8.5 service units, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
