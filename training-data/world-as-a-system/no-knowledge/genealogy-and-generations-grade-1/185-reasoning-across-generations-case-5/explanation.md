# Explanation 185 — Reasoning across generations: case 5

## Explanation

1. Read the 4 stated parent links and treat them as a directed graph from parent to child.
2. Trace the paths between Lina and Sara: a direct link is a parent, two upward links are a grandparent, and a shared parent makes siblings.
3. The stated links produce: Lina and Sara are cousins under the implied family tree.

Reference solution as printed in the source (family N12, 3 steps):

1. Noah and Owen are siblings because they share parent Maya.
2. Lina is child of Noah; Sara is child of Owen.
3. Children of siblings are cousins in this model.

## Result

**Answer.** Lina and Sara are cousins under the implied family tree.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
