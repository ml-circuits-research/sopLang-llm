# Explanation 651 — Simple proportions and scaling

## Explanation

1. One unit of effort yields 4 movement units, and the statement says the effects add linearly, so the quantity is proportional to the number of units.
2. The worked example confirms the factor: 2 units yield 8 movement units, which is 2×4.
3. Five units yield 5×4=20 movement units, and the target 24 is 24÷4=6 units.
4. Dividing the target by the value per unit is valid only because the problem states a linear model; without that clause the same two numbers would not scale.

Reference solution as printed in the source (form 26, 4 steps):

1. One unit produces 4; from 2 to 5 units the factor is 5/2, but we can work more simply with the value per unit.
2. For 5 units: 5×4=20 movement units.
3. For 24 movement units, we divide by 4 per unit: (24)÷4=6.
4. The relationship is proportional only because the problem explicitly specifies a linear model.

## Result

**Answer.** With 5 units: 20 movement units; for 24, 6 active units are needed.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
