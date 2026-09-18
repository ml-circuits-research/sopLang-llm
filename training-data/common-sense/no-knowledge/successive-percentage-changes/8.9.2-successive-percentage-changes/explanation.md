# Explanation 8.9.2 — Successive percentage changes

## Explanation

1. The first change increases 2400 documents by 10% of that value, which gives 2640 documents and is the base the second percentage sees.
2. The second change reduces the new base by 15%, so the final value is 2244 documents rather than the original value changed once.
3. Applying '+10% - 15%' once to 2400 documents instead gives 2280 documents, so the two methods differ by the original value times 150/10000, which is 36 documents.
4. Because the difference is larger than the stated threshold of 1, the direct add/subtract method is rejected under the stated criterion.

Reference solution as printed in the source (template 20, 4 steps):

1. After the first change: 2400 × (1 + 10/100) = 2640 documents.
2. The second percentage applies to that new base: 2640 × (1 − 15/100) = 2244 documents.
3. The shortcut would give 2400 × [1 + (10−15)/100] = 2280. The absolute difference is 36 documents.
4. Because the difference is greater than 1 documents, the shortcut is rejected by the problem's criterion.

## Result

**Answer.** Correct final value: 2244 documents. The simplified method gives 2280, a difference of 36 documents, so it is not acceptable under the stated threshold.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
