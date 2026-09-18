# Explanation 432 — Reasoning across generations: case 2

## Explanation

1. Read the 4 stated parent links and treat them as a directed graph from parent to child.
2. Trace the paths between Noah and Lina: a direct link is a parent, two upward links are a grandparent, and a shared parent makes siblings.
3. The stated links produce: Noah is a parent of Lina.
4. The appended check is a separate arithmetic question, answered in the labelled suffix.

Reference solution as printed in the source (family N12, 1 steps):

1. The relation is stated directly. Cross-domain check: 7×4=28 km.

## Result

**Answer.** Noah is a parent of Lina. Cross-domain answer: 28 km.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
