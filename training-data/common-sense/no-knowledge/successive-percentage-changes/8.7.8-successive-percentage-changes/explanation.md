# Explanation 8.7.8 — Successive percentage changes

## Explanation

1. The first change increases 2000 documents by 8% of that value, which gives 2160 documents and is the base the second percentage sees.
2. The second change reduces the new base by 15%, so the final value is 1836 documents rather than the original value changed once.
3. Applying '+8% - 15%' once to 2000 documents instead gives 1860 documents, so the two methods differ by the original value times 120/10000, which is 24 documents.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 2000 × (1 + 8/100) = 2160 documents.
2. The second percentage applies to that new base: 2160 × (1 − 15/100) = 1836 documents.
3. The shortcut would give 2000 × [1 + (8−15)/100] = 1860. The absolute difference is 24 documents.
4. Because the difference is greater than 1 documents, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 1836 documents. The simplified method gives 1860, a difference of 24 documents, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
