# Explanation 17.14 — Scaled Recipe 4

## Explanation

1. The statement gives the rule: multiplying the number of servings by a factor multiplies every ingredient by the same factor, which keeps the recipe proportions unchanged.
2. The base recipe serves 6 people, and the wanted number of servings is 2 times that, so 6×2 = 12 people.
3. The same factor scales the flour: 360×2 = 720 g, so the portion per person stays 60 g.

Reference solution as printed in the source (chapter 17, 3 steps):

1. Number of people: 6×2=12.
2. Flour: 360×2=720 g.
3. The ratio of flour to servings remains the same.

## Result

**Answer.** 12 people and 720 g.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
