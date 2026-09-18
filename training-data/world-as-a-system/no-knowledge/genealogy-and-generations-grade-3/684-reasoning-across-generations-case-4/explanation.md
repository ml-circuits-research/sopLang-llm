# Explanation 684 — Reasoning across generations: case 4

## Explanation

1. Read the 4 stated parent links and treat them as a directed graph from parent to child.
2. Trace the paths between Maya and Sara: a direct link is a parent, two upward links are a grandparent, and a shared parent makes siblings.
3. The stated links produce: Maya is a grandparent of Sara.
4. The appended check is a separate arithmetic question, answered in the labelled suffix.

Reference solution as printed in the source (family N12, 1 steps):

1. Maya→Owen and Owen→Sara form two parent links. Cross-domain check: 7×6=42 km.

## Result

**Answer.** Maya is a grandparent of Sara. Cross-domain answer: 42 km.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
