# Explanation 70 — The table that forbids 1+1 — variant 10

## Explanation

1. The footnote is binding, so Drew's 2 children pay the “2 children” column for 8:00–16:00, 1050, and not twice the one-child fee.
2. Lunch comes after the hours fee, at 225 per child, so the family adds 2×225 = 450.
3. The 50 neighbourhood discount is applied last and only once, because the family lives in Forest Parish, which leaves 1450 for the month.
4. The public-holiday clause does not reduce anything: the fee is due in full in every month.

Reference material as printed in the source:

Row 8–16, column 2 children: 1050 (not 620+620). Lunches: 2×225 = 450. Discount −50, once. Nothing is subtracted for holidays. Reading a table: row, column, then the notes in the order written.

## Result

**Answer.** 1050 + 2×225 − 50 = 1450.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
