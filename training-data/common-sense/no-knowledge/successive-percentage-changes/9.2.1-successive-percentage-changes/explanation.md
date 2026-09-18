# Explanation 9.2.1 — Successive percentage changes

## Explanation

1. The first change increases 2300 uses by 15% of that value, which gives 2645 uses and is the base the second percentage sees.
2. The second change reduces the new base by 12%, so the final value is 2327.6 uses rather than the original value changed once.
3. Applying '+15% - 12%' once to 2300 uses instead gives 2369 uses, so the two methods differ by the original value times 180/10000, which is 41.4 uses.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 2300 × (1 + 15/100) = 2645 uses.
2. The second percentage applies to that new base: 2645 × (1 − 12/100) = 2327.6 uses.
3. The shortcut would give 2300 × [1 + (15−12)/100] = 2369. The absolute difference is 41.4 uses.
4. Because the difference is greater than 1 uses, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 2327.6 uses. The simplified method gives 2369, a difference of 41.4 uses, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
