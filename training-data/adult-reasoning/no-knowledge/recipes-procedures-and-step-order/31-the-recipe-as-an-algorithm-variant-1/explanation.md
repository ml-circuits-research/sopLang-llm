# Explanation 31 — The recipe as an algorithm — variant 1

## Explanation

1. The recipe from Mira's kitchen in Station Quarter is written for 2 tins, and Mira halved the 200 g of flour and the 100 g of water for one tin, which the recipe asks for, so Halved ingredients: yes.
2. The salt went into the yeast water at S1, although the recipe forbids salt there before S2, and the kneading was cut to 4 minutes although S3 prescribes 8.
3. The rise of S4 is printed as 60 minutes at 24–26 °C, and the room is 18 °C, below the 20 °C that turns it into 90 minutes, so the halved 30 minutes are wrong twice over.
4. The correct sequence for one tin keeps the waiting times whole: S1 yeast with water for 10 minutes, then the flour with the salt, 8 minutes of kneading at S3, 90 minutes of rising at 18 °C, 20 minutes in the tins at S5, and 18 minutes at 220 °C at S6.

Reference material as printed in the source:

A recipe is an algorithm with two families of quantity: masses (halved) and waiting times S1/S4/S5 (not). 18 °C < 20 °C starts the 90-minute exception at S4. Salt in the yeast water is explicitly forbidden.

Correct sequence: half of each mass; S1 10 min without salt; S2; S3 8 min (the text does not authorise halving the knead); S4 90 min; S5 20 min in one tin; S6 18 min / 220 °C.

Order is not ornament. It is part of the result.

## Result

**Answer.** Halved ingredients: yes. Breaches: salt in S1; 4-minute knead; 30-minute rise; ignoring the 90 minutes at 18 °C.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
