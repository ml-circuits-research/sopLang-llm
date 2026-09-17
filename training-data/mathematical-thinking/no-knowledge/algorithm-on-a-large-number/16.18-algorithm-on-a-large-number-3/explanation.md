# Explanation 16.18 — Algorithm on a Large Number 3

## Explanation

1. The two instructions are applied in the order printed, so the additions and the subtraction combine into one expression over the input value.
2. Starting from 5625 and adding 800 gives 6425; subtracting 325 then gives 6100.
3. The check runs the program backwards: from 6100, adding 325 and removing 800 returns 5625, so the output is consistent.

Reference solution as printed in the source (chapter 16, 3 steps):

1. After instruction 1: 5625+800=6425.
2. After instruction 2: 6425-325=6100.
3. Reverse check: 6100+325=6425, then 6425-800=5625.

## Result

**Answer.** 6100

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
