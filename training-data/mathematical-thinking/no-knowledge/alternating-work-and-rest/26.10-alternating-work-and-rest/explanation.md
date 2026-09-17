# Explanation 26.10 — Alternating work and rest

## Explanation

1. The robot repeats the two-state cycle works, charges, and the text fixes works as the behaviour of day 1.
2. Counting from day 1, day 17 sits at position 0 of that cycle because 16 modulo 2 keeps only the remainder.
3. That position holds works, so on day 17 the robot works.

Reference solution as printed in the source (chapter 26, 4 steps):

1. The cycle is 2 days long.
2. Days 1,3,5,... are the first state of the cycle.
3. 17 is odd.
4. Therefore day 17 is a work day.

## Result

**Answer.** It works.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
