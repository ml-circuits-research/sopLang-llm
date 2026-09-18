# 798 — Discovering a rule from examples

Given knowledge. A lever has a fulcrum, a load, and a place where effort is applied. In the numerical model, for the same load, moving the effort farther from the fulcrum can reduce the force required. The fulcrum is the point around which the lever rotates. The effort arm is the distance between the applied effort and the fulcrum.

Problem data. A means “there is a fulcrum”, B means “effort is applied on the correct side”. A box applies the same unknown logical rule: A=NO, B=NO → result=NO; A=NO, B=YES → result=YES; A=YES, B=YES → result=YES. Candidates: R1=A AND B; R2=A OR B; R3=exactly one; R4=neither A nor B.

Question. Eliminate candidate rules that are incompatible with even one example. Which rule remains? Use it for the new case A=YES, B=NO.
