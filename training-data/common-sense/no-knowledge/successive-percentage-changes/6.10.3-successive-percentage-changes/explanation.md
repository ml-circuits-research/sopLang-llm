# Explanation 6.10.3 — Successive percentage changes

## Explanation

1. The first change increases 1200 residents by 20% of that value, which gives 1440 residents and is the base the second percentage sees.
2. The second change reduces the new base by 10%, so the final value is 1296 residents rather than the original value changed once.
3. Applying '+20% - 10%' once to 1200 residents instead gives 1320 residents, so the two methods differ by the original value times 200/10000, which is 24 residents.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 1200 × (1 + 20/100) = 1440 residents.
2. The second percentage applies to that new base: 1440 × (1 − 10/100) = 1296 residents.
3. The shortcut would give 1200 × [1 + (20−10)/100] = 1320. The absolute difference is 24 residents.
4. Because the difference is greater than 1 residents, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 1296 residents. The simplified method gives 1320, a difference of 24 residents, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
