# Explanation 11.20 — Three Levels of Grouping 5

## Explanation

1. The grouping has three levels: 5 identical shelves, 3 trays per shelf, and 4 objects per tray.
2. One shelf holds 3 · 4 = 12 objects.
3. The cabinet repeats that shelf 5 times, so 12 · 5 = 60 objects.

Reference solution as printed in the source (chapter 11, 3 steps):

1. On one shelf: 3×4=12.
2. On 5 shelves: 5×12=60.
3. Alternative check: there are 15 trays, each with 4; 15×4=60.

## Result

**Answer.** 60

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
