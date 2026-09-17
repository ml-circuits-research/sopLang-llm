# Explanation 4.21 — Choose the Rule That Explains the Examples 1

## Explanation

1. Each candidate rule is tested against every example 2→5, 5→8, 7→10; a rule is kept only if it reproduces all of them.
2. The rule "add 3" maps every given input to its given output, while the other candidates fail on at least one example.
3. Applying the same rule to input 4 gives 7, so the rule generalizes beyond the examples that identified it.

Reference solution as printed in the source (chapter 4, 4 steps):

1. In the first example, output−input equals 3.
2. In the second and third examples, the difference is also 3.
3. Therefore the rule “add 3” explains all the examples.
4. Apply it: 4+3=7.

## Result

**Answer.** Rule: add 3; the output for 4 is 7.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
