# Explanation 29.18 — Evaluating a condition on every state

## Explanation

1. The alarm condition is "exactly 1 of the lamps is on", which is true only for the states whose number of on lamps equals 1.
2. Enumerating all the lamp states and counting the on values in each one evaluates the condition on the whole table.
3. The states that satisfy the count are (on,off) and (off,on), which are the only rows where the alarm starts.

Reference solution as printed in the source (chapter 29, 4 steps):

1. With both on, there are two, not exactly one.
2. With A on and B off, exactly one is on.
3. With A off and B on, exactly one is on.
4. With both off, zero are on.

## Result

**Answer.** In states (on,off) and (off,on).

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
