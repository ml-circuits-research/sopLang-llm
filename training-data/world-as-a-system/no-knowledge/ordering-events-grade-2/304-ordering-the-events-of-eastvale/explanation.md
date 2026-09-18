# Explanation 304 — Ordering the events of Eastvale

## Explanation

1. The stated facts are edges of a partial order on the events, and "before" is transitive.
2. Chaining the stated facts links New school to Market charter, so that order is forced.
3. No chain of stated facts links Founding and Bridge opening in either direction, so the facts leave their order open.
4. A relation that no chain of facts forces is reported as undetermined rather than assumed.

Reference solution as printed in the source (family H1, 3 steps):

1. From New school before Bridge opening and Bridge opening before Market charter, infer New school before Market charter.
2. Founding is only constrained to be after New school. There is no stated relation between Founding and Bridge opening.
3. Therefore the first comparison is forced but the second is underdetermined.

## Result

**Answer.** New school must be before Market charter. The relative order of Founding and Bridge opening cannot be determined from the given facts.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
