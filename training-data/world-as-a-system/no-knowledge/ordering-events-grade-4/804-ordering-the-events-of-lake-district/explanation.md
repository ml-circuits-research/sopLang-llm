# Explanation 804 — Ordering the events of Lake District

## Explanation

1. The stated facts are edges of a partial order on the events, and "before" is transitive.
2. Chaining the stated facts links Flood to Bridge opening, so that order is forced.
3. No chain of stated facts links New school and Founding in either direction, so the facts leave their order open.
4. A relation that no chain of facts forces is reported as undetermined rather than assumed.

Reference solution as printed in the source (family H1, 3 steps):

1. From Flood before Founding and Founding before Bridge opening, infer Flood before Bridge opening.
2. New school is only constrained to be after Flood. There is no stated relation between New school and Founding.
3. Therefore the first comparison is forced but the second is underdetermined.

## Result

**Answer.** Flood must be before Bridge opening. The relative order of New school and Founding cannot be determined from the given facts.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
