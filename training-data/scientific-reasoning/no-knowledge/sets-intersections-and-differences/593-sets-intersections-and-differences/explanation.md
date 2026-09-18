# Explanation 593 — Sets, intersections, and differences

## Explanation

1. Each labelled property becomes the set of the cases whose observation list carries it, so A is the stores energy set, B is the produces light set, C is the produces motion set.
2. A∩B keeps the bulb B, the resistor E; A∩C keeps the motor C, the resistor E; C\A keeps the battery A, the wire D.
3. An intersection keeps the cases present in both operands, a set difference removes the cases of the right operand, and a union keeps the cases of either operand; each result is listed in the order the cases appear in the data block.
4. The members of the requested expressions are the only cases that satisfy every stated membership test, so the lists above are exactly the sets the question asks for.

Reference solution as printed in the source (form 23, 4 steps):

1. A={the bulb B, the motor C, the resistor E}; B={the bulb B, the wire D, the resistor E}; C={the battery A, the motor C, the wire D, the resistor E}.
2. A∩B={the bulb B, the resistor E}.
3. A∩C={the motor C, the resistor E}.
4. C\A={the battery A, the wire D}. The intersection requires simultaneous membership; set difference removes elements that belong to the excluded set; union keeps elements belonging to either set.

## Result

**Answer.** A∩B={the bulb B, the resistor E}; A∩C={the motor C, the resistor E}; C\A={the battery A, the wire D}.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
