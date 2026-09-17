# Explanation 29.5 — Parentheses change the rule

## Explanation

1. Parentheses fix the order of evaluation, so the two rules are not the same expression even though they use the same properties.
2. For a red square piece, the colours that are absent are false and only the described properties are true.
3. R1 evaluates the "or" inside the parentheses first and then conjoins with the shape, while R2 evaluates the "and" first and then disjoins; the different groupings give different truth values.

Reference solution as printed in the source (chapter 29, 4 steps):

1. For R1, “red or blue” is true, but “round” is false; therefore R1 is false.
2. For R2, the first alternative “red” is already true.
3. Inclusive “or” is true if at least one branch is true.
4. Therefore R2 is true.

## Result

**Answer.** R1 false; R2 true.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
