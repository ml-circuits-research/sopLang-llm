# Explanation 613 — Sets, intersections, and differences

## Explanation

1. Each labelled property becomes the set of the cases whose observation list carries it, so A is the has good insulation set, B is the uses natural light set, C is the switches off unnecessary loads set.
2. B∩C keeps room D; A\B keeps room A, room E; A∪C keeps room A, room B, room E, room D.
3. An intersection keeps the cases present in both operands, a set difference removes the cases of the right operand, and a union keeps the cases of either operand; each result is listed in the order the cases appear in the data block.
4. The members of the requested expressions are the only cases that satisfy every stated membership test, so the lists above are exactly the sets the question asks for.

Reference solution as printed in the source (form 23, 4 steps):

1. A={room A, room B, room E}; B={room B, room C, room D}; C={room D, room E}.
2. B∩C={room D}.
3. A\B={room A, room E}.
4. A∪C={room A, room B, room E, room D}. The intersection requires simultaneous membership; set difference removes elements that belong to the excluded set; union keeps elements belonging to either set.

## Result

**Answer.** B∩C={room D}; A\B={room A, room E}; A∪C={room A, room B, room E, room D}.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
