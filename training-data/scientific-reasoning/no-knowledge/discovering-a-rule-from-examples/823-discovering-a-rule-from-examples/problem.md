# 823 — Discovering a rule from examples

Given knowledge. Evaporation occurs at the surface of a liquid. In the model, a larger surface area, moving air, and a higher temperature can speed drying, while very humid air can slow it. Drying does not require water to boil. Spreading out a cloth increases its exposed surface area.

Problem data. A means “exposed surface is large”, B means “air circulates”. A box applies the same unknown logical rule: A=NO, B=NO → result=NO; A=NO, B=YES → result=YES; A=YES, B=YES → result=NO. Candidates: R1=A AND B; R2=A OR B; R3=exactly one; R4=neither A nor B.

Question. Eliminate candidate rules that are incompatible with even one example. Which rule remains? Use it for the new case A=YES, B=NO.
