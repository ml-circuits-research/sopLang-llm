# Explanation 21.9 — Two Boxes That Form a Partition

## Explanation

1. The two rules "at most 7" and "greater than 7" never both hold and never both fail, so each number goes to exactly one box.
2. Counting the numbers from 1 to 14 under each rule gives 7 and 7.
3. The two counts add up to the 14 cards, which confirms the partition.

Reference solution as printed in the source (chapter 21, 4 steps):

1. The numbers 1 through 7 make 7 cards.
2. The numbers 8 through 14 also make 7 cards.
3. No number can be both at most 7 and greater than 7.
4. 7+7=14, so no card remains unclassified.

## Result

**Answer.** 7 in the first box and 7 in the second.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
