# Explanation 2.5 — State After Two Changes 5

## Explanation

1. The box starts with 16, and the rules are applied in the printed order, so the state is updated once per rule instead of combining them.
2. The first rule makes the count 16 + 7 = 23.
3. The second rule then acts on 23: 23 - 2 = 21.
4. The order matters because the second rule is read against the result of the first, not against the starting count.

Reference solution as printed in the source (chapter 2, 4 steps):

1. The initial state is 16.
2. After the first transformation: 16+7=23.
3. After the second transformation: 23-2=21.
4. Check that the order of operations was respected: addition first, then subtraction.

## Result

**Answer.** 21

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
