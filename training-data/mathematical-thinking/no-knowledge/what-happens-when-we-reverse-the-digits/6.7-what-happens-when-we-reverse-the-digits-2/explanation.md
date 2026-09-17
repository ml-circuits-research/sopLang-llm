# Explanation 6.7 — What Happens When We Reverse the Digits? 2

## Explanation

1. Number A uses tens digit 6 and ones digit 2, so with the given rule A = 10×6 + 2 = 62.
2. Reversing puts 2 in the tens place and 6 in the ones place, so B = 10×2 + 6 = 26.
3. Because the tens digit of A is larger, the reversed number is smaller, and the gap is 62 - 26 = 36.
4. The reversal is worth nine times the digit gap: 9×(6 - 2) = 36, which confirms the answer.

Reference solution as printed in the source (chapter 6, 4 steps):

1. A=10·6+2=62.
2. B=10·2+6=26.
3. Compare: 62>26.
4. The difference is 62-26=36.

## Result

**Answer.** A is larger by 36.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
