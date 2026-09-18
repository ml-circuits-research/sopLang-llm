# 763 — Discovering a rule from examples

Given knowledge. Fungi and bacteria can decompose organic remains. In the model, active decomposition needs decomposers, enough water, and a suitable temperature; the matter in the remains is transformed and some substances return to the soil. Dead leaves do not disappear instantly; decomposition has stages. Strong drying can slow the activity of many decomposers.

Problem data. A means “there are decomposers”, B means “there is enough moisture”. A box applies the same unknown logical rule: A=NO, B=NO → result=NO; A=NO, B=YES → result=YES; A=YES, B=YES → result=NO. Candidates: R1=A AND B; R2=A OR B; R3=exactly one; R4=neither A nor B.

Question. Eliminate candidate rules that are incompatible with even one example. Which rule remains? Use it for the new case A=YES, B=NO.
