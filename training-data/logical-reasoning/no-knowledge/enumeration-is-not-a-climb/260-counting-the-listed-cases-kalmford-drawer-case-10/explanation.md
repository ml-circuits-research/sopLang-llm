# Explanation 260 — Counting the listed cases — Kalmford drawer — case 10

## Explanation

1. The drawer in Kalmford is a complete list of 6 labelled keys: 5 open the shed and 1 bent one does not.
2. Wes counts inside that closed list and is right about the six, and “5 of these six open the shed” carries no more than the count.
3. Sol is true and weaker, because some of the listed keys do open the shed, while Una leaves the list for keys everywhere, which the drawer cannot support.

Reference solution as printed in the source (section 26, 5 steps):

1. Enumeration inside a closed list is not induction.
2. Induction begins when you leave the list.
3. “These six” versus “keys everywhere.”
4. Weaker true sentences are still true.
5. Do not scold a count for not climbing.

## Result

**Answer.** Wes is right about the six. Sol is also true and weaker. Una climbed from six keys to the world.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
