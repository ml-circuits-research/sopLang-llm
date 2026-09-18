# Explanation 4.10.7 — Successive percentage changes

## Explanation

1. The first change increases 2300 measurements by 12% of that value, which gives 2576 measurements and is the base the second percentage sees.
2. The second change reduces the new base by 12%, so the final value is 2266.88 measurements rather than the original value changed once.
3. Applying '+12% - 12%' once to 2300 measurements instead gives 2300 measurements, so the two methods differ by the original value times 144/10000, which is 33.12 measurements.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 2300 × (1 + 12/100) = 2576 measurements.
2. The second percentage applies to that new base: 2576 × (1 − 12/100) = 2266.88 measurements.
3. The shortcut would give 2300 × [1 + (12−12)/100] = 2300. The absolute difference is 33.12 measurements.
4. Because the difference is greater than 1 measurements, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 2266.88 measurements. The simplified method gives 2300, a difference of 33.12 measurements, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
