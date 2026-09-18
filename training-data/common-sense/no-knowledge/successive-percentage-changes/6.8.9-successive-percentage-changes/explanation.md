# Explanation 6.8.9 — Successive percentage changes

## Explanation

1. The first change increases 2300 residents by 15% of that value, which gives 2645 residents and is the base the second percentage sees.
2. The second change reduces the new base by 10%, so the final value is 2380.5 residents rather than the original value changed once.
3. Applying '+15% - 10%' once to 2300 residents instead gives 2415 residents, so the two methods differ by the original value times 150/10000, which is 34.5 residents.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 2300 × (1 + 15/100) = 2645 residents.
2. The second percentage applies to that new base: 2645 × (1 − 10/100) = 2380.5 residents.
3. The shortcut would give 2300 × [1 + (15−10)/100] = 2415. The absolute difference is 34.5 residents.
4. Because the difference is greater than 1 residents, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 2380.5 residents. The simplified method gives 2415, a difference of 34.5 residents, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
