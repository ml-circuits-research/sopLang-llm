# Explanation 6.9 — What Happens When We Reverse the Digits? 4

## Explanation

1. Number A uses tens digit 8 and ones digit 5, so with the given rule A = 10×8 + 5 = 85.
2. Reversing puts 5 in the tens place and 8 in the ones place, so B = 10×5 + 8 = 58.
3. Because the tens digit of A is larger, the reversed number is smaller, and the gap is 85 - 58 = 27.
4. The reversal is worth nine times the digit gap: 9×(8 - 5) = 27, which confirms the answer.

Reference solution as printed in the source (chapter 6, 4 steps):

1. A=10·8+5=85.
2. B=10·5+8=58.
3. Compare: 85>58.
4. The difference is 85-58=27.

## Result

**Answer.** A is larger by 27.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
