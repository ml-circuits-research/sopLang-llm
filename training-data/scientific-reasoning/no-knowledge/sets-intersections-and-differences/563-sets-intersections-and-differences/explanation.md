# Explanation 563 — Sets, intersections, and differences

## Explanation

1. Each labelled property becomes the set of the cases whose observation list carries it, so A is the has an air cavity set, B is the has a large volume set, C is the has low mass for its volume set.
2. A∩B keeps the object B; A∩C keeps the object E; C\A keeps the object D.
3. An intersection keeps the cases present in both operands, a set difference removes the cases of the right operand, and a union keeps the cases of either operand; each result is listed in the order the cases appear in the data block.
4. The members of the requested expressions are the only cases that satisfy every stated membership test, so the lists above are exactly the sets the question asks for.

Reference solution as printed in the source (form 23, 4 steps):

1. A={the object A, the object B, the object E}; B={the object B, the object C, the object D}; C={the object D, the object E}.
2. A∩B={the object B}.
3. A∩C={the object E}.
4. C\A={the object D}. The intersection requires simultaneous membership; set difference removes elements that belong to the excluded set; union keeps elements belonging to either set.

## Result

**Answer.** A∩B={the object B}; A∩C={the object E}; C\A={the object D}.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
