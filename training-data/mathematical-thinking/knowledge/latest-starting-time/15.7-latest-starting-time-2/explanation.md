# Explanation 15.7 — Latest Starting Time 2

## Explanation

1. This problem states only how to move backward: subtract the full duration from the deadline. The clock itself, with 60 minutes in an hour, is a convention the text never spells out, so the circuit carries it on a facts wire.
2. The deadline 13:00 is 780 minutes, and the activity occupies the 70 minutes just before it.
3. Subtracting gives 710 minutes, which is 11:50 — the latest start that still finishes on time.

Reference solution as printed in the source (chapter 15, 3 steps):

1. Convert the deadline to minutes: 13×60+0=780.
2. Subtract the duration: 780-70=710.
3. 710 minutes corresponds to 11:50.

## Result

**Answer.** 11:50

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
