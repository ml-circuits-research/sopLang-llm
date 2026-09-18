# Explanation 10.5.10 — Successive percentage changes

## Explanation

1. The first change increases 2200 beneficiaries by 8% of that value, which gives 2376 beneficiaries and is the base the second percentage sees.
2. The second change reduces the new base by 8%, so the final value is 2185.92 beneficiaries rather than the original value changed once.
3. Applying '+8% - 8%' once to 2200 beneficiaries instead gives 2200 beneficiaries, so the two methods differ by the original value times 64/10000, which is 14.08 beneficiaries.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 2200 × (1 + 8/100) = 2376 beneficiaries.
2. The second percentage applies to that new base: 2376 × (1 − 8/100) = 2185.92 beneficiaries.
3. The shortcut would give 2200 × [1 + (8−8)/100] = 2200. The absolute difference is 14.08 beneficiaries.
4. Because the difference is greater than 1 beneficiaries, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 2185.92 beneficiaries. The simplified method gives 2200, a difference of 14.08 beneficiaries, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
