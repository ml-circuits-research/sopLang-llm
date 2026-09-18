# Explanation 523 — Sets, intersections, and differences

## Explanation

1. Each labelled property becomes the set of the cases whose observation list carries it, so A is the migrates set, B is the stores food set, C is the has a protected shelter set.
2. B∩C keeps the animal A, the animal E; A\B keeps the animal B, the animal D; A∪C keeps the animal A, the animal B, the animal D, the animal E.
3. An intersection keeps the cases present in both operands, a set difference removes the cases of the right operand, and a union keeps the cases of either operand; each result is listed in the order the cases appear in the data block.
4. The members of the requested expressions are the only cases that satisfy every stated membership test, so the lists above are exactly the sets the question asks for.

Reference solution as printed in the source (form 23, 4 steps):

1. A={the animal A, the animal B, the animal D}; B={the animal A, the animal C, the animal E}; C={the animal A, the animal B, the animal E}.
2. B∩C={the animal A, the animal E}.
3. A\B={the animal B, the animal D}.
4. A∪C={the animal A, the animal B, the animal D, the animal E}. The intersection requires simultaneous membership; set difference removes elements that belong to the excluded set; union keeps elements belonging to either set.

## Result

**Answer.** B∩C={the animal A, the animal E}; A\B={the animal B, the animal D}; A∪C={the animal A, the animal B, the animal D, the animal E}.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
