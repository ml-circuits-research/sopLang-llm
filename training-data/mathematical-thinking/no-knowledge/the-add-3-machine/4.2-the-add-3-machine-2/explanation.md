# Explanation 4.2 — The “Add 3” Machine 2

## Explanation

1. The machine adds 3 to every input, so it is a single fixed rule rather than a table of separate cases.
2. Running the rule forward on the given input 5 gives 5 + 3 = 8.
3. Running the rule backward inverts the addition: the input that produced 12 is 12 - 3 = 9.
4. Checking: 9 + 3 = 12, so both directions agree with the rule.

Reference solution as printed in the source (chapter 4, 3 steps):

1. For input 5, apply the rule: 5+3=8.
2. For output 12, undo the addition of 3: 12-3=9.
3. Check: 9+3=12.

## Result

**Answer.** Output 8; input 9.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
