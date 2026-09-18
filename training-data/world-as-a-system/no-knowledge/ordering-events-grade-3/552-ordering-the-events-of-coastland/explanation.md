# Explanation 552 — Ordering the events of Coastland

## Explanation

1. The stated facts are edges of a partial order on the events, and "before" is transitive.
2. Chaining the stated facts links Market charter to Founding, so that order is forced.
3. No chain of stated facts links Flood and Bridge opening in either direction, so the facts leave their order open.
4. A relation that no chain of facts forces is reported as undetermined rather than assumed.

Reference solution as printed in the source (family H1, 3 steps):

1. From Market charter before Bridge opening and Bridge opening before Founding, infer Market charter before Founding.
2. Flood is only constrained to be after Market charter. There is no stated relation between Flood and Bridge opening.
3. Therefore the first comparison is forced but the second is underdetermined. Cross-domain check: 8×4=32 km.

## Result

**Answer.** Market charter must be before Founding. The relative order of Flood and Bridge opening cannot be determined from the given facts. Cross-domain answer: 32 km.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
