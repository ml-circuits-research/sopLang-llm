# Explanation 7.9.4 — Successive percentage changes

## Explanation

1. The first change increases 800 service units by 15% of that value, which gives 920 service units and is the base the second percentage sees.
2. The second change reduces the new base by 15%, so the final value is 782 service units rather than the original value changed once.
3. Applying '+15% - 15%' once to 800 service units instead gives 800 service units, so the two methods differ by the original value times 225/10000, which is 18 service units.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 800 × (1 + 15/100) = 920 service units.
2. The second percentage applies to that new base: 920 × (1 − 15/100) = 782 service units.
3. The shortcut would give 800 × [1 + (15−15)/100] = 800. The absolute difference is 18 service units.
4. Because the difference is greater than 1 service units, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 782 service units. The simplified method gives 800, a difference of 18 service units, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
