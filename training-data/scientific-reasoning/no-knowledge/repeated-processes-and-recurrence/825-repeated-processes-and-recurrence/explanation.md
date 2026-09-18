# Explanation 825 — Repeated processes and recurrence

## Explanation

1. Every cycle first adds 3 and subtracts 1, so the uncapped state grows by 2 from the state of the previous cycle, starting at 4.
2. The cap 15 enters only through min(15, state), so it truncates the first cycle whose uncapped value is larger than 15; over the 5 cycles the uncapped values stay at or below it.
3. Applying the rule to each previous state gives the printed series 4 → 6 → 8 → 10 → 12 → 14.
4. A cap that is never exceeded changes nothing, so the capped series and the constant-step progression coincide.

Reference solution as printed in the source (form 35, 4 steps):

1. Before the cap is reached, the net change is +2 per cycle.
2. However, we apply the full rule to the result of the previous cycle, not to the initial value.
3. The sequence is: 4 → 6 → 8 → 10 → 12 → 14.
4. The cap not becomes active in the five cycles; series coincide with the progression uncapped.

## Result

**Answer.** The states are 6, 8, 10, 12, 14. The cap does not intervene in the first five cycles.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
