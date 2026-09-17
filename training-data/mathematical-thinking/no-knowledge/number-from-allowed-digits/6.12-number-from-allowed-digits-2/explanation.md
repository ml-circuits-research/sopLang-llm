# Explanation 6.12 — Number from Allowed Digits 2

## Explanation

1. The two digits must be different and taken from 1, 5, 8, and the tens digit cannot be zero, so only six ordered pairs are possible.
2. Building each pair as 10×tens + ones and keeping those strictly greater than 50 and strictly less than 90 leaves a short candidate list.
3. Comparing the survivors and taking the smallest gives 51, which satisfies both limits and uses two different allowed digits.

Reference solution as printed in the source (chapter 6, 4 steps):

1. Form two-digit candidates from the given digits, without repetition.
2. Eliminate candidates ≤50 or ≥90.
3. From those remaining, choose the smallest: 51.
4. Check: 50<51<90, and its digits are allowed and distinct.

## Result

**Answer.** 51

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
