# Explanation 641 — Reservoir stock and flow: case 1

## Explanation

1. The daily net change is the inflow minus the outflow: 5 - 6 = -1 unit(s) per day.
2. Over 5 day(s) that net change accumulates to 5 times -1 = -5 unit(s).
3. Adding the accumulated change to the starting stock 35 gives 30 unit(s).
4. The stock is decreasing because the daily net change is negative.

Reference solution as printed in the source (family N4, 3 steps):

1. Daily net change=5−6=-1.
2. Over 5 days, net change=5×-1=-5.
3. End stock=35+(-5)=30.

## Result

**Answer.** 30 units; the stock is decreasing.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
