# Explanation 700 — Headline versus table — Kalmford square — case 10

## Explanation

1. The page in Kalmford separates two layers: the banner claims "MARKET PROVES SALES DOUBLED.", while the table under it lists 40 last month and 42 this month.
2. Testing the banner's word against the cells, double of 40 would be 80, and 42 is far below that.
3. undefined reads down the table and sees a small rise, which is the quantity the page actually carries.
4. undefined excuses the banner because tables are dull; song does not amend a cell.

Reference solution as printed in the source (section 70, 5 steps):

1. Separate layers: banner versus grid.
2. Compute what “doubled” would have been.
3. 42 ≠ 80.
4. Song does not amend a cell.
5. Read down, not only across the top.

## Result

**Answer.** The table. Double of 40 would be 80. 42 is a small rise.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
