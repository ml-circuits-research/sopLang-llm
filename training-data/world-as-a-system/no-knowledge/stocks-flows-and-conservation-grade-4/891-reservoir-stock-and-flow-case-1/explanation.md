# Explanation 891 — Reservoir stock and flow: case 1

## Explanation

1. The daily net change is the inflow minus the outflow: 5 - 7 = -2 unit(s) per day.
2. Over 6 day(s) that net change accumulates to 6 times -2 = -12 unit(s).
3. Adding the accumulated change to the starting stock 40 gives 28 unit(s).
4. The stock is decreasing because the daily net change is negative.

Reference solution as printed in the source (family N4, 3 steps):

1. Daily net change=5−7=-2.
2. Over 6 days, net change=6×-2=-12.
3. End stock=40+(-12)=28.

## Result

**Answer.** 28 units; the stock is decreasing.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
