# Explanation 29.17 — A truth table for two conditions

## Explanation

1. Each of the 2 lamps is an independent choice between two values, so the state is an ordered pair.
2. Multiplying the options per lamp gives the number of states, and listing them in the fixed order of the options enumerates the whole table.
3. The printed convention writes each state with one letter per lamp (on as O and off as F), which yields OO, OF, FO, and FF.

Reference solution as printed in the source (chapter 29, 5 steps):

1. A on, B on.
2. A on, B off.
3. A off, B on.
4. A off, B off.
5. These exhaust all independent binary choices.

## Result

**Answer.** OO, OF, FO, FF (on/off).

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
