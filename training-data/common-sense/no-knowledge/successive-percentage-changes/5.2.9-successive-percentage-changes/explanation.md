# Explanation 5.2.9 — Successive percentage changes

## Explanation

1. The first change increases 1700 operations by 15% of that value, which gives 1955 operations and is the base the second percentage sees.
2. The second change reduces the new base by 8%, so the final value is 1798.6 operations rather than the original value changed once.
3. Applying '+15% - 8%' once to 1700 operations instead gives 1819 operations, so the two methods differ by the original value times 120/10000, which is 20.4 operations.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 1700 × (1 + 15/100) = 1955 operations.
2. The second percentage applies to that new base: 1955 × (1 − 8/100) = 1798.6 operations.
3. The shortcut would give 1700 × [1 + (15−8)/100] = 1819. The absolute difference is 20.4 operations.
4. Because the difference is greater than 1 operations, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 1798.6 operations. The simplified method gives 1819, a difference of 20.4 operations, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
