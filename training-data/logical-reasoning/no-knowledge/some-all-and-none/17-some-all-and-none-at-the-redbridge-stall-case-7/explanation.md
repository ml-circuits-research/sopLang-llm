# Explanation 17 — Some, all, and none at the Redbridge stall — case 7

## Explanation

1. The notice of Redbridge is a closed page: "some" boxed pies contain nuts, every boxed soup is vegetarian, and no boxed juice contains milk.
2. Eli takes a soup, and the listed soup class falls under "all", so the notice forces the property for that box.
3. Dora takes a pie, and "some" speaks about the class without naming the box in hand, so that claim stays possible and unforced; the 3 boxes of each kind do not turn "some" into "all".
4. Fran keeps a juice open to milk, which the "none" clause rules out, and a rumour about this morning is not an amendment to the notice.

Reference solution as printed in the source (section 2, 5 steps):

1. “All” plus a member of the class forces the property.
2. “Some” means at least one and is silent about the box in hand.
3. “None” is a universal negative.
4. A rumour about this morning is not an amendment.
5. The count of boxes does not turn “some” into “all.”

## Result

**Answer.** Eli is forced. Dora is possible but not forced (“some” is not “this one”). Fran contradicts “none.”

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
