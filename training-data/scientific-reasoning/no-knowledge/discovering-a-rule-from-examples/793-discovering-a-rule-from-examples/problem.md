# 793 — Discovering a rule from examples

Given knowledge. Microorganisms can multiply on food when they find suitable conditions. In the model, cooling slows multiplication, drying reduces available water, and a clean container reduces initial contamination; none of these measures means that a food becomes sterile. Heat and moisture can speed some biological processes. “Cold” means slowing in the model, not absolute stopping.

Problem data. A means “temperature is low”, B means “available water is reduced”. A box applies the same unknown logical rule: A=NO, B=NO → result=NO; A=NO, B=YES → result=NO; A=YES, B=YES → result=YES. Candidates: R1=A AND B; R2=A OR B; R3=exactly one; R4=neither A nor B.

Question. Eliminate candidate rules that are incompatible with even one example. Which rule remains? Use it for the new case A=YES, B=NO.
