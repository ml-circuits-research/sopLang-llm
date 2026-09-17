# Explanation 4.4 — The “Add 5” Machine 4

## Explanation

1. The machine adds 5 to every input, so it is a single fixed rule rather than a table of separate cases.
2. Running the rule forward on the given input 9 gives 9 + 5 = 14.
3. Running the rule backward inverts the addition: the input that produced 18 is 18 - 5 = 13.
4. Checking: 13 + 5 = 18, so both directions agree with the rule.

Reference solution as printed in the source (chapter 4, 3 steps):

1. For input 9, apply the rule: 9+5=14.
2. For output 18, undo the addition of 5: 18-5=13.
3. Check: 13+5=18.

## Result

**Answer.** Output 14; input 13.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
