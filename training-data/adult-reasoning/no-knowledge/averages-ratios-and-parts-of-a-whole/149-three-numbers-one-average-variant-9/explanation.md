# Explanation 149 — Three numbers, one average — variant 9

## Explanation

1. The mean is the sum over how many, so 12 + 17 + 20 = 49 litres over three groups.
2. That gives 16.33 litres, and it is neither the middle value nor the most frequent one, which the notebook excludes.
3. The ratio takes parts to parts, so the smallest group of 12 litres and the largest of 20 litres are written 12:20.
4. Mira writes both numbers in Station Quarter, and the ratio uses the extreme group sizes, not the mean.

Reference material as printed in the source:

Sum divided by 3. Do not replace the mean with the value written in the middle of the list. The list is not thereby sorted.

## Result

**Answer.** Mean 16.33 l. Ratio 12:20.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
