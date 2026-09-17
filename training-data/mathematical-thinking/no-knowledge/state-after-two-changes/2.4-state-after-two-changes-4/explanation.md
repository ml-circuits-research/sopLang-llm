# Explanation 2.4 — State After Two Changes 4

## Explanation

1. The box starts with 14, and the rules are applied in the printed order, so the state is updated once per rule instead of combining them.
2. The first rule makes the count 14 + 6 = 20.
3. The second rule then acts on 20: 20 - 1 = 19.
4. The order matters because the second rule is read against the result of the first, not against the starting count.

Reference solution as printed in the source (chapter 2, 4 steps):

1. The initial state is 14.
2. After the first transformation: 14+6=20.
3. After the second transformation: 20-1=19.
4. Check that the order of operations was respected: addition first, then subtraction.

## Result

**Answer.** 19

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
