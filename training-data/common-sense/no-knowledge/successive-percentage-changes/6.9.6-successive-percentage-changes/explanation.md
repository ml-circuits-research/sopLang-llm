# Explanation 6.9.6 — Successive percentage changes

## Explanation

1. The first change increases 1300 residents by 20% of that value, which gives 1560 residents and is the base the second percentage sees.
2. The second change reduces the new base by 5%, so the final value is 1482 residents rather than the original value changed once.
3. Applying '+20% - 5%' once to 1300 residents instead gives 1495 residents, so the two methods differ by the original value times 100/10000, which is 13 residents.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 1300 × (1 + 20/100) = 1560 residents.
2. The second percentage applies to that new base: 1560 × (1 − 5/100) = 1482 residents.
3. The shortcut would give 1300 × [1 + (20−5)/100] = 1495. The absolute difference is 13 residents.
4. Because the difference is greater than 1 residents, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 1482 residents. The simplified method gives 1495, a difference of 13 residents, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
