# Explanation 5.9.8 — Successive percentage changes

## Explanation

1. The first change increases 1600 operations by 12% of that value, which gives 1792 operations and is the base the second percentage sees.
2. The second change reduces the new base by 20%, so the final value is 1433.6 operations rather than the original value changed once.
3. Applying '+12% - 20%' once to 1600 operations instead gives 1472 operations, so the two methods differ by the original value times 240/10000, which is 38.4 operations.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 1600 × (1 + 12/100) = 1792 operations.
2. The second percentage applies to that new base: 1792 × (1 − 20/100) = 1433.6 operations.
3. The shortcut would give 1600 × [1 + (12−20)/100] = 1472. The absolute difference is 38.4 operations.
4. Because the difference is greater than 1 operations, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 1433.6 operations. The simplified method gives 1472, a difference of 38.4 operations, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
