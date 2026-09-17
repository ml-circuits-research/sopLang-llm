# Explanation 15.10 — Latest Starting Time 5

## Explanation

1. This problem states only how to move backward: subtract the full duration from the deadline. The clock itself, with 60 minutes in an hour, is a convention the text never spells out, so the circuit carries it on a facts wire.
2. The deadline 16:00 is 960 minutes, and the activity occupies the 75 minutes just before it.
3. Subtracting gives 885 minutes, which is 14:45 — the latest start that still finishes on time.

Reference solution as printed in the source (chapter 15, 3 steps):

1. Convert the deadline to minutes: 16×60+0=960.
2. Subtract the duration: 960-75=885.
3. 885 minutes corresponds to 14:45.

## Result

**Answer.** 14:45

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
