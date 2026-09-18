# 758 — Discovering a rule from examples

Given knowledge. Seeds can be dispersed by wind, water, or animals. In the model, a seed reaches a new place only if it leaves the parent plant and remains capable of germinating after transport. Light seeds or seeds with wings can be carried more easily by wind. Some fruits have hooks that attach to fur.

Problem data. A means “the seed leaves the parent plant”, B means “the agent can transport it”. A box applies the same unknown logical rule: A=NO, B=NO → result=NO; A=NO, B=YES → result=YES; A=YES, B=YES → result=YES. Candidates: R1=A AND B; R2=A OR B; R3=exactly one; R4=neither A nor B.

Question. Eliminate candidate rules that are incompatible with even one example. Which rule remains? Use it for the new case A=YES, B=NO.
