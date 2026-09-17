# Explanation 16.17 — Algorithm on a Large Number 2

## Explanation

1. The two instructions are applied in the order printed, so the additions and the subtraction combine into one expression over the input value.
2. Starting from 4180 and adding 500 gives 4680; subtracting 240 then gives 4440.
3. The check runs the program backwards: from 4440, adding 240 and removing 500 returns 4180, so the output is consistent.

Reference solution as printed in the source (chapter 16, 3 steps):

1. After instruction 1: 4180+500=4680.
2. After instruction 2: 4680-240=4440.
3. Reverse check: 4440+240=4680, then 4680-500=4180.

## Result

**Answer.** 4440

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
