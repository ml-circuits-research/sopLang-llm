# Explanation 598 — Sets, intersections, and differences

## Explanation

1. Each labelled property becomes the set of the cases whose observation list carries it, so A is the shows the illuminated part set, B is the is opposite the Sun set, C is the is between Earth and Sun set.
2. B∩C keeps the position A, the observer E; A\B keeps the position B, the position D; A∪C keeps the position A, the position B, the position D, the observer E.
3. An intersection keeps the cases present in both operands, a set difference removes the cases of the right operand, and a union keeps the cases of either operand; each result is listed in the order the cases appear in the data block.
4. The members of the requested expressions are the only cases that satisfy every stated membership test, so the lists above are exactly the sets the question asks for.

Reference solution as printed in the source (form 23, 4 steps):

1. A={the position A, the position B, the position D}; B={the position A, the position C, the observer E}; C={the position A, the position B, the observer E}.
2. B∩C={the position A, the observer E}.
3. A\B={the position B, the position D}.
4. A∪C={the position A, the position B, the position D, the observer E}. The intersection requires simultaneous membership; set difference removes elements that belong to the excluded set; union keeps elements belonging to either set.

## Result

**Answer.** B∩C={the position A, the observer E}; A\B={the position B, the position D}; A∪C={the position A, the position B, the position D, the observer E}.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
