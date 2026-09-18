# Explanation 99 — Two written rules together — East Wharf workshop — case 9

## Explanation

1. Rule One is a universal about apprentices at the grinder: they wear eye-shields.
2. Rule Two speaks about a different object, the inner store, and only says it is dark unless the yellow lamp is on; on this board the yellow lamp is off.
3. Omar is an apprentice at the grinder, so Rule One covers the case and the shield is forced.
4. Darkness in the store follows Rule Two and does not cancel Rule One, so Pia is dropping a rule that the board never dropped.

Reference solution as printed in the source (section 10, 5 steps):

1. Separate objects: grinder versus store lamp.
2. Rule One is a universal about apprentices at the grinder.
3. Rule Two is about the store.
4. Darkness does not punch a hole in a shield rule.
5. Two rules stay two rules until a text says otherwise.

## Result

**Answer.** Omar wears the shield. Darkness in the store follows Rule Two and does not cancel Rule One. Visibility is not a clause of Rule One.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
