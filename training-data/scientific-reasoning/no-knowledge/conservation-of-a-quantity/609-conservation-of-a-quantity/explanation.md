# Explanation 609 — Conservation of a quantity

## Explanation

1. The system is closed, so the sum of the three compartments must stay equal to the initial total of 27 model L.
2. The two known compartments are "in containers"=3 and "consumed along the route"=6, so "final reserve" carries the whole remainder of the total.
3. Check: 3+6+18=27.
4. Moving the quantity changes its distribution and not the total, so any state that satisfies this equality is a possible reconstruction.

Reference solution as printed in the source (form 24, 4 steps):

1. The invariant is the sum of the three compartments: in a closed system, it must remain equal to the initial total.
2. The final values consistent with the transfers are “in containers”=3, “consumed along the route”=6, “final reserve”=18.
3. Check: 3+6+18=27.
4. Moving the resource changes its distribution, not the total quantity; any valid reconstruction must satisfy this equality.

## Result

**Answer.** Consistent final state: “in containers”=3, “consumed along the route”=6, “final reserve”=18 model L; the total is 27.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
