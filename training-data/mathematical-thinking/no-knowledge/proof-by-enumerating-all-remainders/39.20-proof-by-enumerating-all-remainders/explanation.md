# Explanation 39.20 — Proof by enumerating all remainders

## Explanation

1. Every integer leaves one of the listed remainders on division, so splitting into those cases covers all integers.
2. In each remainders case exactly one of the consecutive integers is divisible, so the claim holds for all of them.

Reference solution as printed in the source (chapter 39, 4 steps):

1. If n has remainder 0, the first is divisible by 3, and the next two have remainders 1, 2.
2. If n has remainder 1, n+1 has 2 and n+2 returns to 0.
3. If n has remainder 2, n+1 has 0 and n+2 has 1.
4. In each case, exactly one remainder 0 appears.

## Result

**Answer.** Exactly one of three consecutive integers is divisible by 3.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
