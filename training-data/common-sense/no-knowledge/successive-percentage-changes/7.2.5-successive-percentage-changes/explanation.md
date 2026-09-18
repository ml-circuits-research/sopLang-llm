# Explanation 7.2.5 — Successive percentage changes

## Explanation

1. The first change increases 1900 service units by 8% of that value, which gives 2052 service units and is the base the second percentage sees.
2. The second change reduces the new base by 15%, so the final value is 1744.2 service units rather than the original value changed once.
3. Applying '+8% - 15%' once to 1900 service units instead gives 1767 service units, so the two methods differ by the original value times 120/10000, which is 22.8 service units.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 1900 × (1 + 8/100) = 2052 service units.
2. The second percentage applies to that new base: 2052 × (1 − 15/100) = 1744.2 service units.
3. The shortcut would give 1900 × [1 + (8−15)/100] = 1767. The absolute difference is 22.8 service units.
4. Because the difference is greater than 1 service units, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 1744.2 service units. The simplified method gives 1767, a difference of 22.8 service units, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
