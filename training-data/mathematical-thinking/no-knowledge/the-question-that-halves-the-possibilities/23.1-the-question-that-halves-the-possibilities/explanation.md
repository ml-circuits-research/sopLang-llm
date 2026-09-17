# Explanation 23.1 — The question that halves the possibilities

## Explanation

1. For a yes/no question the worst case is the larger of its two answer groups, because the unhelpful answer leaves that many candidates.
2. "Is the number 1?" can leave three candidates while the threshold question splits the list in half, so Is the number less than or equal to 2? is the better question.

Reference solution as printed in the source (chapter 23, 4 steps):

1. For the first question, a “no” answer leaves three possible numbers.
2. For the second, “yes” leaves {1,2}, while “no” leaves {3,4}.
3. The worst case is 3 possibilities for the first question and 2 for the second.
4. The second question gives a more balanced split.

## Result

**Answer.** “Is the number less than or equal to 2?”.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
