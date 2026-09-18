# Explanation 907 — Anecdote beside a comparison — Redbridge — case 7

## Explanation

1. Dora in Redbridge improved after tea, which is an anecdote: a sample of one.
2. The printed card reports a 200-person comparison in which tea and rest-only eased at the same listed rate, and ease without the tea is the point of the comparison.
3. Eli treats the story as equal to the card, while Fran keeps one story and one comparison on separate layers.
4. Both can be true at once, but only the comparison card should lead a cautious decision about whether the tea did the work.

Reference solution as printed in the source (section 91, 5 steps):

1. Anecdote = sample one.
2. Card = comparison.
3. Both can be true at once.
4. They are not the same family of support.
5. Decide “did tea do it?” with the stronger design.

## Result

**Answer.** The comparison card. The anecdote is real about Dora and does not upgrade the trial.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
