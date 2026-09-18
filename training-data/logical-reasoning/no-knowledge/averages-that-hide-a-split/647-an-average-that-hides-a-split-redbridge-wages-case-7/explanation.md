# Explanation 647 — An average that hides a split — Redbridge wages — case 7

## Explanation

1. The card from Redbridge averages 16 listed pays to 400 while the same card shows the clusters at 200 and 600.
2. The average is the total divided by the count, so it sits between the clusters as their mix.
3. No listed worker need earn 400, which is what Eli points out and Dora denies.
4. Fran treats an average as a portrait, but a number that no one stands on cannot portray a typical worker here.

Reference solution as printed in the source (section 65, 5 steps):

1. Average = total divided by count.
2. Clusters can sit on both sides of that number.
3. A ghost-person at 400 need not exist.
4. Look at the split when the card gives it.
5. Do not let a single number wear a face.

## Result

**Answer.** Not as a portrait. The listed people sit at 200 and 600. The average is a mix, not a resident.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
