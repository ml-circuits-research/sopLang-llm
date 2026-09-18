# Explanation 503 — Sets, intersections, and differences

## Explanation

1. Each labelled property becomes the set of the cases whose observation list carries it, so A is the carries pollen set, B is the touches the stigma set, C is the visits in the morning set.
2. A∩B keeps the bee A, fly D; A∩C keeps fly D; C\A keeps the butterfly C, the beetle E.
3. An intersection keeps the cases present in both operands, a set difference removes the cases of the right operand, and a union keeps the cases of either operand; each result is listed in the order the cases appear in the data block.
4. The members of the requested expressions are the only cases that satisfy every stated membership test, so the lists above are exactly the sets the question asks for.

Reference solution as printed in the source (form 23, 4 steps):

1. A={the bee A, the bumblebee B, fly D}; B={the bee A, the butterfly C, fly D}; C={the butterfly C, fly D, the beetle E}.
2. A∩B={the bee A, fly D}.
3. A∩C={fly D}.
4. C\A={the butterfly C, the beetle E}. The intersection requires simultaneous membership; set difference removes elements that belong to the excluded set; union keeps elements belonging to either set.

## Result

**Answer.** A∩B={the bee A, fly D}; A∩C={fly D}; C\A={the butterfly C, the beetle E}.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
