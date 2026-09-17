# Explanation 17.15 — Scaled Recipe 5

## Explanation

1. The statement gives the rule: multiplying the number of servings by a factor multiplies every ingredient by the same factor, which keeps the recipe proportions unchanged.
2. The base recipe serves 4 people, and the wanted number of servings is 3 times that, so 4×3 = 12 people.
3. The same factor scales the flour: 280×3 = 840 g, so the portion per person stays 70 g.

Reference solution as printed in the source (chapter 17, 3 steps):

1. Number of people: 4×3=12.
2. Flour: 280×3=840 g.
3. The ratio of flour to servings remains the same.

## Result

**Answer.** 12 people and 840 g.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
