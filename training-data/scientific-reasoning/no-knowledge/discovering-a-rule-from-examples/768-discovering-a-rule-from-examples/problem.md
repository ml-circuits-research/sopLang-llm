# 768 — Discovering a rule from examples

Given knowledge. Soil is a mixture that may contain mineral particles, humus, water, and air. In the model, a good layer for roots must retain some water while also leaving air spaces; too much water without air, or drainage that is too fast, can create problems. Sand generally has larger particles than clay. Humus comes from transformed organic remains.

Problem data. A means “the soil retains enough water”, B means “the soil retains air spaces”. A box applies the same unknown logical rule: A=NO, B=NO → result=YES; A=NO, B=YES → result=NO; A=YES, B=YES → result=NO. Candidates: R1=A AND B; R2=A OR B; R3=exactly one; R4=neither A nor B.

Question. Eliminate candidate rules that are incompatible with even one example. Which rule remains? Use it for the new case A=YES, B=NO.
