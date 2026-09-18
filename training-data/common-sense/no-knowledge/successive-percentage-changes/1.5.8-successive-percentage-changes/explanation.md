# Explanation 1.5.8 — Successive percentage changes

## Explanation

1. The first change increases 1300 cases by 20% of that value, which gives 1560 cases and is the base the second percentage sees.
2. The second change reduces the new base by 10%, so the final value is 1404 cases rather than the original value changed once.
3. Applying '+20% - 10%' once to 1300 cases instead gives 1430 cases, so the two methods differ by the original value times 200/10000, which is 26 cases.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 1300 × (1 + 20/100) = 1560 cases.
2. The second percentage applies to that new base: 1560 × (1 − 10/100) = 1404 cases.
3. The shortcut would give 1300 × [1 + (20−10)/100] = 1430. The absolute difference is 26 cases.
4. Because the difference is greater than 1 cases, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 1404 cases. The simplified method gives 1430, a difference of 26 cases, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
