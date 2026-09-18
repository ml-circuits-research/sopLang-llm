# 803 — Discovering a rule from examples

Given knowledge. Two gears that touch directly rotate in opposite directions. In the model, if a small gear drives a larger gear, the larger gear makes fewer rotations in the same time; an odd or even number of contacts can change the final direction. The teeth prevent slipping in the ideal model. An intermediate gear can change direction without being the useful output.

Problem data. A means “all required gears are in contact”, B means “no part is blocked”. A box applies the same unknown logical rule: A=NO, B=NO → result=NO; A=NO, B=YES → result=YES; A=YES, B=YES → result=NO. Candidates: R1=A AND B; R2=A OR B; R3=exactly one; R4=neither A nor B.

Question. Eliminate candidate rules that are incompatible with even one example. Which rule remains? Use it for the new case A=YES, B=NO.
