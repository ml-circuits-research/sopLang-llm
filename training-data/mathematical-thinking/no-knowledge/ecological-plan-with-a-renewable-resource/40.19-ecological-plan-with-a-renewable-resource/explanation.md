# Explanation 40.19 — Ecological plan with a renewable resource

## Explanation

1. Each day replenishment happens first, so the stock changes by 4 - 6 = -2 units per day.
2. Starting from 20 and applying a net change of -2 for 3 days never causes a shortage.
3. After 3 days the reservoir holds 14 units.

Reference solution as printed in the source (chapter 40, 4 steps):

1. Day 1: 20+4-6=18.
2. Day 2: 18+4-6=16.
3. Day 3: 16+4-6=14.
4. The net rate is -2 per day.

## Result

**Answer.** 14 units.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
