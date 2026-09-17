# Explanation 38.17 — Run-length coding can enlarge a message

## Explanation

1. With no run longer than one symbol, every symbol gains its own count, so ABCD becomes 1A1B1C1D.
2. That is 8 characters against the original 4, so the coded form is longer rather than shorter.

Reference solution as printed in the source (chapter 38, 4 steps):

1. Each isolated symbol also receives a 1.
2. The result has 8 characters.
3. The original has 4.
4. The method enlarges the message in this case.

## Result

**Answer.** No; it makes it longer.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
