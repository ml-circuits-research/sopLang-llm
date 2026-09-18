# Explanation 431 — Reasoning across generations: case 1

## Explanation

1. Read the 4 stated parent links and treat them as a directed graph from parent to child.
2. Trace the paths between Maya and Lina: a direct link is a parent, two upward links are a grandparent, and a shared parent makes siblings.
3. The stated links produce: Maya is a grandparent of Lina.
4. The appended check is a separate arithmetic question, answered in the labelled suffix.

Reference solution as printed in the source (family N12, 3 steps):

1. Maya→Noah is one parent link.
2. Noah→Lina is a second parent link.
3. Two links give the grandparent relation. Cross-domain check: 7−4=3 independent reports remain.

## Result

**Answer.** Maya is a grandparent of Lina. Cross-domain answer: 3 independent reports.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
