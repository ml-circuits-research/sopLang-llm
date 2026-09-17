# Explanation 2.1 — State After Two Changes 1

## Explanation

1. The box starts with 8, and the rules are applied in the printed order, so the state is updated once per rule instead of combining them.
2. The first rule makes the count 8 + 3 = 11.
3. The second rule then acts on 11: 11 - 1 = 10.
4. The order matters because the second rule is read against the result of the first, not against the starting count.

Reference solution as printed in the source (chapter 2, 4 steps):

1. The initial state is 8.
2. After the first transformation: 8+3=11.
3. After the second transformation: 11-1=10.
4. Check that the order of operations was respected: addition first, then subtraction.

## Result

**Answer.** 10

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
