# Explanation 3.10.9 — Successive percentage changes

## Explanation

1. The first change increases 2100 participants by 25% of that value, which gives 2625 participants and is the base the second percentage sees.
2. The second change reduces the new base by 20%, so the final value is 2100 participants rather than the original value changed once.
3. Applying '+25% - 20%' once to 2100 participants instead gives 2205 participants, so the two methods differ by the original value times 500/10000, which is 105 participants.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 2100 × (1 + 25/100) = 2625 participants.
2. The second percentage applies to that new base: 2625 × (1 − 20/100) = 2100 participants.
3. The shortcut would give 2100 × [1 + (25−20)/100] = 2205. The absolute difference is 105 participants.
4. Because the difference is greater than 1 participants, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 2100 participants. The simplified method gives 2205, a difference of 105 participants, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
