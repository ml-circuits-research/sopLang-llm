# Explanation 4.3.6 — Multi-criteria decision

## Explanation

1. Each option's weighted score adds, over the 3 criteria, the criterion weight times the option's score; with the stated weights 50%/30%/20%, a criterion carrying more weight moves the total proportionally more.
2. Every option score lies between 0 and 10, and because the weights are fractions of one whole the weighted score stays on that same scale.
3. The decision rule takes the largest of the weighted sums, and C alone reaches it, so the ranking is read off those sums rather than from any single criterion.
4. The ranking is conditional on the stated weights: another weighting, or one more criterion, can reorder the options, so the outcome reports the preferences of the model instead of a universal truth.

Reference solution as printed in the source (template 18, 4 steps):

1. A: 0.50×7 + 0.30×9 + 0.20×7 = 7.60.
2. B: 0.50×8 + 0.30×8 + 0.20×5 = 7.40.
3. C: 0.50×9 + 0.30×8 + 0.20×7 = 8.30.
4. The maximum is 8.30. A different weighting scheme could change the ranking, so the result is conditional on the model's stated preferences.

## Result

**Answer.** Scores: A=7.60, B=7.40, C=8.30. Winner(s) under these weights: C.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
