# Explanation 7.1.8 — Successive percentage changes

## Explanation

1. The first change increases 1300 service units by 25% of that value, which gives 1625 service units and is the base the second percentage sees.
2. The second change reduces the new base by 12%, so the final value is 1430 service units rather than the original value changed once.
3. Applying '+25% - 12%' once to 1300 service units instead gives 1469 service units, so the two methods differ by the original value times 300/10000, which is 39 service units.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 1300 × (1 + 25/100) = 1625 service units.
2. The second percentage applies to that new base: 1625 × (1 − 12/100) = 1430 service units.
3. The shortcut would give 1300 × [1 + (25−12)/100] = 1469. The absolute difference is 39 service units.
4. Because the difference is greater than 1 service units, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 1430 service units. The simplified method gives 1469, a difference of 39 service units, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
