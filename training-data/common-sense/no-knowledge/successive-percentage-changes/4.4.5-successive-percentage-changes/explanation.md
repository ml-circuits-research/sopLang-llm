# Explanation 4.4.5 — Successive percentage changes

## Explanation

1. The first change increases 900 measurements by 12% of that value, which gives 1008 measurements and is the base the second percentage sees.
2. The second change reduces the new base by 20%, so the final value is 806.4 measurements rather than the original value changed once.
3. Applying '+12% - 20%' once to 900 measurements instead gives 828 measurements, so the two methods differ by the original value times 240/10000, which is 21.6 measurements.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 900 × (1 + 12/100) = 1008 measurements.
2. The second percentage applies to that new base: 1008 × (1 − 20/100) = 806.4 measurements.
3. The shortcut would give 900 × [1 + (12−20)/100] = 828. The absolute difference is 21.6 measurements.
4. Because the difference is greater than 1 measurements, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 806.4 measurements. The simplified method gives 828, a difference of 21.6 measurements, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
