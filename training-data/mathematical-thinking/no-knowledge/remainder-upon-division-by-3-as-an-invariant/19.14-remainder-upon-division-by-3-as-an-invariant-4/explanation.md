# Explanation 19.14 — Remainder upon Division by 3 as an Invariant 4

## Explanation

1. Adding a complete group of 3 does not change the remainder upon division by 3, so that remainder is an invariant of every reachable value.
2. 25 leaves remainder 1 and 29 leaves remainder 2.
3. The remainders differ, so no number of added groups can turn the start into the target.

Reference solution as printed in the source (chapter 19, 4 steps):

1. 25 leaves remainder 1 when divided by 3.
2. Any +3 move preserves the same remainder 1.
3. 29 leaves remainder 2.
4. Since the remainders are different, the target is impossible.

**Source answer.** The source prints this answer in a form the English-only dataset policy cannot ship; the source registration declares the English equivalent used here, and the printed form stays in the book.

## Result

**Answer.** No.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
