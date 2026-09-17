# Explanation 23.8 — Exactly two statements are true

## Explanation

1. Each candidate is checked against the 3 labelled statements, and only the candidates whose number of true statements equals 2 survive.
2. Trying every candidate one at a time leaves 4, 5, and 6, so the exact statements pin down exactly this set.

Reference solution as printed in the source (chapter 23, 4 steps):

1. For 4: A=false, B=true, C=true → two.
2. For 5: A=true, B=false, C=true → two.
3. For 6: A=true, B=true, C=false → two.
4. All three candidates satisfy the rule, so the rule is not sufficient for a unique answer.

## Result

**Answer.** It cannot be determined; 4, 5, and 6 are all compatible.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
