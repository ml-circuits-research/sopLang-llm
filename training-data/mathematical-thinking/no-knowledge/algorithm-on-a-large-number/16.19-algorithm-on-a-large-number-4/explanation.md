# Explanation 16.19 — Algorithm on a Large Number 4

## Explanation

1. The two instructions are applied in the order printed, so the additions and the subtraction combine into one expression over the input value.
2. Starting from 7100 and adding 650 gives 7750; subtracting 450 then gives 7300.
3. The check runs the program backwards: from 7300, adding 450 and removing 650 returns 7100, so the output is consistent.

Reference solution as printed in the source (chapter 16, 3 steps):

1. After instruction 1: 7100+650=7750.
2. After instruction 2: 7750-450=7300.
3. Reverse check: 7300+450=7750, then 7750-650=7100.

## Result

**Answer.** 7300

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
