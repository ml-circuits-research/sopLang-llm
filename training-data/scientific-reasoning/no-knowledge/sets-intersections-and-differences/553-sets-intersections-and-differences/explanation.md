# Explanation 553 — Sets, intersections, and differences

## Explanation

1. Each labelled property becomes the set of the cases whose observation list carries it, so A is the has 10 teeth set, B is the is in direct contact with A set, C is the is the output gear set.
2. B∩C keeps the gear C, the gear D; A\B keeps the gear B; A∪C keeps the gear A, the gear B, the gear D, the gear C, the gear E.
3. An intersection keeps the cases present in both operands, a set difference removes the cases of the right operand, and a union keeps the cases of either operand; each result is listed in the order the cases appear in the data block.
4. The members of the requested expressions are the only cases that satisfy every stated membership test, so the lists above are exactly the sets the question asks for.

Reference solution as printed in the source (form 23, 4 steps):

1. A={the gear A, the gear B, the gear D}; B={the gear A, the gear C, the gear D}; C={the gear C, the gear D, the gear E}.
2. B∩C={the gear C, the gear D}.
3. A\B={the gear B}.
4. A∪C={the gear A, the gear B, the gear D, the gear C, the gear E}. The intersection requires simultaneous membership; set difference removes elements that belong to the excluded set; union keeps elements belonging to either set.

## Result

**Answer.** B∩C={the gear C, the gear D}; A\B={the gear B}; A∪C={the gear A, the gear B, the gear D, the gear C, the gear E}.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
