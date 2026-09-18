# Explanation 143 — Reservoir stock and flow: case 3

## Explanation

1. The daily net change is the inflow minus the outflow: 7 - 4 = 3 unit(s) per day.
2. Over 3 day(s) that net change accumulates to 3 times 3 = 9 unit(s).
3. Adding the accumulated change to the starting stock 31 gives 40 unit(s).
4. The stock is increasing because the daily net change is positive.

Reference solution as printed in the source (family N4, 3 steps):

1. Daily net change=7−4=3.
2. Over 3 days, net change=3×3=9.
3. End stock=31+(9)=40.

## Result

**Answer.** 40 units; the stock is increasing.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
