# Explanation 1.7.2 — Successive percentage changes

## Explanation

1. The first change increases 1100 cases by 12% of that value, which gives 1232 cases and is the base the second percentage sees.
2. The second change reduces the new base by 20%, so the final value is 985.6 cases rather than the original value changed once.
3. Applying '+12% - 20%' once to 1100 cases instead gives 1012 cases, so the two methods differ by the original value times 240/10000, which is 26.4 cases.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 1100 × (1 + 12/100) = 1232 cases.
2. The second percentage applies to that new base: 1232 × (1 − 20/100) = 985.6 cases.
3. The shortcut would give 1100 × [1 + (12−20)/100] = 1012. The absolute difference is 26.4 cases.
4. Because the difference is greater than 1 cases, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 985.6 cases. The simplified method gives 1012, a difference of 26.4 cases, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
