# Explanation 148 — Three numbers, one average — variant 8

## Explanation

1. The mean is the sum over how many, so 11 + 16 + 19 = 46 litres over three groups.
2. That gives 15.33 litres, and it is neither the middle value nor the most frequent one, which the notebook excludes.
3. The ratio takes parts to parts, so the smallest group of 11 litres and the largest of 19 litres are written 11:19.
4. Ines writes both numbers in Harbour Town, and the ratio uses the extreme group sizes, not the mean.

Reference material as printed in the source:

Sum divided by 3. Do not replace the mean with the value written in the middle of the list. The list is not thereby sorted.

## Result

**Answer.** Mean 15.33 l. Ratio 11:19.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
