# Explanation 6.10 — What Happens When We Reverse the Digits? 5

## Explanation

1. Number A uses tens digit 9 and ones digit 4, so with the given rule A = 10×9 + 4 = 94.
2. Reversing puts 4 in the tens place and 9 in the ones place, so B = 10×4 + 9 = 49.
3. Because the tens digit of A is larger, the reversed number is smaller, and the gap is 94 - 49 = 45.
4. The reversal is worth nine times the digit gap: 9×(9 - 4) = 45, which confirms the answer.

Reference solution as printed in the source (chapter 6, 4 steps):

1. A=10·9+4=94.
2. B=10·4+9=49.
3. Compare: 94>49.
4. The difference is 94-49=45.

## Result

**Answer.** A is larger by 45.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
