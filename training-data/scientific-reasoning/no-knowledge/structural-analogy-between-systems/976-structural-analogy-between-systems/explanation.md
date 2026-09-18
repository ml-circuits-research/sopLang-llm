# Explanation 976 — Structural analogy between systems

## Explanation

1. The chain of the natural system is fixed by the order of its steps: 1. the sensor measures, 2. the intervention is decided, 3. water is distributed, 4. temperature is regulated.
2. The artificial system names the same four positions in the same order: Source → Preparation Station → Channel → Collector.
3. Pairing the steps with the roles in that order preserves the causal links, because each step prepares or allows the next one, exactly as each role hands the object to the next.
4. The correspondence survives a change of material: only the number of positions and the order of the relationships are compared, not the appearance of the parts.

Reference solution as printed in the source (form 36, 4 steps):

1. The first element, “the sensor measures”, is the beginning of the chain, therefore corresponds to the Source.
2. “the intervention is decided” is the second role that prepares the next transition, therefore corresponds to the Preparation Station.
3. “water is distributed” is the link through which the effect reaches the end, therefore we map it to the Channel; “temperature is regulated” corresponds to the Collector.
4. The analogy preserves the order of relationships and the causal/functional roles, not the material or shape of the components.

## Result

**Answer.** The sensors measures↔ Source; the intervention is decided↔ Preparation Station; water is distributed↔ Channel; temperature is regulated↔ Collector. It preserves the structure of the relationships.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
