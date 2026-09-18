# Explanation 935 — Reasoning across generations: case 5

## Explanation

1. Read the 4 stated parent links and treat them as a directed graph from parent to child.
2. Trace the paths between Lina and Sara: a direct link is a parent, two upward links are a grandparent, and a shared parent makes siblings.
3. The stated links produce: Lina and Sara are cousins under the implied family tree.
4. The appended check is a separate arithmetic question, answered in the labelled suffix.

Reference solution as printed in the source (family N12, 3 steps):

1. Noah and Owen are siblings because they share parent Maya.
2. Lina is child of Noah; Sara is child of Owen.
3. Children of siblings are cousins in this model. Cross-domain check: 11−4=7 independent reports remain. Mixed-domain verification: 95+6=101.

## Result

**Answer.** Lina and Sara are cousins under the implied family tree. Cross-domain answer: 7 independent reports. Mixed-domain answer: 101 map sheets.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
