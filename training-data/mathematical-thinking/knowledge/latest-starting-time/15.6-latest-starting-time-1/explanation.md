# Explanation 15.6 — Latest Starting Time 1

## Explanation

1. This problem states only how to move backward: subtract the full duration from the deadline. The clock itself, with 60 minutes in an hour, is a convention the text never spells out, so the circuit carries it on a facts wire.
2. The deadline 12:00 is 720 minutes, and the activity occupies the 55 minutes just before it.
3. Subtracting gives 665 minutes, which is 11:05 — the latest start that still finishes on time.

Reference solution as printed in the source (chapter 15, 3 steps):

1. Convert the deadline to minutes: 12×60+0=720.
2. Subtract the duration: 720-55=665.
3. 665 minutes corresponds to 11:05.

## Result

**Answer.** 11:05

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
