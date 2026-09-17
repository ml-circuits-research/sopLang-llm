# Explanation 21.21 — Choose the Question That Splits Best

## Explanation

1. A question is balanced when the larger of its two answer groups is as small as possible.
2. "Is the number 1?" leaves up to 7 candidates, while "Is the number at most 4?" splits the 8 candidates into two groups of 4.
3. The second question keeps fewer candidates in the worst case, so Is the number at most 4? is the more balanced question.

Reference solution as printed in the source (chapter 21, 4 steps):

1. For Q1, the answer “yes” leaves 1 candidate, but “no” leaves 7.
2. For Q2, “yes” leaves {1,2,3,4}, while “no” leaves {5,6,7,8}.
3. The worst case for Q1 is 7 candidates; for Q2 it is 4.
4. Q2 reduces the space of possibilities more reliably.

## Result

**Answer.** Q2: “Is the number at most 4?”.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
