# Explanation 20.3 — Scheduling Four Tasks 3

## Explanation

1. Each rule is an inequality of positions: T2 < T3, T3 < T1, T4 < T2.
2. Taking the transitive closure gives every task the set of tasks that must precede it.
3. Sorting the tasks by how many predecessors they have yields the order T4, T2, T3, T1.
4. The predecessor counts are all different, so exactly one order satisfies the rules without extra freedom.

Reference solution as printed in the source (chapter 20, 3 steps):

1. From the clues, extract the relations T4<T2, T2<T3, T3<T1.
2. Linking them gives the chain T4 < T2 < T3 < T1.
3. The chain contains all four tasks, so the order is unique.

## Result

**Answer.** T4, T2, T3, T1.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
