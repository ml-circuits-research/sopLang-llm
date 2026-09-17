# Explanation 4.23 — Choose the Rule That Explains the Examples 3

## Explanation

1. Each candidate rule is tested against every example 2→7, 5→10, 7→12; a rule is kept only if it reproduces all of them.
2. The rule "add 5" maps every given input to its given output, while the other candidates fail on at least one example.
3. Applying the same rule to input 6 gives 11, so the rule generalizes beyond the examples that identified it.

Reference solution as printed in the source (chapter 4, 4 steps):

1. In the first example, output−input equals 5.
2. In the second and third examples, the difference is also 5.
3. Therefore the rule “add 5” explains all the examples.
4. Apply it: 6+5=11.

## Result

**Answer.** Rule: add 5; the output for 6 is 11.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
