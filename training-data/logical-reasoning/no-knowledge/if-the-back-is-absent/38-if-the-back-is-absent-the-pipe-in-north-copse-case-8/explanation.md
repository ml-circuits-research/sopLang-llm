# Explanation 38 — If the back is absent — the pipe in North Copse — case 8

## Explanation

1. The card of North Copse states one conditional: if the street pipe is frozen solid, then every ground-floor tap gives no water.
2. Jules opens a kitchen tap and a steady stream comes, so the consequent is false, and modus tollens makes the denial of the antecedent by Kat valid.
3. Ned would treat a later dry tap as proof of a freeze, but that affirms the consequent: a dry tap has more than one possible path.
4. The card named one sufficient path to dryness, not the only path, so the second sentence outruns what the card says.

Reference solution as printed in the source (section 4, 5 steps):

1. If A then B. B is false, so A is false.
2. That denying of the back is valid.
3. B true would not force A.
4. Sufficient is not necessary unless the text says so.
5. Keep the valid twin; refuse the look-alike.

## Result

**Answer.** Kat is forced (modus tollens). Ned affirms the back: a dry tap has more than one possible path. The card named one sufficient path to dryness, not the only path.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
