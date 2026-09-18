# Explanation 528 — Sets, intersections, and differences

## Explanation

1. Each labelled property becomes the set of the cases whose observation list carries it, so A is the is rigid set, B is the can transmit force set, C is the can actively shorten set.
2. A∩B∩C keeps the tendon D; B\C keeps the bone A; A∪B keeps the bone A, the joint B, the tendon D, the muscle C.
3. An intersection keeps the cases present in both operands, a set difference removes the cases of the right operand, and a union keeps the cases of either operand; each result is listed in the order the cases appear in the data block.
4. The members of the requested expressions are the only cases that satisfy every stated membership test, so the lists above are exactly the sets the question asks for.

Reference solution as printed in the source (form 23, 4 steps):

1. A={the bone A, the joint B, the tendon D}; B={the bone A, the muscle C, the tendon D}; C={the muscle C, the tendon D, the bone E}.
2. A∩B∩C={the tendon D}.
3. B\C={the bone A}.
4. A∪B={the bone A, the joint B, the tendon D, the muscle C}. The intersection requires simultaneous membership; set difference removes elements that belong to the excluded set; union keeps elements belonging to either set.

## Result

**Answer.** A∩B∩C={the tendon D}; B\C={the bone A}; A∪B={the bone A, the joint B, the tendon D, the muscle C}.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
