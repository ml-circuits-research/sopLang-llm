# Explanation 691 — Simple proportions and scaling

## Explanation

1. One unit of effort yields 3 units of compression, and the statement says the effects add linearly, so the quantity is proportional to the number of units.
2. The worked example confirms the factor: 2 units yield 6 units of compression, which is 2×3.
3. Five units yield 5×3=15 units of compression, and the target 18 is 18÷3=6 units.
4. Dividing the target by the value per unit is valid only because the problem states a linear model; without that clause the same two numbers would not scale.

Reference solution as printed in the source (form 26, 4 steps):

1. One unit produces 3; from 2 to 5 units the factor is 5/2, but we can work more simply with the value per unit.
2. For 5 units: 5×3=15 units of compression.
3. For 18 units of compression, we divide by 3 per unit: (18)÷3=6.
4. The relationship is proportional only because the problem explicitly specifies a linear model.

## Result

**Answer.** With 5 units: 15 units of compression; 6 active units are needed for 18.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
