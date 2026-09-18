# 873 — Discovering a rule from examples

Given knowledge. In the kitchen model, heating transfers energy, dissolving forms a homogeneous mixture only for certain substances and quantities, and clean utensils reduce contamination. Experimental recipes can be compared only when quantities and times are measured in the same way. A dissolved substance has not disappeared; it is distributed through the solvent. Stirring can speed dissolving without changing the maximum amount allowed by the model.

Problem data. A means “the quantities are measured in the same way”, B means “temperature is controlled”. A box applies the same unknown logical rule: A=NO, B=NO → result=NO; A=NO, B=YES → result=NO; A=YES, B=YES → result=YES. Candidates: R1=A AND B; R2=A OR B; R3=exactly one; R4=neither A nor B.

Question. Eliminate candidate rules that are incompatible with even one example. Which rule remains? Use it for the new case A=YES, B=NO.
