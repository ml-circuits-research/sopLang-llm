# Explanation 7.10.1 — Successive percentage changes

## Explanation

1. The first change increases 1100 service units by 10% of that value, which gives 1210 service units and is the base the second percentage sees.
2. The second change reduces the new base by 8%, so the final value is 1113.2 service units rather than the original value changed once.
3. Applying '+10% - 8%' once to 1100 service units instead gives 1122 service units, so the two methods differ by the original value times 80/10000, which is 8.8 service units.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 1100 × (1 + 10/100) = 1210 service units.
2. The second percentage applies to that new base: 1210 × (1 − 8/100) = 1113.2 service units.
3. The shortcut would give 1100 × [1 + (10−8)/100] = 1122. The absolute difference is 8.8 service units.
4. Because the difference is greater than 1 service units, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 1113.2 service units. The simplified method gives 1122, a difference of 8.8 service units, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
