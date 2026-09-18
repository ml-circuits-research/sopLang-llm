# Explanation 9.6.9 — Successive percentage changes

## Explanation

1. The first change increases 1500 uses by 8% of that value, which gives 1620 uses and is the base the second percentage sees.
2. The second change reduces the new base by 10%, so the final value is 1458 uses rather than the original value changed once.
3. Applying '+8% - 10%' once to 1500 uses instead gives 1470 uses, so the two methods differ by the original value times 80/10000, which is 12 uses.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 1500 × (1 + 8/100) = 1620 uses.
2. The second percentage applies to that new base: 1620 × (1 − 10/100) = 1458 uses.
3. The shortcut would give 1500 × [1 + (8−10)/100] = 1470. The absolute difference is 12 uses.
4. Because the difference is greater than 1 uses, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 1458 uses. The simplified method gives 1470, a difference of 12 uses, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
