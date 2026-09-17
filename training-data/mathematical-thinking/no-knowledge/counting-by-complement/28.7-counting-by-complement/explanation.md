# Explanation 28.7 — Counting by complement

## Explanation

1. Counting the complement asks for all 9 two-digit codes except those with two equal digits.
2. The equal codes are the repetitions of each of the 3 digits, so there are 3 of them.
3. 9 − 3 = 6 codes with two different digits.

Reference solution as printed in the source (chapter 28, 4 steps):

1. With repetition there are 3 choices for each position: 9 codes.
2. The equal-digit cases are 11,22,33, so there are 3.
3. All other codes have different digits.
4. 9−3=6.

## Result

**Answer.** 6 codes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
