# Explanation 13.20 — Two Types of Tickets 5

## Explanation

1. There are 10 tickets together, and a type A ticket costs 7 lei while a type B ticket costs 11 lei.
2. Assuming all 10 tickets were type A would cost 10 · 7 = 70 lei.
3. The real total is 86 lei, so 16 lei must be added by replacing A tickets with B tickets, each replacement adding 4 lei.
4. The number of replacements is 4, so there are 4 type B tickets and 10 − 4 = 6 type A tickets.

Reference solution as printed in the source (chapter 13, 5 steps):

1. If all 10 were type A, the cost would be 10×7=70 lei.
2. We need to reach 86, so 16 lei are missing.
3. Replacing one A with one B increases the cost by 11-7=4 lei.
4. The number of replacements is 16÷4=4. Therefore B=4, A=6.
5. Check: 6×7+4×11=86.

## Result

**Answer.** A=6, B=4.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
