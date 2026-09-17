# Explanation 16.20 — Algorithm on a Large Number 5

## Explanation

1. The two instructions are applied in the order printed, so the additions and the subtraction combine into one expression over the input value.
2. Starting from 8450 and adding 900 gives 9350; subtracting 275 then gives 9075.
3. The check runs the program backwards: from 9075, adding 275 and removing 900 returns 8450, so the output is consistent.

Reference solution as printed in the source (chapter 16, 3 steps):

1. After instruction 1: 8450+900=9350.
2. After instruction 2: 9350-275=9075.
3. Reverse check: 9075+275=9350, then 9350-900=8450.

## Result

**Answer.** 9075

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
