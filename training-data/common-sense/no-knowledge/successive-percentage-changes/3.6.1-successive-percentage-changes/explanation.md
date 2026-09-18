# Explanation 3.6.1 — Successive percentage changes

## Explanation

1. The first change increases 1200 participants by 15% of that value, which gives 1380 participants and is the base the second percentage sees.
2. The second change reduces the new base by 12%, so the final value is 1214.4 participants rather than the original value changed once.
3. Applying '+15% - 12%' once to 1200 participants instead gives 1236 participants, so the two methods differ by the original value times 180/10000, which is 21.6 participants.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 1200 × (1 + 15/100) = 1380 participants.
2. The second percentage applies to that new base: 1380 × (1 − 12/100) = 1214.4 participants.
3. The shortcut would give 1200 × [1 + (15−12)/100] = 1236. The absolute difference is 21.6 participants.
4. Because the difference is greater than 1 participants, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 1214.4 participants. The simplified method gives 1236, a difference of 21.6 participants, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
