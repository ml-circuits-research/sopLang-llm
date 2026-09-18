# Explanation 568 — Sets, intersections, and differences

## Explanation

1. Each labelled property becomes the set of the cases whose observation list carries it, so A is the keeps air trapped set, B is the can change its volume set, C is the has an opening set.
2. B∩C keeps the tube D, the piston E; A\B keeps the container C; A∪C keeps the balloon B, the container C, the piston E, syringe A, the tube D.
3. An intersection keeps the cases present in both operands, a set difference removes the cases of the right operand, and a union keeps the cases of either operand; each result is listed in the order the cases appear in the data block.
4. The members of the requested expressions are the only cases that satisfy every stated membership test, so the lists above are exactly the sets the question asks for.

Reference solution as printed in the source (form 23, 4 steps):

1. A={the balloon B, the container C, the piston E}; B={the balloon B, the tube D, the piston E}; C={syringe A, the container C, the tube D, the piston E}.
2. B∩C={the tube D, the piston E}.
3. A\B={the container C}.
4. A∪C={the balloon B, the container C, the piston E, syringe A, the tube D}. The intersection requires simultaneous membership; set difference removes elements that belong to the excluded set; union keeps elements belonging to either set.

## Result

**Answer.** B∩C={the tube D, the piston E}; A\B={the container C}; A∪C={the balloon B, the container C, the piston E, syringe A, the tube D}.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
