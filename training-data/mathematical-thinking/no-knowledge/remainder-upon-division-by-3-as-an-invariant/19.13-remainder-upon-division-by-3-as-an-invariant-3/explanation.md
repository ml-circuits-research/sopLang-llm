# Explanation 19.13 — Remainder upon Division by 3 as an Invariant 3

## Explanation

1. Adding a complete group of 3 does not change the remainder upon division by 3, so that remainder is an invariant of every reachable value.
2. 20 leaves remainder 2 and 29 leaves remainder 2.
3. The remainders agree, and the target is ahead of the start, so it is reachable: 9 ÷ 3 whole groups are added.

Reference solution as printed in the source (chapter 19, 4 steps):

1. 20 leaves remainder 2 when divided by 3.
2. Any +3 move preserves the same remainder 2.
3. 29 leaves remainder 2.
4. Since the remainders are equal, the target is compatible.

**Source answer.** The source prints this answer in a form the English-only dataset policy cannot ship; the source registration declares the English equivalent used here, and the printed form stays in the book.

## Result

**Answer.** Yes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
