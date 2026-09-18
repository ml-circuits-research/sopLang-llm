# 808 — Discovering a rule from examples

Given knowledge. An object remains stable in the model if the projection of its center of mass stays above its base of support. A wider base or moving mass inward can increase stability. In the model, the center of mass is the point at which we can treat mass as concentrated for balance analysis. Raising mass higher can make the system easier to tip.

Problem data. A means “the center of mass is above the base”, B means “the base of support does not slip”. A box applies the same unknown logical rule: A=NO, B=NO → result=YES; A=NO, B=YES → result=NO; A=YES, B=YES → result=NO. Candidates: R1=A AND B; R2=A OR B; R3=exactly one; R4=neither A nor B.

Question. Eliminate candidate rules that are incompatible with even one example. Which rule remains? Use it for the new case A=YES, B=NO.
