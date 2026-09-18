# 818 — Discovering a rule from examples

Given knowledge. Air occupies space and can be compressed. In a model of a closed syringe, pushing the plunger decreases the volume of the air and increases pressure; if the air has a path out, pressure does not increase in the same way. Air is matter even though we cannot see it. A balloon can stretch when the pressure inside increases.

Problem data. A means “air is trapped”, B means “the volume available decreases”. A box applies the same unknown logical rule: A=NO, B=NO → result=NO; A=NO, B=YES → result=YES; A=YES, B=YES → result=YES. Candidates: R1=A AND B; R2=A OR B; R3=exactly one; R4=neither A nor B.

Question. Eliminate candidate rules that are incompatible with even one example. Which rule remains? Use it for the new case A=YES, B=NO.
