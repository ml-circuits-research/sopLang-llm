# Explanation 52 — Ordering the events of Coastland

## Explanation

1. The stated facts are edges of a partial order on the events, and "before" is transitive.
2. Chaining the stated facts links Founding to Flood, so that order is forced.
3. No chain of stated facts links Bridge opening and Market charter in either direction, so the facts leave their order open.
4. A relation that no chain of facts forces is reported as undetermined rather than assumed.

Reference solution as printed in the source (family H1, 3 steps):

1. From Founding before Market charter and Market charter before Flood, infer Founding before Flood.
2. Bridge opening is only constrained to be after Founding. There is no stated relation between Bridge opening and Market charter.
3. Therefore the first comparison is forced but the second is underdetermined.

## Result

**Answer.** Founding must be before Flood. The relative order of Bridge opening and Market charter cannot be determined from the given facts.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
