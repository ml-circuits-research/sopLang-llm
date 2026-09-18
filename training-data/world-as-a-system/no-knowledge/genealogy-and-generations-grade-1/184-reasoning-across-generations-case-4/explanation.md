# Explanation 184 — Reasoning across generations: case 4

## Explanation

1. Read the 4 stated parent links and treat them as a directed graph from parent to child.
2. Trace the paths between Maya and Sara: a direct link is a parent, two upward links are a grandparent, and a shared parent makes siblings.
3. The stated links produce: Maya is a grandparent of Sara.

Reference solution as printed in the source (family N12, 1 steps):

1. Maya→Owen and Owen→Sara form two parent links.

## Result

**Answer.** Maya is a grandparent of Sara.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
