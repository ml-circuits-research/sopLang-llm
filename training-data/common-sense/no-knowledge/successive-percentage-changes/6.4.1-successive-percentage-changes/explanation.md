# Explanation 6.4.1 — Successive percentage changes

## Explanation

1. The first change increases 1800 residents by 12% of that value, which gives 2016 residents and is the base the second percentage sees.
2. The second change reduces the new base by 20%, so the final value is 1612.8 residents rather than the original value changed once.
3. Applying '+12% - 20%' once to 1800 residents instead gives 1656 residents, so the two methods differ by the original value times 240/10000, which is 43.2 residents.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 1800 × (1 + 12/100) = 2016 residents.
2. The second percentage applies to that new base: 2016 × (1 − 20/100) = 1612.8 residents.
3. The shortcut would give 1800 × [1 + (12−20)/100] = 1656. The absolute difference is 43.2 residents.
4. Because the difference is greater than 1 residents, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 1612.8 residents. The simplified method gives 1656, a difference of 43.2 residents, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
