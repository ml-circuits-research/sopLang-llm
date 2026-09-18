# Explanation 365 — Optimization under constraints

## Explanation

1. The target needs habitat protected and loading new reduced, and no chosen option may bring habitat destroyed.
2. Concreting complete a the riverbank cannot be part of a solution, because its undesired effect introduces a forbidden effect.
3. The cheapest combination that covers every target condition is stopping the source, Restoration the riverbank, at total cost 4.
4. Every cheaper combination either leaves a target condition unsatisfied or introduces a forbidden effect.

Reference solution as printed in the source (form 15, 4 steps):

1. First we list the individual actions and check whether any one of them covers all target conditions by itself.
2. We combine only actions whose effects do not introduce a forbidden effect.
3. The least expensive combination which satisfies all targets is: stopping the source, restoration the riverbank, with total cost 4.
4. Any cheaper combination either leaves at least one target unsatisfied or introduces a forbidden effect.

## Result

**Answer.** Stopping the source, restoration the riverbank, total cost 4.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
