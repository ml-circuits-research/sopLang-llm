# Explanation 4.1 — The “Add 2” Machine 1

## Explanation

1. The machine adds 2 to every input, so it is a single fixed rule rather than a table of separate cases.
2. Running the rule forward on the given input 3 gives 3 + 2 = 5.
3. Running the rule backward inverts the addition: the input that produced 9 is 9 - 2 = 7.
4. Checking: 7 + 2 = 9, so both directions agree with the rule.

Reference solution as printed in the source (chapter 4, 3 steps):

1. For input 3, apply the rule: 3+2=5.
2. For output 9, undo the addition of 2: 9-2=7.
3. Check: 7+2=9.

## Result

**Answer.** Output 5; input 7.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
