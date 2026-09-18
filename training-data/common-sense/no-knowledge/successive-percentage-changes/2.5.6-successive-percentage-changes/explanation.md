# Explanation 2.5.6 — Successive percentage changes

## Explanation

1. The first change increases 2200 units by 10% of that value, which gives 2420 units and is the base the second percentage sees.
2. The second change reduces the new base by 10%, so the final value is 2178 units rather than the original value changed once.
3. Applying '+10% - 10%' once to 2200 units instead gives 2200 units, so the two methods differ by the original value times 100/10000, which is 22 units.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 2200 × (1 + 10/100) = 2420 units.
2. The second percentage applies to that new base: 2420 × (1 − 10/100) = 2178 units.
3. The shortcut would give 2200 × [1 + (10−10)/100] = 2200. The absolute difference is 22 units.
4. Because the difference is greater than 1 units, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 2178 units. The simplified method gives 2200, a difference of 22 units, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
