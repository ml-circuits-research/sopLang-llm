# Explanation 1.6.5 — Successive percentage changes

## Explanation

1. The first change increases 2400 cases by 15% of that value, which gives 2760 cases and is the base the second percentage sees.
2. The second change reduces the new base by 10%, so the final value is 2484 cases rather than the original value changed once.
3. Applying '+15% - 10%' once to 2400 cases instead gives 2520 cases, so the two methods differ by the original value times 150/10000, which is 36 cases.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 2400 × (1 + 15/100) = 2760 cases.
2. The second percentage applies to that new base: 2760 × (1 − 10/100) = 2484 cases.
3. The shortcut would give 2400 × [1 + (15−10)/100] = 2520. The absolute difference is 36 cases.
4. Because the difference is greater than 1 cases, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 2484 cases. The simplified method gives 2520, a difference of 36 cases, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
