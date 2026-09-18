# Explanation 623 — Sets, intersections, and differences

## Explanation

1. Each labelled property becomes the set of the cases whose observation list carries it, so A is the is clean set, B is the keeps heat set, C is the allows the measurement of the temperature set.
2. A∩B keeps the container A; A∩C keeps the container A, the container B; C\A keeps the thermometer E.
3. An intersection keeps the cases present in both operands, a set difference removes the cases of the right operand, and a union keeps the cases of either operand; each result is listed in the order the cases appear in the data block.
4. The members of the requested expressions are the only cases that satisfy every stated membership test, so the lists above are exactly the sets the question asks for.

Reference solution as printed in the source (form 23, 4 steps):

1. A={the container A, the container B, the lid D}; B={the container A, the spoon C, the thermometer E}; C={the container A, the container B, the thermometer E}.
2. A∩B={the container A}.
3. A∩C={the container A, the container B}.
4. C\A={the thermometer E}. The intersection requires simultaneous membership; set difference removes elements that belong to the excluded set; union keeps elements belonging to either set.

## Result

**Answer.** A∩B={the container A}; A∩C={the container A, the container B}; C\A={the thermometer E}.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
