# Explanation 21.7 — A Witness for the Word “Exists”

## Explanation

1. An "exists" statement is proved by exhibiting one element that satisfies the condition, not by checking all of them.
2. Testing 2, 5, 8, 11 against the condition "greater than 10" leaves exactly the card 11.
3. That card is the witness, and no other card in the list can play the role.

Reference solution as printed in the source (chapter 21, 4 steps):

1. Check the condition x>10 one by one.
2. 2, 5, and 8 do not satisfy it.
3. 11 is greater than 10.
4. One example is enough to confirm the statement “there exists.”

## Result

**Answer.** Card 11.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
