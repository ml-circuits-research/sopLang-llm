# Explanation 892 — Reservoir stock and flow: case 2

## Explanation

1. The daily net change is the inflow minus the outflow: 6 - 8 = -2 unit(s) per day.
2. Over 6 day(s) that net change accumulates to 6 times -2 = -12 unit(s).
3. Adding the accumulated change to the starting stock 43 gives 31 unit(s).
4. The stock is decreasing because the daily net change is negative.

Reference solution as printed in the source (family N4, 3 steps):

1. Daily net change=6−8=-2.
2. Over 6 days, net change=6×-2=-12.
3. End stock=43+(-12)=31.

## Result

**Answer.** 31 units; the stock is decreasing.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
