# Explanation 508 — Sets, intersections, and differences

## Explanation

1. Each labelled property becomes the set of the cases whose observation list carries it, so A is the is light in weight set, B is the can cling set, C is the can float set.
2. B∩C keeps the acorn D, the seed fluffy E; A\B keeps the seed with wing A; A∪C keeps the seed with wing A, the fruit floating C, the seed fluffy E, the acorn D.
3. An intersection keeps the cases present in both operands, a set difference removes the cases of the right operand, and a union keeps the cases of either operand; each result is listed in the order the cases appear in the data block.
4. The members of the requested expressions are the only cases that satisfy every stated membership test, so the lists above are exactly the sets the question asks for.

Reference solution as printed in the source (form 23, 4 steps):

1. A={the seed with wing A, the fruit floating C, the seed fluffy E}; B={the fruit with hooks B, the fruit floating C, the acorn D, the seed fluffy E}; C={the seed with wing A, the acorn D, the seed fluffy E}.
2. B∩C={the acorn D, the seed fluffy E}.
3. A\B={the seed with wing A}.
4. A∪C={the seed with wing A, the fruit floating C, the seed fluffy E, the acorn D}. The intersection requires simultaneous membership; set difference removes elements that belong to the excluded set; union keeps elements belonging to either set.

## Result

**Answer.** B∩C={the acorn D, the seed fluffy E}; A\B={the seed with wing A}; A∪C={the seed with wing A, the fruit floating C, the seed fluffy E, the acorn D}.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
