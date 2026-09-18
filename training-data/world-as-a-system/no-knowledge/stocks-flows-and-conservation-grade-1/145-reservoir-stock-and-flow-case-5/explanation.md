# Explanation 145 — Reservoir stock and flow: case 5

## Explanation

1. The daily net change is the inflow minus the outflow: 9 - 4 = 5 unit(s) per day.
2. Over 3 day(s) that net change accumulates to 3 times 5 = 15 unit(s).
3. Adding the accumulated change to the starting stock 37 gives 52 unit(s).
4. The stock is increasing because the daily net change is positive.

Reference solution as printed in the source (family N4, 3 steps):

1. Daily net change=9−4=5.
2. Over 3 days, net change=3×5=15.
3. End stock=37+(15)=52.

## Result

**Answer.** 52 units; the stock is increasing.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
