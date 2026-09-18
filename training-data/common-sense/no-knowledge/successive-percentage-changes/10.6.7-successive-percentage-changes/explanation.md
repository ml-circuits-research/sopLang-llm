# Explanation 10.6.7 — Successive percentage changes

## Explanation

1. The first change increases 1700 beneficiaries by 15% of that value, which gives 1955 beneficiaries and is the base the second percentage sees.
2. The second change reduces the new base by 10%, so the final value is 1759.5 beneficiaries rather than the original value changed once.
3. Applying '+15% - 10%' once to 1700 beneficiaries instead gives 1785 beneficiaries, so the two methods differ by the original value times 150/10000, which is 25.5 beneficiaries.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 1700 × (1 + 15/100) = 1955 beneficiaries.
2. The second percentage applies to that new base: 1955 × (1 − 10/100) = 1759.5 beneficiaries.
3. The shortcut would give 1700 × [1 + (15−10)/100] = 1785. The absolute difference is 25.5 beneficiaries.
4. Because the difference is greater than 1 beneficiaries, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 1759.5 beneficiaries. The simplified method gives 1785, a difference of 25.5 beneficiaries, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
