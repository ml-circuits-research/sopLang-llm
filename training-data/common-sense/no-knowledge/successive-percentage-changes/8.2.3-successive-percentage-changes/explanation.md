# Explanation 8.2.3 — Successive percentage changes

## Explanation

1. The first change increases 2400 documents by 25% of that value, which gives 3000 documents and is the base the second percentage sees.
2. The second change reduces the new base by 20%, so the final value is 2400 documents rather than the original value changed once.
3. Applying '+25% - 20%' once to 2400 documents instead gives 2520 documents, so the two methods differ by the original value times 500/10000, which is 120 documents.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 2400 × (1 + 25/100) = 3000 documents.
2. The second percentage applies to that new base: 3000 × (1 − 20/100) = 2400 documents.
3. The shortcut would give 2400 × [1 + (25−20)/100] = 2520. The absolute difference is 120 documents.
4. Because the difference is greater than 1 documents, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 2400 documents. The simplified method gives 2520, a difference of 120 documents, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
