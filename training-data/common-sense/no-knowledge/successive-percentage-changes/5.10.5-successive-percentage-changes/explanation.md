# Explanation 5.10.5 — Successive percentage changes

## Explanation

1. The first change increases 1200 operations by 20% of that value, which gives 1440 operations and is the base the second percentage sees.
2. The second change reduces the new base by 15%, so the final value is 1224 operations rather than the original value changed once.
3. Applying '+20% - 15%' once to 1200 operations instead gives 1260 operations, so the two methods differ by the original value times 300/10000, which is 36 operations.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 1200 × (1 + 20/100) = 1440 operations.
2. The second percentage applies to that new base: 1440 × (1 − 15/100) = 1224 operations.
3. The shortcut would give 1200 × [1 + (20−15)/100] = 1260. The absolute difference is 36 operations.
4. Because the difference is greater than 1 operations, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 1224 operations. The simplified method gives 1260, a difference of 36 operations, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
