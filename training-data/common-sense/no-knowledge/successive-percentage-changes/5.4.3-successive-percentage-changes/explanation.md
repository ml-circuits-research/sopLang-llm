# Explanation 5.4.3 — Successive percentage changes

## Explanation

1. The first change increases 1900 operations by 25% of that value, which gives 2375 operations and is the base the second percentage sees.
2. The second change reduces the new base by 10%, so the final value is 2137.5 operations rather than the original value changed once.
3. Applying '+25% - 10%' once to 1900 operations instead gives 2185 operations, so the two methods differ by the original value times 250/10000, which is 47.5 operations.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 1900 × (1 + 25/100) = 2375 operations.
2. The second percentage applies to that new base: 2375 × (1 − 10/100) = 2137.5 operations.
3. The shortcut would give 1900 × [1 + (25−10)/100] = 2185. The absolute difference is 47.5 operations.
4. Because the difference is greater than 1 operations, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 2137.5 operations. The simplified method gives 2185, a difference of 47.5 operations, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
