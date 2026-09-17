# Explanation 13.19 — Two Types of Tickets 4

## Explanation

1. There are 8 tickets together, and a type A ticket costs 6 lei while a type B ticket costs 10 lei.
2. Assuming all 8 tickets were type A would cost 8 · 6 = 48 lei.
3. The real total is 64 lei, so 16 lei must be added by replacing A tickets with B tickets, each replacement adding 4 lei.
4. The number of replacements is 4, so there are 4 type B tickets and 8 − 4 = 4 type A tickets.

Reference solution as printed in the source (chapter 13, 5 steps):

1. If all 8 were type A, the cost would be 8×6=48 lei.
2. We need to reach 64, so 16 lei are missing.
3. Replacing one A with one B increases the cost by 10-6=4 lei.
4. The number of replacements is 16÷4=4. Therefore B=4, A=4.
5. Check: 4×6+4×10=64.

## Result

**Answer.** A=4, B=4.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
