# Explanation 6.2.7 — Successive percentage changes

## Explanation

1. The first change increases 800 residents by 12% of that value, which gives 896 residents and is the base the second percentage sees.
2. The second change reduces the new base by 10%, so the final value is 806.4 residents rather than the original value changed once.
3. Applying '+12% - 10%' once to 800 residents instead gives 816 residents, so the two methods differ by the original value times 120/10000, which is 9.6 residents.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 800 × (1 + 12/100) = 896 residents.
2. The second percentage applies to that new base: 896 × (1 − 10/100) = 806.4 residents.
3. The shortcut would give 800 × [1 + (12−10)/100] = 816. The absolute difference is 9.6 residents.
4. Because the difference is greater than 1 residents, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 806.4 residents. The simplified method gives 816, a difference of 9.6 residents, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
