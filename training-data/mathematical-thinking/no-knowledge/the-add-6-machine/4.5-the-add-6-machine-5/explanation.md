# Explanation 4.5 — The “Add 6” Machine 5

## Explanation

1. The machine adds 6 to every input, so it is a single fixed rule rather than a table of separate cases.
2. Running the rule forward on the given input 11 gives 11 + 6 = 17.
3. Running the rule backward inverts the addition: the input that produced 21 is 21 - 6 = 15.
4. Checking: 15 + 6 = 21, so both directions agree with the rule.

Reference solution as printed in the source (chapter 4, 3 steps):

1. For input 11, apply the rule: 11+6=17.
2. For output 21, undo the addition of 6: 21-6=15.
3. Check: 15+6=21.

## Result

**Answer.** Output 17; input 15.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
