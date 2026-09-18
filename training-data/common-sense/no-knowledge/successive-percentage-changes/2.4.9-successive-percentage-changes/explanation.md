# Explanation 2.4.9 — Successive percentage changes

## Explanation

1. The first change increases 1100 units by 8% of that value, which gives 1188 units and is the base the second percentage sees.
2. The second change reduces the new base by 8%, so the final value is 1092.96 units rather than the original value changed once.
3. Applying '+8% - 8%' once to 1100 units instead gives 1100 units, so the two methods differ by the original value times 64/10000, which is 7.04 units.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 1100 × (1 + 8/100) = 1188 units.
2. The second percentage applies to that new base: 1188 × (1 − 8/100) = 1092.96 units.
3. The shortcut would give 1100 × [1 + (8−8)/100] = 1100. The absolute difference is 7.04 units.
4. Because the difference is greater than 1 units, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 1092.96 units. The simplified method gives 1100, a difference of 7.04 units, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
