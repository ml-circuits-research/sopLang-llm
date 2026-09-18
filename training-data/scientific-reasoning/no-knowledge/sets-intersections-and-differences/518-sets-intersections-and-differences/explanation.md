# Explanation 518 — Sets, intersections, and differences

## Explanation

1. Each labelled property becomes the set of the cases whose observation list carries it, so A is the drains quickly set, B is the contains humus set, C is the retains air-filled pores set.
2. A∩B keeps the sample B, the sample E; A∩C keeps the sample C, the sample E; C\A keeps the sample A, the sample D.
3. An intersection keeps the cases present in both operands, a set difference removes the cases of the right operand, and a union keeps the cases of either operand; each result is listed in the order the cases appear in the data block.
4. The members of the requested expressions are the only cases that satisfy every stated membership test, so the lists above are exactly the sets the question asks for.

Reference solution as printed in the source (form 23, 4 steps):

1. A={the sample B, the sample C, the sample E}; B={the sample B, the sample D, the sample E}; C={the sample A, the sample C, the sample D, the sample E}.
2. A∩B={the sample B, the sample E}.
3. A∩C={the sample C, the sample E}.
4. C\A={the sample A, the sample D}. The intersection requires simultaneous membership; set difference removes elements that belong to the excluded set; union keeps elements belonging to either set.

## Result

**Answer.** A∩B={the sample B, the sample E}; A∩C={the sample C, the sample E}; C\A={the sample A, the sample D}.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
