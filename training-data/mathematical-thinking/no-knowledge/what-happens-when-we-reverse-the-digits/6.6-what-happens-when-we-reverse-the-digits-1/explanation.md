# Explanation 6.6 — What Happens When We Reverse the Digits? 1

## Explanation

1. Number A uses tens digit 4 and ones digit 1, so with the given rule A = 10×4 + 1 = 41.
2. Reversing puts 1 in the tens place and 4 in the ones place, so B = 10×1 + 4 = 14.
3. Because the tens digit of A is larger, the reversed number is smaller, and the gap is 41 - 14 = 27.
4. The reversal is worth nine times the digit gap: 9×(4 - 1) = 27, which confirms the answer.

Reference solution as printed in the source (chapter 6, 4 steps):

1. A=10·4+1=41.
2. B=10·1+4=14.
3. Compare: 41>14.
4. The difference is 41-14=27.

## Result

**Answer.** A is larger by 27.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
