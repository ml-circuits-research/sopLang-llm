# Explanation 34.4 — Budget with two types of objects

## Explanation

1. At least one notebook must be bought, so the 20 lei must first cover a notebook of 6 lei.
2. Whatever is left buys as many pencils as possible at 2 lei each, because pencils are the cheaper object.
3. Spending more on notebooks only reduces the remaining money, so one notebook plus 7 pencils gives the largest total of 8 objects.

Reference solution as printed in the source (chapter 34, 4 steps):

1. Reserve 6 lei for one notebook: 14 lei remain.
2. Pencils are cheaper, so to maximize the number of objects, spend the rest on pencils.
3. 14÷2=7 pencils.
4. Total 1+7=8 objects. Two notebooks would use 4 more lei than two pencils and would reduce the possible number of objects.

## Result

**Answer.** 1 notebook and 7 pencils: 8 objects.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
