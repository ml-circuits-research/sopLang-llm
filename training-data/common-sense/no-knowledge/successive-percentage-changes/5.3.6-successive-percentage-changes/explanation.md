# Explanation 5.3.6 — Successive percentage changes

## Explanation

1. The first change increases 2400 operations by 12% of that value, which gives 2688 operations and is the base the second percentage sees.
2. The second change reduces the new base by 15%, so the final value is 2284.8 operations rather than the original value changed once.
3. Applying '+12% - 15%' once to 2400 operations instead gives 2328 operations, so the two methods differ by the original value times 180/10000, which is 43.2 operations.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 2400 × (1 + 12/100) = 2688 operations.
2. The second percentage applies to that new base: 2688 × (1 − 15/100) = 2284.8 operations.
3. The shortcut would give 2400 × [1 + (12−15)/100] = 2328. The absolute difference is 43.2 operations.
4. Because the difference is greater than 1 operations, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 2284.8 operations. The simplified method gives 2328, a difference of 43.2 operations, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
