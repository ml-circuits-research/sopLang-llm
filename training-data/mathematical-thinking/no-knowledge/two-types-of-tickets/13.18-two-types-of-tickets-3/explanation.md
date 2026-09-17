# Explanation 13.18 — Two Types of Tickets 3

## Explanation

1. There are 9 tickets together, and a type A ticket costs 5 lei while a type B ticket costs 8 lei.
2. Assuming all 9 tickets were type A would cost 9 · 5 = 45 lei.
3. The real total is 57 lei, so 12 lei must be added by replacing A tickets with B tickets, each replacement adding 3 lei.
4. The number of replacements is 4, so there are 4 type B tickets and 9 − 4 = 5 type A tickets.

Reference solution as printed in the source (chapter 13, 5 steps):

1. If all 9 were type A, the cost would be 9×5=45 lei.
2. We need to reach 57, so 12 lei are missing.
3. Replacing one A with one B increases the cost by 8-5=3 lei.
4. The number of replacements is 12÷3=4. Therefore B=4, A=5.
5. Check: 5×5+4×8=57.

## Result

**Answer.** A=5, B=4.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
