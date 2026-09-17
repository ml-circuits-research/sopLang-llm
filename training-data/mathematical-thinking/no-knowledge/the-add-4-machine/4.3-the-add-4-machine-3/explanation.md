# Explanation 4.3 — The “Add 4” Machine 3

## Explanation

1. The machine adds 4 to every input, so it is a single fixed rule rather than a table of separate cases.
2. Running the rule forward on the given input 7 gives 7 + 4 = 11.
3. Running the rule backward inverts the addition: the input that produced 15 is 15 - 4 = 11.
4. Checking: 11 + 4 = 15, so both directions agree with the rule.

Reference solution as printed in the source (chapter 4, 3 steps):

1. For input 7, apply the rule: 7+4=11.
2. For output 15, undo the addition of 4: 15-4=11.
3. Check: 11+4=15.

## Result

**Answer.** Output 11; input 11.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
