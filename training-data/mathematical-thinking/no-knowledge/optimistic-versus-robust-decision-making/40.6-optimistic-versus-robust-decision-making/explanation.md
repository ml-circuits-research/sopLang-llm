# Explanation 40.6 — Optimistic versus robust decision-making

## Explanation

1. The optimistic criterion compares the best possible results, while the robust criterion compares the worst possible results.
2. The largest best result belongs to B and the largest worst result belongs to A.
3. So the maximax choice is B and the maximin choice is A.

Reference solution as printed in the source (chapter 40, 4 steps):

1. Optimistic: compare the maxima 4 and 5 → B.
2. Robust: compare the minima 2 and 0 → A.
3. The same data can lead to different decisions under different objectives.
4. The criterion must be stated first.

## Result

**Answer.** Optimistic: B; robust: A.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
