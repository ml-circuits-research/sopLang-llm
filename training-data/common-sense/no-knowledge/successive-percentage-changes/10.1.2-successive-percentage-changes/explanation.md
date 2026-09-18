# Explanation 10.1.2 — Successive percentage changes

## Explanation

1. The first change increases 800 beneficiaries by 25% of that value, which gives 1000 beneficiaries and is the base the second percentage sees.
2. The second change reduces the new base by 20%, so the final value is 800 beneficiaries rather than the original value changed once.
3. Applying '+25% - 20%' once to 800 beneficiaries instead gives 840 beneficiaries, so the two methods differ by the original value times 500/10000, which is 40 beneficiaries.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 800 × (1 + 25/100) = 1000 beneficiaries.
2. The second percentage applies to that new base: 1000 × (1 − 20/100) = 800 beneficiaries.
3. The shortcut would give 800 × [1 + (25−20)/100] = 840. The absolute difference is 40 beneficiaries.
4. Because the difference is greater than 1 beneficiaries, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 800 beneficiaries. The simplified method gives 840, a difference of 40 beneficiaries, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
