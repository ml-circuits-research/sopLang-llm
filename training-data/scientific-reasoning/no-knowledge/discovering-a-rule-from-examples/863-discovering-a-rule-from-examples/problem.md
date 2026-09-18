# 863 — Discovering a rule from examples

Given knowledge. In the home model, insulation slows heat transfer, natural light can reduce the use of electric lights, and electrical devices transform energy and also produce heat. The goal is comfort while using resources as efficiently as possible. Windows can provide light but can also be areas of heat transfer. A thick curtain can reduce some heat loss.

Problem data. A means “heat losses have been limited”, B means “there is sufficient light”. A box applies the same unknown logical rule: A=NO, B=NO → result=NO; A=NO, B=YES → result=YES; A=YES, B=YES → result=NO. Candidates: R1=A AND B; R2=A OR B; R3=exactly one; R4=neither A nor B.

Question. Eliminate candidate rules that are incompatible with even one example. Which rule remains? Use it for the new case A=YES, B=NO.
