# Explanation 4.3.8 — Successive percentage changes

## Explanation

1. The first change increases 2300 measurements by 25% of that value, which gives 2875 measurements and is the base the second percentage sees.
2. The second change reduces the new base by 15%, so the final value is 2443.75 measurements rather than the original value changed once.
3. Applying '+25% - 15%' once to 2300 measurements instead gives 2530 measurements, so the two methods differ by the original value times 375/10000, which is 86.25 measurements.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 2300 × (1 + 25/100) = 2875 measurements.
2. The second percentage applies to that new base: 2875 × (1 − 15/100) = 2443.75 measurements.
3. The shortcut would give 2300 × [1 + (25−15)/100] = 2530. The absolute difference is 86.25 measurements.
4. Because the difference is greater than 1 measurements, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 2443.75 measurements. The simplified method gives 2530, a difference of 86.25 measurements, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
