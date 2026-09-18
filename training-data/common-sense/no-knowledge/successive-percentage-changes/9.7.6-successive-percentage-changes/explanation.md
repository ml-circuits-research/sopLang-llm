# Explanation 9.7.6 — Successive percentage changes

## Explanation

1. The first change increases 1300 uses by 12% of that value, which gives 1456 uses and is the base the second percentage sees.
2. The second change reduces the new base by 20%, so the final value is 1164.8 uses rather than the original value changed once.
3. Applying '+12% - 20%' once to 1300 uses instead gives 1196 uses, so the two methods differ by the original value times 240/10000, which is 31.2 uses.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 1300 × (1 + 12/100) = 1456 uses.
2. The second percentage applies to that new base: 1456 × (1 − 20/100) = 1164.8 uses.
3. The shortcut would give 1300 × [1 + (12−20)/100] = 1196. The absolute difference is 31.2 uses.
4. Because the difference is greater than 1 uses, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 1164.8 uses. The simplified method gives 1196, a difference of 31.2 uses, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
