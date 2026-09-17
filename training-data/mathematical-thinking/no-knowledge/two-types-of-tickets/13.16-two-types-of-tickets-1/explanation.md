# Explanation 13.16 — Two Types of Tickets 1

## Explanation

1. There are 8 tickets together, and a type A ticket costs 3 lei while a type B ticket costs 5 lei.
2. Assuming all 8 tickets were type A would cost 8 · 3 = 24 lei.
3. The real total is 34 lei, so 10 lei must be added by replacing A tickets with B tickets, each replacement adding 2 lei.
4. The number of replacements is 5, so there are 5 type B tickets and 8 − 5 = 3 type A tickets.

Reference solution as printed in the source (chapter 13, 5 steps):

1. If all 8 were type A, the cost would be 8×3=24 lei.
2. We need to reach 34, so 10 lei are missing.
3. Replacing one A with one B increases the cost by 5-3=2 lei.
4. The number of replacements is 10÷2=5. Therefore B=5, A=3.
5. Check: 3×3+5×5=34.

## Result

**Answer.** A=3, B=5.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
