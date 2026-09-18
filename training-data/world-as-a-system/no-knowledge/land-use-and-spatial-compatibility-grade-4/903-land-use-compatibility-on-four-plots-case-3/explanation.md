# Explanation 903 — Land-use compatibility on four plots: case 3

## Explanation

1. The uses school, factory, park, homes must each be placed exactly once over the plots A, B, C, D, so every candidate is a permutation of the uses.
2. Enumerating the permutations in the order the facts list the uses, plot by plot, keeps only the assignments that satisfy "factory is not adjacent to school" and "park is adjacent to homes".
3. The end-plot constraint on school removes the remaining candidates.
4. The stated constraints leave 4 valid assignments, and this is case 3 of the family, so the case takes the 3rd one: A=factory, B=park, C=homes, D=school, which satisfies every constraint.

Reference solution as printed in the source (family N6, 4 steps):

1. Try the assignment A=factory, B=park, C=homes, D=school.
2. Factory and school are not adjacent.
3. Park and homes are adjacent. The school is on an end plot.
4. Each use appears exactly once. Cross-domain check: 9−4=5 independent reports remain.

## Result

**Answer.** A=factory, B=park, C=homes, D=school is a valid assignment. Cross-domain answer: 5 independent reports.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
