# Explanation 624 — Conservation of a quantity

## Explanation

1. The system is closed, so the sum of the three compartments must stay equal to the initial total of 24 mL.
2. Applying the 2 stated transfers in order to the initial values gives "in container"=3, "as water vapor"=5 and "in mixture"=16.
3. Check: 3+5+16=24.
4. Moving the quantity changes its distribution and not the total, so any state that satisfies this equality is a possible reconstruction.

Reference solution as printed in the source (form 24, 4 steps):

1. The invariant is the sum of the three compartments: in a closed system, it must remain equal to the initial total.
2. The final values consistent with the transfers are “in container”=3, “as water vapor”=5, “in mixture”=16.
3. Check: 3+5+16=24.
4. Moving the resource changes its distribution, not the total quantity; any valid reconstruction must satisfy this equality.

## Result

**Answer.** Consistent final state: “in container”=3, “as water vapor”=5, “in mixture”=16 mL; the total is 24.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
