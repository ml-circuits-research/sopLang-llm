# Explanation 578 — Sets, intersections, and differences

## Explanation

1. Each labelled property becomes the set of the cases whose observation list carries it, so A is the reflects toward right set, B is the is diagonally oriented set, C is the is on the route set.
2. A∩B keeps mirror A, the source D; A∩C keeps the source D; C\A keeps the screen C, the obstacle E.
3. An intersection keeps the cases present in both operands, a set difference removes the cases of the right operand, and a union keeps the cases of either operand; each result is listed in the order the cases appear in the data block.
4. The members of the requested expressions are the only cases that satisfy every stated membership test, so the lists above are exactly the sets the question asks for.

Reference solution as printed in the source (form 23, 4 steps):

1. A={mirror A, mirror B, the source D}; B={mirror A, the screen C, the source D}; C={the screen C, the source D, the obstacle E}.
2. A∩B={mirror A, the source D}.
3. A∩C={the source D}.
4. C\A={the screen C, the obstacle E}. The intersection requires simultaneous membership; set difference removes elements that belong to the excluded set; union keeps elements belonging to either set.

## Result

**Answer.** A∩B={mirror A, the source D}; A∩C={the source D}; C\A={the screen C, the obstacle E}.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
