# Explanation 36.14 — Filling and draining simultaneously

## Explanation

1. Filling and draining act at the same time, so only the net flow changes the volume: 10 - 3 = 7 L/min.
2. Over 6 minutes that net flow adds 42 L to the starting 20 L.
3. The tank then holds 62 L.

Reference solution as printed in the source (chapter 36, 4 steps):

1. Net rate is 10-3=7 L/min.
2. In 6 minutes, volume increases by 42 L.
3. Add this to the initial 20.
4. 20+42=62 L.

## Result

**Answer.** 62 L.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
