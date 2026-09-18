# Explanation 760 — Repeated processes and recurrence

## Explanation

1. Every cycle first adds 4 and subtracts 2, so the uncapped state grows by 2 from the state of the previous cycle, starting at 3.
2. The cap 12 enters only through min(12, state), so it truncates the first cycle whose uncapped value is larger than 12, which is cycle 5.
3. Applying the rule to each previous state gives the printed series 3 → 5 → 7 → 9 → 11 → 12.
4. Comparing the series with the constant-step progression shows the cap: the truncated cycles keep the cap value instead of growing further.

Reference solution as printed in the source (form 35, 4 steps):

1. Before the cap is reached, the net change is +2 per cycle.
2. However, we apply the full rule to the result of the previous cycle, not to the initial value.
3. The sequence is: 3 → 5 → 7 → 9 → 11 → 12.
4. The cap becomes active for the first time at cycle 5.

## Result

**Answer.** The states are 5, 7, 9, 11, 12. The cap intervenes at cycle 5.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
