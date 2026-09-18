# Explanation 3.5.4 — Successive percentage changes

## Explanation

1. The first change increases 800 participants by 10% of that value, which gives 880 participants and is the base the second percentage sees.
2. The second change reduces the new base by 20%, so the final value is 704 participants rather than the original value changed once.
3. Applying '+10% - 20%' once to 800 participants instead gives 720 participants, so the two methods differ by the original value times 200/10000, which is 16 participants.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 800 × (1 + 10/100) = 880 participants.
2. The second percentage applies to that new base: 880 × (1 − 20/100) = 704 participants.
3. The shortcut would give 800 × [1 + (10−20)/100] = 720. The absolute difference is 16 participants.
4. Because the difference is greater than 1 participants, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 704 participants. The simplified method gives 720, a difference of 16 participants, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
