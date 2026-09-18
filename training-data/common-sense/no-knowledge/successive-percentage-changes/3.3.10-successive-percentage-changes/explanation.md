# Explanation 3.3.10 — Successive percentage changes

## Explanation

1. The first change increases 2100 participants by 12% of that value, which gives 2352 participants and is the base the second percentage sees.
2. The second change reduces the new base by 12%, so the final value is 2069.76 participants rather than the original value changed once.
3. Applying '+12% - 12%' once to 2100 participants instead gives 2100 participants, so the two methods differ by the original value times 144/10000, which is 30.24 participants.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 2100 × (1 + 12/100) = 2352 participants.
2. The second percentage applies to that new base: 2352 × (1 − 12/100) = 2069.76 participants.
3. The shortcut would give 2100 × [1 + (12−12)/100] = 2100. The absolute difference is 30.24 participants.
4. Because the difference is greater than 1 participants, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 2069.76 participants. The simplified method gives 2100, a difference of 30.24 participants, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
