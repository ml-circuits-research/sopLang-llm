# Explanation 36.12 — One worker stops halfway through

## Explanation

1. The work has two stages because the set of active workers changes.
2. Together the machines run at 3 + 2 = 5 pieces/min for 4 minutes.
3. After B stops only 3 pieces/min is produced for 3 minutes, and the two stages add up to 29 pieces.

Reference solution as printed in the source (chapter 36, 4 steps):

1. Together, the rate is 5 pieces/min.
2. In 4 minutes: 20.
3. A alone produces 9 in 3 minutes.
4. Total 20+9=29.

## Result

**Answer.** 29 pieces.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
