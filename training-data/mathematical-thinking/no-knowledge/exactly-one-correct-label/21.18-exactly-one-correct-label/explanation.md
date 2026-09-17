# Explanation 21.18 — Exactly One Correct Label

## Explanation

1. Exactly one of the three labels is already known to be correct, and opening A confirms that its label matches its contents.
2. With the single correct label used up on box A, neither of the other labels can be correct.
3. Therefore the labels on boxes B and C are both wrong.

Reference solution as printed in the source (chapter 21, 4 steps):

1. The observation from A shows that its label is correct.
2. The rule says “exactly one” is correct, not “at least one.”
3. If B or C were also correct, we would have at least two correct labels.
4. Therefore, both remaining labels are wrong.

## Result

**Answer.** The labels on boxes B and C are both wrong.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
