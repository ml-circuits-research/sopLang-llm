# Explanation 583 — Sets, intersections, and differences

## Explanation

1. Each labelled property becomes the set of the cases whose observation list carries it, so A is the is hard set, B is the is porous set, C is the absorbs a lot in the model set.
2. B∩C keeps the floor D, the ceiling E; A\B keeps the wall A; A∪C keeps the wall A, the panel C, the ceiling E, the floor D.
3. An intersection keeps the cases present in both operands, a set difference removes the cases of the right operand, and a union keeps the cases of either operand; each result is listed in the order the cases appear in the data block.
4. The members of the requested expressions are the only cases that satisfy every stated membership test, so the lists above are exactly the sets the question asks for.

Reference solution as printed in the source (form 23, 4 steps):

1. A={the wall A, the panel C, the ceiling E}; B={the curtain B, the panel C, the floor D, the ceiling E}; C={the wall A, the floor D, the ceiling E}.
2. B∩C={the floor D, the ceiling E}.
3. A\B={the wall A}.
4. A∪C={the wall A, the panel C, the ceiling E, the floor D}. The intersection requires simultaneous membership; set difference removes elements that belong to the excluded set; union keeps elements belonging to either set.

## Result

**Answer.** B∩C={the floor D, the ceiling E}; A\B={the wall A}; A∪C={the wall A, the panel C, the ceiling E, the floor D}.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
