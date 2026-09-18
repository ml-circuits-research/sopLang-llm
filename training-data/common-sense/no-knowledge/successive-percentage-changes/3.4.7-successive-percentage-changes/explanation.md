# Explanation 3.4.7 — Successive percentage changes

## Explanation

1. The first change increases 2400 participants by 8% of that value, which gives 2592 participants and is the base the second percentage sees.
2. The second change reduces the new base by 8%, so the final value is 2384.64 participants rather than the original value changed once.
3. Applying '+8% - 8%' once to 2400 participants instead gives 2400 participants, so the two methods differ by the original value times 64/10000, which is 15.36 participants.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 2400 × (1 + 8/100) = 2592 participants.
2. The second percentage applies to that new base: 2592 × (1 − 8/100) = 2384.64 participants.
3. The shortcut would give 2400 × [1 + (8−8)/100] = 2400. The absolute difference is 15.36 participants.
4. Because the difference is greater than 1 participants, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 2384.64 participants. The simplified method gives 2400, a difference of 15.36 participants, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
