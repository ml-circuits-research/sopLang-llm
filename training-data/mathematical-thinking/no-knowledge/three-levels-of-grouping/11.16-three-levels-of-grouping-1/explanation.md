# Explanation 11.16 — Three Levels of Grouping 1

## Explanation

1. The grouping has three levels: 2 identical shelves, 3 trays per shelf, and 5 objects per tray.
2. One shelf holds 3 · 5 = 15 objects.
3. The cabinet repeats that shelf 2 times, so 15 · 2 = 30 objects.

Reference solution as printed in the source (chapter 11, 3 steps):

1. On one shelf: 3×5=15.
2. On 2 shelves: 2×15=30.
3. Alternative check: there are 6 trays, each with 5; 6×5=30.

## Result

**Answer.** 30

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
