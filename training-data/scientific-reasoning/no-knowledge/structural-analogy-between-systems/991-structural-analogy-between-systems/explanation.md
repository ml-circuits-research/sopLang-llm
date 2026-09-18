# Explanation 991 — Structural analogy between systems

## Explanation

1. The chain of the natural system is fixed by the order of its steps: 1. water reaches the outlet, 2. sieving is performed, 3. filtration is performed, 4. the disinfection stage is applied.
2. The artificial system names the same four positions in the same order: Source → Preparation Station → Channel → Collector.
3. Pairing the steps with the roles in that order preserves the causal links, because each step prepares or allows the next one, exactly as each role hands the object to the next.
4. The correspondence survives a change of material: only the number of positions and the order of the relationships are compared, not the appearance of the parts.

Reference solution as printed in the source (form 36, 4 steps):

1. The first element, “water reaches the outlet”, is the beginning of the chain, therefore corresponds to the Source.
2. “sieving is performed” is the second role that prepares the next transition, therefore corresponds to the Preparation Station.
3. “filtration is performed” is the link through which the effect reaches the end, therefore we map it to the Channel; “the disinfection stage is applied” corresponds to the Collector.
4. The analogy preserves the order of relationships and the causal/functional roles, not the material or shape of the components.

## Result

**Answer.** Water reaches the outlet↔ Source; sieving is performed↔ Preparation Station; filtration is performed↔ Channel; the disinfection stage is applied↔ Collector. It preserves the structure of the relationships.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
