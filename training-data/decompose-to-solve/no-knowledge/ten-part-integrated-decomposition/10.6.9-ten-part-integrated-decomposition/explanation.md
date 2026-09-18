# Explanation 10.6.9 — Ten-Part Integrated Decomposition

## Explanation

1. The demand converts first: 104 local units times the factor 1.25 give the standard requirement, and allowing 6% process loss gives 138.3 pre-loss standard units, the quantity every downstream step shares (SP1-SP2).
2. Whole batches are demanded next: 138.3 over the capacity 21 requires 7 batches, and at 2 parallel batches per wave that is 4 waves (SP3-SP4).
3. Elapsed time is the waves only: 4 waves at 9 minutes plus the setup 8 and the buffer 12 give 56 minutes, which is compared with the 61-minute deadline (SP5-SP6, SP9).
4. Cost is the fixed charge plus the rate per pre-loss unit: 68 plus 0.85 times 138.2979 gives 185.55 cost units, compared with the budget 225.63 (SP7, SP9).
5. The three hard constraints are recombined as a conjunction: the physical capacity holds, the deadline holds, the budget holds, so the overall verdict is feasible (SP8, SP10).
6. The printed cost is a two-decimal rounding of a charge the source computed from an unrounded rate, so it sits inside the rounding band of the printed rate rather than at the value the printed rate yields.

**Source answer.** The plan is feasible. Its key summaries are 138.3 pre-loss standard units, 7 batches, 56 minutes, and 185.63 cost units. This ten-part decomposition works because each intermediate output has a clear semantic type and is reused only where relevant. — the statement prints the per-unit rate rounded to two decimals while the source computed the printed cost from an unrounded rate, so the printed cost agrees with the arithmetic the statement determines only inside the printed rate's rounding band. The shipped answer is computed from the statement, and this example is `computed_verified` rather than `exact_verified`.

## Result

**Answer.** The plan is feasible. Its key summaries are 138.3 pre-loss standard units, 7 batches, 56 minutes, and 185.55 cost units. The cost applies the stated per-unit rate to the pre-loss demand, the one quantity that every capacity and variable-cost step shares.

**Verification.** computed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
