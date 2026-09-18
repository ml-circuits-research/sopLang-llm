# Explanation 391 — Reservoir stock and flow: case 1

## Explanation

1. The daily net change is the inflow minus the outflow: 5 - 5 = 0 unit(s) per day.
2. Over 4 day(s) that net change accumulates to 4 times 0 = 0 unit(s).
3. Adding the accumulated change to the starting stock 30 gives 30 unit(s).
4. The stock is unchanged because the daily net change is zero.

Reference solution as printed in the source (family N4, 3 steps):

1. Daily net change=5−5=0.
2. Over 4 days, net change=4×0=0.
3. End stock=30+(0)=30.

## Result

**Answer.** 30 units; the stock is unchanged.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
