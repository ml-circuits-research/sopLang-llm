# Explanation 145 — Three numbers, one average — variant 5

## Explanation

1. The mean is the sum over how many, so 8 + 13 + 16 = 37 litres over three groups.
2. That gives 12.33 litres, and it is neither the middle value nor the most frequent one, which the notebook excludes.
3. The ratio takes parts to parts, so the smallest group of 8 litres and the largest of 16 litres are written 8:16.
4. Rita writes both numbers in Stadium District, and the ratio uses the extreme group sizes, not the mean.

Reference material as printed in the source:

Sum divided by 3. Do not replace the mean with the value written in the middle of the list. The list is not thereby sorted.

## Result

**Answer.** Mean 12.33 l. Ratio 8:16.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
