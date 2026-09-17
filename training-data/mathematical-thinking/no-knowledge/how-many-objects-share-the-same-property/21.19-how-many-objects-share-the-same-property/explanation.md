# Explanation 21.19 — How Many Objects Share the Same Property?

## Explanation

1. Splitting 7 pencils between 2 colors, suppose no color had 4 pencils.
2. Then each color would have at most 3 pencils, giving at most 6 pencils in total, which is fewer than 7.
3. That contradiction forces at least 4 pencils to share one color, whatever the exact distribution is.

Reference solution as printed in the source (chapter 21, 4 steps):

1. Assume the opposite: neither color appears 4 times.
2. Then there are at most 3 red pencils and at most 3 blue pencils.
3. In total there would be at most 3+3=6 pencils.
4. But there are 7; the assumption is impossible. Therefore one of the colors appears at least 4 times.

## Result

**Answer.** At least 4 pencils have the same color.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
