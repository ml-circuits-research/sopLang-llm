# Explanation 7.3.2 — Successive percentage changes

## Explanation

1. The first change increases 900 service units by 12% of that value, which gives 1008 service units and is the base the second percentage sees.
2. The second change reduces the new base by 5%, so the final value is 957.6 service units rather than the original value changed once.
3. Applying '+12% - 5%' once to 900 service units instead gives 963 service units, so the two methods differ by the original value times 60/10000, which is 5.4 service units.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 900 × (1 + 12/100) = 1008 service units.
2. The second percentage applies to that new base: 1008 × (1 − 5/100) = 957.6 service units.
3. The shortcut would give 900 × [1 + (12−5)/100] = 963. The absolute difference is 5.4 service units.
4. Because the difference is greater than 1 service units, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 957.6 service units. The simplified method gives 963, a difference of 5.4 service units, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
