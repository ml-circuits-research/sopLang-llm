# Explanation 10.8.1 — Successive percentage changes

## Explanation

1. The first change increases 1900 beneficiaries by 20% of that value, which gives 2280 beneficiaries and is the base the second percentage sees.
2. The second change reduces the new base by 5%, so the final value is 2166 beneficiaries rather than the original value changed once.
3. Applying '+20% - 5%' once to 1900 beneficiaries instead gives 2185 beneficiaries, so the two methods differ by the original value times 100/10000, which is 19 beneficiaries.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 1900 × (1 + 20/100) = 2280 beneficiaries.
2. The second percentage applies to that new base: 2280 × (1 − 5/100) = 2166 beneficiaries.
3. The shortcut would give 1900 × [1 + (20−5)/100] = 2185. The absolute difference is 19 beneficiaries.
4. Because the difference is greater than 1 beneficiaries, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 2166 beneficiaries. The simplified method gives 2185, a difference of 19 beneficiaries, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
