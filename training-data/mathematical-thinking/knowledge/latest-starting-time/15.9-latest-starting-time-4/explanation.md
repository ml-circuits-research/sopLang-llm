# Explanation 15.9 — Latest Starting Time 4

## Explanation

1. This problem states only how to move backward: subtract the full duration from the deadline. The clock itself, with 60 minutes in an hour, is a convention the text never spells out, so the circuit carries it on a facts wire.
2. The deadline 15:00 is 900 minutes, and the activity occupies the 80 minutes just before it.
3. Subtracting gives 820 minutes, which is 13:40 — the latest start that still finishes on time.

Reference solution as printed in the source (chapter 15, 3 steps):

1. Convert the deadline to minutes: 15×60+0=900.
2. Subtract the duration: 900-80=820.
3. 820 minutes corresponds to 13:40.

## Result

**Answer.** 13:40

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
