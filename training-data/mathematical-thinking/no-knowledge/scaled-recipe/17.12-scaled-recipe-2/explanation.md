# Explanation 17.12 — Scaled Recipe 2

## Explanation

1. The statement gives the rule: multiplying the number of servings by a factor multiplies every ingredient by the same factor, which keeps the recipe proportions unchanged.
2. The base recipe serves 3 people, and the wanted number of servings is 3 times that, so 3×3 = 9 people.
3. The same factor scales the flour: 240×3 = 720 g, so the portion per person stays 80 g.

Reference solution as printed in the source (chapter 17, 3 steps):

1. Number of people: 3×3=9.
2. Flour: 240×3=720 g.
3. The ratio of flour to servings remains the same.

## Result

**Answer.** 9 people and 720 g.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
