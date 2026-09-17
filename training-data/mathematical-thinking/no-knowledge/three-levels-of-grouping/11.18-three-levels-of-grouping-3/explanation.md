# Explanation 11.18 — Three Levels of Grouping 3

## Explanation

1. The grouping has three levels: 4 identical shelves, 2 trays per shelf, and 7 objects per tray.
2. One shelf holds 2 · 7 = 14 objects.
3. The cabinet repeats that shelf 4 times, so 14 · 4 = 56 objects.

Reference solution as printed in the source (chapter 11, 3 steps):

1. On one shelf: 2×7=14.
2. On 4 shelves: 4×14=56.
3. Alternative check: there are 8 trays, each with 7; 8×7=56.

## Result

**Answer.** 56

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
