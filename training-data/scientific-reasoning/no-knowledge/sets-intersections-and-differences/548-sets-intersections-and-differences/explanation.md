# Explanation 548 — Sets, intersections, and differences

## Explanation

1. Each labelled property becomes the set of the cases whose observation list carries it, so A is the has a long effort arm set, B is the has a fixed support set, C is the changes the direction of the force set.
2. A∩B keeps lever A; A∩C keeps lever A, lever B; C\A keeps lever E.
3. An intersection keeps the cases present in both operands, a set difference removes the cases of the right operand, and a union keeps the cases of either operand; each result is listed in the order the cases appear in the data block.
4. The members of the requested expressions are the only cases that satisfy every stated membership test, so the lists above are exactly the sets the question asks for.

Reference solution as printed in the source (form 23, 4 steps):

1. A={lever A, lever B, lever D}; B={lever A, lever C, lever E}; C={lever A, lever B, lever E}.
2. A∩B={lever A}.
3. A∩C={lever A, lever B}.
4. C\A={lever E}. The intersection requires simultaneous membership; set difference removes elements that belong to the excluded set; union keeps elements belonging to either set.

## Result

**Answer.** A∩B={lever A}; A∩C={lever A, lever B}; C\A={lever E}.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
