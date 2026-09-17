# Explanation 19.1 — The “Even/Odd” Invariant 1

## Explanation

1. The only allowed move adds 2 to the current value, so every reachable value has the form 14 + k×2 for some whole number of moves k.
2. That means the difference between any reachable value and the start is a positive multiple of 2, and it can never be negative.
3. The difference to 21 is 21 − 14 = 7, which is not a multiple of 2.
4. So the move preserves the parity of the starting value and the target is impossible to reach; the invariant, not a search, settles the answer.

Reference solution as printed in the source (chapter 19, 4 steps):

1. 14 is even.
2. Adding 2 adds one pair, so the result remains even after any number of moves.
3. 21 is odd because it is 7 greater than an even number.
4. An odd state cannot be reached if the property “even” is preserved.

## Result

**Answer.** No, 21 is impossible to reach.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
