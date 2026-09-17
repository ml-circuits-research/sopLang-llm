# Explanation 4.22 — Choose the Rule That Explains the Examples 2

## Explanation

1. Each candidate rule is tested against every example 2→6, 5→9, 7→11; a rule is kept only if it reproduces all of them.
2. The rule "add 4" maps every given input to its given output, while the other candidates fail on at least one example.
3. Applying the same rule to input 5 gives 9, so the rule generalizes beyond the examples that identified it.

Reference solution as printed in the source (chapter 4, 4 steps):

1. In the first example, output−input equals 4.
2. In the second and third examples, the difference is also 4.
3. Therefore the rule “add 4” explains all the examples.
4. Apply it: 5+4=9.

## Result

**Answer.** Rule: add 4; the output for 5 is 9.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
