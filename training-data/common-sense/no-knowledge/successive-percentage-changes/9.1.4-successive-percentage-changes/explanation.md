# Explanation 9.1.4 — Successive percentage changes

## Explanation

1. The first change increases 1500 uses by 12% of that value, which gives 1680 uses and is the base the second percentage sees.
2. The second change reduces the new base by 8%, so the final value is 1545.6 uses rather than the original value changed once.
3. Applying '+12% - 8%' once to 1500 uses instead gives 1560 uses, so the two methods differ by the original value times 96/10000, which is 14.4 uses.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 1500 × (1 + 12/100) = 1680 uses.
2. The second percentage applies to that new base: 1680 × (1 − 8/100) = 1545.6 uses.
3. The shortcut would give 1500 × [1 + (12−8)/100] = 1560. The absolute difference is 14.4 uses.
4. Because the difference is greater than 1 uses, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 1545.6 uses. The simplified method gives 1560, a difference of 14.4 uses, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
