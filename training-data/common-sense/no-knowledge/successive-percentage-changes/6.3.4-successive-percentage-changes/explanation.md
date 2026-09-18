# Explanation 6.3.4 — Successive percentage changes

## Explanation

1. The first change increases 2000 residents by 25% of that value, which gives 2500 residents and is the base the second percentage sees.
2. The second change reduces the new base by 8%, so the final value is 2300 residents rather than the original value changed once.
3. Applying '+25% - 8%' once to 2000 residents instead gives 2340 residents, so the two methods differ by the original value times 200/10000, which is 40 residents.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 2000 × (1 + 25/100) = 2500 residents.
2. The second percentage applies to that new base: 2500 × (1 − 8/100) = 2300 residents.
3. The shortcut would give 2000 × [1 + (25−8)/100] = 2340. The absolute difference is 40 residents.
4. Because the difference is greater than 1 residents, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 2300 residents. The simplified method gives 2340, a difference of 40 residents, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
