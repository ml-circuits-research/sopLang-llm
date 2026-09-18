# Explanation 832 — Counterexample and falsification of a rule

## Explanation

1. The claim has the form "every case with is porous also has is hard", so the cases that can refute it are the ones carrying is porous.
2. The observation the curtain B carries is porous but does not carry is hard.
3. One case of that shape makes the universal statement false, and the printed counterexample is the first such row of the table.
4. Refuting the claim only shows that the proposed rule fails; it does not prove the opposite rule either.

Reference solution as printed in the source (form 32, 4 steps):

1. We focus on cases with the property “is porous”.
2. The curtain B has “is porous”, but does not have “is hard”.
3. A statement of the form “all X have Y” is false as soon as there is one X that is not Y.
4. The counterexample falsifies the proposed claim without automatically proving an alternative rule.

## Result

**Answer.** The statement is false. Counterexample: the curtain B.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
