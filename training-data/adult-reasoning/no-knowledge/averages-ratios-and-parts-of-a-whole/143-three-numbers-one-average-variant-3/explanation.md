# Explanation 143 — Three numbers, one average — variant 3

## Explanation

1. The mean is the sum over how many, so 6 + 11 + 14 = 31 litres over three groups.
2. That gives 10.33 litres, and it is neither the middle value nor the most frequent one, which the notebook excludes.
3. The ratio takes parts to parts, so the smallest group of 6 litres and the largest of 14 litres are written 6:14.
4. Ines writes both numbers in Harbour Town, and the ratio uses the extreme group sizes, not the mean.

Reference material as printed in the source:

Sum divided by 3. Do not replace the mean with the value written in the middle of the list. The list is not thereby sorted.

## Result

**Answer.** Mean 10.33 l. Ratio 6:14.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
