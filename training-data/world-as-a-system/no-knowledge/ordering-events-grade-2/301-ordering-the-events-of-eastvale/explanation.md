# Explanation 301 — Ordering the events of Eastvale

## Explanation

1. The stated facts are edges of a partial order on the events, and "before" is transitive.
2. Chaining the stated facts links Bridge opening to New school, so that order is forced.
3. No chain of stated facts links Market charter and Founding in either direction, so the facts leave their order open.
4. A relation that no chain of facts forces is reported as undetermined rather than assumed.

Reference solution as printed in the source (family H1, 3 steps):

1. From Bridge opening before Founding and Founding before New school, infer Bridge opening before New school.
2. Market charter is only constrained to be after Bridge opening. There is no stated relation between Market charter and Founding.
3. Therefore the first comparison is forced but the second is underdetermined.

## Result

**Answer.** Bridge opening must be before New school. The relative order of Market charter and Founding cannot be determined from the given facts.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
