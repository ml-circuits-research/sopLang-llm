# 813 — Discovering a rule from examples

Given knowledge. For equal volumes, the material with smaller mass has lower density. In the model, an object floats in water if its average density is lower than the density of water; a hollow shape can contain air and reduce average density. A compact piece of metal can be denser than water. A metal ship can float because its total volume contains a great deal of air.

Problem data. A means “average density is below that of water”, B means “the object does not take water into the air cavity”. A box applies the same unknown logical rule: A=NO, B=NO → result=NO; A=NO, B=YES → result=NO; A=YES, B=YES → result=YES. Candidates: R1=A AND B; R2=A OR B; R3=exactly one; R4=neither A nor B.

Question. Eliminate candidate rules that are incompatible with even one example. Which rule remains? Use it for the new case A=YES, B=NO.
