# Explanation 558 — Sets, intersections, and differences

## Explanation

1. Each labelled property becomes the set of the cases whose observation list carries it, so A is the has a wide base set, B is the has a low mass position set, C is the has the load secured set.
2. A∩B∩C keeps the model E; B\C keeps the model B, the model C; A∪B keeps the model A, the model C, the model E, the model B, the model D.
3. An intersection keeps the cases present in both operands, a set difference removes the cases of the right operand, and a union keeps the cases of either operand; each result is listed in the order the cases appear in the data block.
4. The members of the requested expressions are the only cases that satisfy every stated membership test, so the lists above are exactly the sets the question asks for.

Reference solution as printed in the source (form 23, 4 steps):

1. A={the model A, the model C, the model E}; B={the model B, the model C, the model D, the model E}; C={the model A, the model D, the model E}.
2. A∩B∩C={the model E}.
3. B\C={the model B, the model C}.
4. A∪B={the model A, the model C, the model E, the model B, the model D}. The intersection requires simultaneous membership; set difference removes elements that belong to the excluded set; union keeps elements belonging to either set.

## Result

**Answer.** A∩B∩C={the model E}; B\C={the model B, the model C}; A∪B={the model A, the model C, the model E, the model B, the model D}.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
