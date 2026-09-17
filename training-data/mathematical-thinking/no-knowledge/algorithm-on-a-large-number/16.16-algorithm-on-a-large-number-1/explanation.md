# Explanation 16.16 — Algorithm on a Large Number 1

## Explanation

1. The two instructions are applied in the order printed, so the additions and the subtraction combine into one expression over the input value.
2. Starting from 2350 and adding 700 gives 3050; subtracting 120 then gives 2930.
3. The check runs the program backwards: from 2930, adding 120 and removing 700 returns 2350, so the output is consistent.

Reference solution as printed in the source (chapter 16, 3 steps):

1. After instruction 1: 2350+700=3050.
2. After instruction 2: 3050-120=2930.
3. Reverse check: 2930+120=3050, then 3050-700=2350.

## Result

**Answer.** 2930

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
