# 828 — Discovering a rule from examples

Given knowledge. A mirror does not produce light; it changes the direction of light that reaches its surface. In the grid-ray model, the outgoing angle is symmetric with the incoming angle relative to the normal to the mirror. Light travels in straight lines in the uniform medium of the model. A matte surface scatters light in many directions.

Problem data. A means “the ray meets the mirror”, B means “the mirror has a suitable orientation”. A box applies the same unknown logical rule: A=NO, B=NO → result=YES; A=NO, B=YES → result=NO; A=YES, B=YES → result=NO. Candidates: R1=A AND B; R2=A OR B; R3=exactly one; R4=neither A nor B.

Question. Eliminate candidate rules that are incompatible with even one example. Which rule remains? Use it for the new case A=YES, B=NO.
