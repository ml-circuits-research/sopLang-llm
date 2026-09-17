# Explanation 26.23 — Shift change after four days

## Explanation

1. Team X takes days 1 through 4, then team Y takes the next 4 days, and the two-block pattern repeats.
2. Day 13 lies in block number 4 of the schedule, and the team is that block number reduced modulo 2.
3. The reduction leaves team Y on duty.

Reference solution as printed in the source (chapter 26, 4 steps):

1. The first X block is days 1–4.
2. The first Y block is days 5–8.
3. The cycle restarts: X works days 9–12.
4. Day 13 falls in the next Y block.

## Result

**Answer.** Team Y.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
