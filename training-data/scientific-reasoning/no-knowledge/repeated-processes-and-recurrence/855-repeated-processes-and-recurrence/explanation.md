# Explanation 855 — Repeated processes and recurrence

## Explanation

1. Every cycle first adds 3 and subtracts 1, so the uncapped state grows by 2 from the state of the previous cycle, starting at 4.
2. The cap 11 enters only through min(11, state), so it truncates the first cycle whose uncapped value is larger than 11, which is cycle 4.
3. Applying the rule to each previous state gives the printed series 4 → 6 → 8 → 10 → 11 → 11.
4. Comparing the series with the constant-step progression shows the cap: the truncated cycles keep the cap value instead of growing further.

Reference solution as printed in the source (form 35, 4 steps):

1. Before the cap is reached, the net change is +2 per cycle.
2. However, we apply the full rule to the result of the previous cycle, not to the initial value.
3. The sequence is: 4 → 6 → 8 → 10 → 11 → 11.
4. The cap becomes active for the first time at cycle 4.

## Result

**Answer.** The states are 6, 8, 10, 11, 11. The cap intervenes at cycle 4.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
