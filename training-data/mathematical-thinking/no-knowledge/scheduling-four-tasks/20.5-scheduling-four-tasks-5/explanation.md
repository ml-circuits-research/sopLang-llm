# Explanation 20.5 — Scheduling Four Tasks 5

## Explanation

1. Each rule is an inequality of positions: T4 < T1, T2 < T4, T1 < T3.
2. Taking the transitive closure gives every task the set of tasks that must precede it.
3. Sorting the tasks by how many predecessors they have yields the order T2, T4, T1, T3.
4. The predecessor counts are all different, so exactly one order satisfies the rules without extra freedom.

Reference solution as printed in the source (chapter 20, 3 steps):

1. From the clues, extract the relations T2<T4, T4<T1, T1<T3.
2. Linking them gives the chain T2 < T4 < T1 < T3.
3. The chain contains all four tasks, so the order is unique.

## Result

**Answer.** T2, T4, T1, T3.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
