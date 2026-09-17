# Explanation 15.8 — Latest Starting Time 3

## Explanation

1. This problem states only how to move backward: subtract the full duration from the deadline. The clock itself, with 60 minutes in an hour, is a convention the text never spells out, so the circuit carries it on a facts wire.
2. The deadline 14:00 is 840 minutes, and the activity occupies the 65 minutes just before it.
3. Subtracting gives 775 minutes, which is 12:55 — the latest start that still finishes on time.

Reference solution as printed in the source (chapter 15, 3 steps):

1. Convert the deadline to minutes: 14×60+0=840.
2. Subtract the duration: 840-65=775.
3. 775 minutes corresponds to 12:55.

## Result

**Answer.** 12:55

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
