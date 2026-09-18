# 783 — Discovering a rule from examples

Given knowledge. Incisors cut, canines can tear, and molars crush and grind. Enamel protects the outside of the tooth. In the model, preparing a piece of food well requires cutting or tearing and then grinding before swallowing. Teeth have different shapes for different mechanical roles. Chewing increases the surface area of pieces of food.

Problem data. A means “the piece is cut or torn”, B means “the piece is broken into smaller pieces”. A box applies the same unknown logical rule: A=NO, B=NO → result=NO; A=NO, B=YES → result=YES; A=YES, B=YES → result=NO. Candidates: R1=A AND B; R2=A OR B; R3=exactly one; R4=neither A nor B.

Question. Eliminate candidate rules that are incompatible with even one example. Which rule remains? Use it for the new case A=YES, B=NO.
