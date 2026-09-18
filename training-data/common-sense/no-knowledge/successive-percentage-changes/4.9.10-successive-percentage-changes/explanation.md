# Explanation 4.9.10 — Successive percentage changes

## Explanation

1. The first change increases 1100 measurements by 12% of that value, which gives 1232 measurements and is the base the second percentage sees.
2. The second change reduces the new base by 8%, so the final value is 1133.44 measurements rather than the original value changed once.
3. Applying '+12% - 8%' once to 1100 measurements instead gives 1144 measurements, so the two methods differ by the original value times 96/10000, which is 10.56 measurements.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 1100 × (1 + 12/100) = 1232 measurements.
2. The second percentage applies to that new base: 1232 × (1 − 8/100) = 1133.44 measurements.
3. The shortcut would give 1100 × [1 + (12−8)/100] = 1144. The absolute difference is 10.56 measurements.
4. Because the difference is greater than 1 measurements, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 1133.44 measurements. The simplified method gives 1144, a difference of 10.56 measurements, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
