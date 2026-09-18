# Explanation 701 — Simple proportions and scaling

## Explanation

1. One unit of effort yields 2 useful route squares, and the statement says the effects add linearly, so the quantity is proportional to the number of units.
2. The worked example confirms the factor: 2 units yield 4 useful route squares, which is 2×2.
3. Five units yield 5×2=10 useful route squares, and the target 12 is 12÷2=6 units.
4. Dividing the target by the value per unit is valid only because the problem states a linear model; without that clause the same two numbers would not scale.

Reference solution as printed in the source (form 26, 4 steps):

1. One unit produces 2; from 2 to 5 units the factor is 5/2, but we can work more simply with the value per unit.
2. For 5 units: 5×2=10 useful route squares.
3. For 12 useful route squares, we divide by 2 per unit: (12)÷2=6.
4. The relationship is proportional only because the problem explicitly specifies a linear model.

## Result

**Answer.** With 5 units: 10 useful route squares; for 12, we need 6 active units.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
