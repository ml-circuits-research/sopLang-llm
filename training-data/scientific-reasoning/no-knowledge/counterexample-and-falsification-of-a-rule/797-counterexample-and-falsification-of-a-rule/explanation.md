# Explanation 797 — Counterexample and falsification of a rule

## Explanation

1. The claim has the form "every case with has a long effort arm also has changes the direction of the force", so the cases that can refute it are the ones carrying has a long effort arm.
2. The observation lever D carries has a long effort arm but does not carry changes the direction of the force.
3. One case of that shape makes the universal statement false, and the printed counterexample is the first such row of the table.
4. Refuting the claim only shows that the proposed rule fails; it does not prove the opposite rule either.

Reference solution as printed in the source (form 32, 4 steps):

1. We focus on cases with the property “has a long effort arm”.
2. Lever D has “has a long effort arm”, but does not have “changes the direction of the force”.
3. A statement of the form “all X have Y” is false as soon as there is one X that is not Y.
4. The counterexample falsifies the proposed claim without automatically proving an alternative rule.

## Result

**Answer.** The statement is false. Counterexample: lever D.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
