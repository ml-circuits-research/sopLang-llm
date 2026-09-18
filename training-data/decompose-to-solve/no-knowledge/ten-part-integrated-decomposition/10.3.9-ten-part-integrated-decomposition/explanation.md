# Explanation 10.3.9 — Ten-Part Integrated Decomposition

## Explanation

1. The demand converts first: 136 local units times the factor 1 give the standard requirement, and allowing 10% process loss gives 151.1 pre-loss standard units, the quantity every downstream step shares (SP1-SP2).
2. Whole batches are demanded next: 151.1 over the capacity 15 requires 11 batches, and at 3 parallel batches per wave that is 4 waves (SP3-SP4).
3. Elapsed time is the waves only: 4 waves at 9 minutes plus the setup 12 and the buffer 11 give 59 minutes, which is compared with the 69-minute deadline (SP5-SP6, SP9).
4. Cost is the fixed charge plus the rate per pre-loss unit: 55 plus 0.91 times 151.1111 gives 192.51 cost units, compared with the budget 232.11 (SP7, SP9).
5. The three hard constraints are recombined as a conjunction: the physical capacity fails, the deadline holds, the budget holds, so the overall verdict is not feasible (SP8, SP10).
6. The printed cost is a two-decimal rounding of a charge the source computed from an unrounded rate, so it sits inside the rounding band of the printed rate rather than at the value the printed rate yields.

**Source answer.** The plan is not feasible. Its key summaries are 151.1 pre-loss standard units, 11 batches, 59 minutes, and 192.11 cost units. This ten-part decomposition works because each intermediate output has a clear semantic type and is reused only where relevant. — the statement prints the per-unit rate rounded to two decimals while the source computed the printed cost from an unrounded rate, so the printed cost agrees with the arithmetic the statement determines only inside the printed rate's rounding band. The shipped answer is computed from the statement, and this example is `computed_verified` rather than `exact_verified`.

## Result

**Answer.** The plan is not feasible. Its key summaries are 151.1 pre-loss standard units, 11 batches, 59 minutes, and 192.51 cost units. The cost applies the stated per-unit rate to the pre-loss demand, the one quantity that every capacity and variable-cost step shares.

**Verification.** computed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
