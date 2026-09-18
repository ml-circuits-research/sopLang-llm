# Explanation 8.1.6 — Successive percentage changes

## Explanation

1. The first change increases 2300 documents by 20% of that value, which gives 2760 documents and is the base the second percentage sees.
2. The second change reduces the new base by 8%, so the final value is 2539.2 documents rather than the original value changed once.
3. Applying '+20% - 8%' once to 2300 documents instead gives 2576 documents, so the two methods differ by the original value times 160/10000, which is 36.8 documents.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 2300 × (1 + 20/100) = 2760 documents.
2. The second percentage applies to that new base: 2760 × (1 − 8/100) = 2539.2 documents.
3. The shortcut would give 2300 × [1 + (20−8)/100] = 2576. The absolute difference is 36.8 documents.
4. Because the difference is greater than 1 documents, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 2539.2 documents. The simplified method gives 2576, a difference of 36.8 documents, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
