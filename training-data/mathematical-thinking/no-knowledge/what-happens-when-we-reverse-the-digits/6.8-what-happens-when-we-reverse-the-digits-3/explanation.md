# Explanation 6.8 — What Happens When We Reverse the Digits? 3

## Explanation

1. Number A uses tens digit 7 and ones digit 3, so with the given rule A = 10×7 + 3 = 73.
2. Reversing puts 3 in the tens place and 7 in the ones place, so B = 10×3 + 7 = 37.
3. Because the tens digit of A is larger, the reversed number is smaller, and the gap is 73 - 37 = 36.
4. The reversal is worth nine times the digit gap: 9×(7 - 3) = 36, which confirms the answer.

Reference solution as printed in the source (chapter 6, 4 steps):

1. A=10·7+3=73.
2. B=10·3+7=37.
3. Compare: 73>37.
4. The difference is 73-37=36.

## Result

**Answer.** A is larger by 36.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
