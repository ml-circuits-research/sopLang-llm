# Explanation 2.1.8 — Break-even threshold

## Explanation

1. Setting the two total costs equal, Plan A 500 + 14q and Plan B 250 + 20q, isolates q = (250 − 500)/(14 − 20) = 41.67 units, where both plans cost the same.
2. Plan B carries the smaller fixed cost, so it is cheaper at low volume and stays cheaper on every volume up to the crossing point.
3. Plan A carries the smaller per-unit cost, so every additional unit widens its advantage and it is cheaper above the crossing point.
4. When volume must be a whole number, a non-integer threshold is not rounded to a single winner: the nearest integers below and above it are compared directly, because the cheaper plan can change across the crossing.

Reference solution as printed in the source (template 10, 4 steps):

1. Set costs equal: 500+14q = 250+20q.
2. Rearrange: 250 = (20−14)q, hence q = 250/6 = 41.67.
3. Testing values on either side shows Plan B is cheaper below the threshold and Plan A above it.
4. For whole-unit volumes, compare the nearest integers below and above a non-integer break-even point.

## Result

**Answer.** Break-even volume: 41.67 units. Below it, Plan B is cheaper; above it, Plan A is cheaper.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
