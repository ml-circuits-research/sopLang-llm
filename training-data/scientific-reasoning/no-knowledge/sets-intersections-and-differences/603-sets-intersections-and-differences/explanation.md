# Explanation 603 — Sets, intersections, and differences

## Explanation

1. Each labelled property becomes the set of the cases whose observation list carries it, so A is the has suitable water set, B is the has a suitable temperature set, C is the has visits of pollinators set.
2. A∩B∩C keeps the sector D; B\C keeps the sector A; A∪B keeps the sector A, the sector B, the sector D, the sector C.
3. An intersection keeps the cases present in both operands, a set difference removes the cases of the right operand, and a union keeps the cases of either operand; each result is listed in the order the cases appear in the data block.
4. The members of the requested expressions are the only cases that satisfy every stated membership test, so the lists above are exactly the sets the question asks for.

Reference solution as printed in the source (form 23, 4 steps):

1. A={the sector A, the sector B, the sector D}; B={the sector A, the sector C, the sector D}; C={the sector C, the sector D, the sector E}.
2. A∩B∩C={the sector D}.
3. B\C={the sector A}.
4. A∪B={the sector A, the sector B, the sector D, the sector C}. The intersection requires simultaneous membership; set difference removes elements that belong to the excluded set; union keeps elements belonging to either set.

## Result

**Answer.** A∩B∩C={the sector D}; B\C={the sector A}; A∪B={the sector A, the sector B, the sector D, the sector C}.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
