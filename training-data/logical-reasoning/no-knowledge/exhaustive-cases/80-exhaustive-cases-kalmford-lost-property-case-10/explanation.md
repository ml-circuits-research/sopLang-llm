# Explanation 80 — Exhaustive cases — Kalmford lost-property — case 10

## Explanation

1. The desk list admits exactly three tags — red, blue, green — and states that no other tag exists.
2. The item on the counter is not red and not blue, so striking those two leaves green, which is what Sol names.
3. Una proposes yellow, which is not on the list, so it comes from another document rather than from this list.
4. Two negatives force the remainder here only because the list was exhaustive; Wes is right that two negatives never force a third on an open list.

Reference solution as printed in the source (section 8, 5 steps):

1. Write the menu: red, blue, green.
2. Strike red and blue.
3. Green remains.
4. An unlisted colour is a second document.
5. Exhaustion does the work.

## Result

**Answer.** Sol is forced. Two tags are ruled out; the third remains. Yellow is unlisted. Two negatives force the remainder only because the list was exhaustive.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
