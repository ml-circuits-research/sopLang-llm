# Explanation 6.11 — Number from Allowed Digits 1

## Explanation

1. The two digits must be different and taken from 2, 4, 7, and the tens digit cannot be zero, so only six ordered pairs are possible.
2. Building each pair as 10×tens + ones and keeping those strictly greater than 40 and strictly less than 70 leaves a short candidate list.
3. Comparing the survivors and taking the smallest gives 42, which satisfies both limits and uses two different allowed digits.

Reference solution as printed in the source (chapter 6, 4 steps):

1. Form two-digit candidates from the given digits, without repetition.
2. Eliminate candidates ≤40 or ≥70.
3. From those remaining, choose the smallest: 42.
4. Check: 40<42<70, and its digits are allowed and distinct.

## Result

**Answer.** 42

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
