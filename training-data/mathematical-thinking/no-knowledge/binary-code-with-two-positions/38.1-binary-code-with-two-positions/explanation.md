# Explanation 38.1 — Binary code with two positions

## Explanation

1. The code has 2 positions and each position can take 2 symbols, so the choices are independent.
2. Counting every combination in positional order, from all symbols equal to the first one up to all equal to the last, visits each code exactly once.
3. The complete list has 4 codes: 00, 01, 10, 11.

Reference solution as printed in the source (chapter 38, 4 steps):

1. The first position has 2 choices.
2. The second has 2 choices.
3. Enumerate systematically: 00, 01, 10, 11.
4. There are 4 codes.

## Result

**Answer.** 00, 01, 10, 11.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
