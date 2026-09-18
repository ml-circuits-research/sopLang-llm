# Explanation 305 — Ordering the events of Eastvale

## Explanation

1. The stated facts are edges of a partial order on the events, and "before" is transitive.
2. Chaining the stated facts links Founding to Market charter, so that order is forced.
3. No chain of stated facts links New school and Bridge opening in either direction, so the facts leave their order open.
4. A relation that no chain of facts forces is reported as undetermined rather than assumed.

Reference solution as printed in the source (family H1, 3 steps):

1. From Founding before Bridge opening and Bridge opening before Market charter, infer Founding before Market charter.
2. New school is only constrained to be after Founding. There is no stated relation between New school and Bridge opening.
3. Therefore the first comparison is forced but the second is underdetermined.

## Result

**Answer.** Founding must be before Market charter. The relative order of New school and Bridge opening cannot be determined from the given facts.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
