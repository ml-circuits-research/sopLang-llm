# 838 — Discovering a rule from examples

Given knowledge. In the circuit model, the metals used here are conductors, while plastic and rubber are insulators. Current appears only if there is a continuous conducting path between the source terminals; insulation is used to prevent contact with conducting parts. A conductor allows current to pass in the model. An insulator breaks the electrical path.

Problem data. A means “the conducting path is continuous”, B means “the useful contacts are conductive”. A box applies the same unknown logical rule: A=NO, B=NO → result=NO; A=NO, B=YES → result=YES; A=YES, B=YES → result=YES. Candidates: R1=A AND B; R2=A OR B; R3=exactly one; R4=neither A nor B.

Question. Eliminate candidate rules that are incompatible with even one example. Which rule remains? Use it for the new case A=YES, B=NO.
