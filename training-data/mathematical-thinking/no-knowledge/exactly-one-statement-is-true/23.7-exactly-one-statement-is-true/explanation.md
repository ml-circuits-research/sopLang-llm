# Explanation 23.7 — Exactly one statement is true

## Explanation

1. Each candidate is checked against the 2 labelled statements, and only the candidates whose number of true statements equals 1 survive.
2. Trying every candidate one at a time leaves 2, so the exact statements pin down exactly this set.

Reference solution as printed in the source (chapter 23, 4 steps):

1. For 2: A is true, B is false → exactly one is true.
2. For 3: A is false, B is false → zero are true.
3. For 4: A is true, B is true → two are true.
4. The only compatible candidate is 2.

## Result

**Answer.** 2.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
