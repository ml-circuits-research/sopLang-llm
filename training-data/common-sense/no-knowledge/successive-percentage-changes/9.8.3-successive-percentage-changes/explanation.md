# Explanation 9.8.3 — Successive percentage changes

## Explanation

1. The first change increases 2400 uses by 10% of that value, which gives 2640 uses and is the base the second percentage sees.
2. The second change reduces the new base by 8%, so the final value is 2428.8 uses rather than the original value changed once.
3. Applying '+10% - 8%' once to 2400 uses instead gives 2448 uses, so the two methods differ by the original value times 80/10000, which is 19.2 uses.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 2400 × (1 + 10/100) = 2640 uses.
2. The second percentage applies to that new base: 2640 × (1 − 8/100) = 2428.8 uses.
3. The shortcut would give 2400 × [1 + (10−8)/100] = 2448. The absolute difference is 19.2 uses.
4. Because the difference is greater than 1 uses, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 2428.8 uses. The simplified method gives 2448, a difference of 19.2 uses, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
