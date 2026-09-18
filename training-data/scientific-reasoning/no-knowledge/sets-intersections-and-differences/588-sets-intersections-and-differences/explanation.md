# Explanation 588 — Sets, intersections, and differences

## Explanation

1. Each labelled property becomes the set of the cases whose observation list carries it, so A is the is conductor set, B is the is insulated on the outside set, C is the can close the path set.
2. A∩B∩C keeps nothing; B\C keeps the clamp B, the seed coat C; A∪B keeps the wire A, the clamp B, the bulb E, the seed coat C, the switch D.
3. An intersection keeps the cases present in both operands, a set difference removes the cases of the right operand, and a union keeps the cases of either operand; each result is listed in the order the cases appear in the data block.
4. The members of the requested expressions are the only cases that satisfy every stated membership test, so the lists above are exactly the sets the question asks for.

Reference solution as printed in the source (form 23, 4 steps):

1. A={the wire A, the clamp B, the bulb E}; B={the clamp B, the seed coat C, the switch D}; C={the switch D, the bulb E}.
2. A∩B∩C=∅.
3. B\C={the clamp B, the seed coat C}.
4. A∪B={the wire A, the clamp B, the bulb E, the seed coat C, the switch D}. The intersection requires simultaneous membership; set difference removes elements that belong to the excluded set; union keeps elements belonging to either set.

## Result

**Answer.** A∩B∩C=∅; B\C={the clamp B, the seed coat C}; A∪B={the wire A, the clamp B, the bulb E, the seed coat C, the switch D}.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
