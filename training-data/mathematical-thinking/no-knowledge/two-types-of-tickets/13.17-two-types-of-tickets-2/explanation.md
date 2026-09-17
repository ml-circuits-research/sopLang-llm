# Explanation 13.17 — Two Types of Tickets 2

## Explanation

1. There are 7 tickets together, and a type A ticket costs 4 lei while a type B ticket costs 7 lei.
2. Assuming all 7 tickets were type A would cost 7 · 4 = 28 lei.
3. The real total is 37 lei, so 9 lei must be added by replacing A tickets with B tickets, each replacement adding 3 lei.
4. The number of replacements is 3, so there are 3 type B tickets and 7 − 3 = 4 type A tickets.

Reference solution as printed in the source (chapter 13, 5 steps):

1. If all 7 were type A, the cost would be 7×4=28 lei.
2. We need to reach 37, so 9 lei are missing.
3. Replacing one A with one B increases the cost by 7-4=3 lei.
4. The number of replacements is 9÷3=3. Therefore B=3, A=4.
5. Check: 4×4+3×7=37.

## Result

**Answer.** A=4, B=3.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
