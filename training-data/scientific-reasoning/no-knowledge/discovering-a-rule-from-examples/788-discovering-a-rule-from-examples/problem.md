# 788 — Discovering a rule from examples

Given knowledge. During exercise, muscles need more oxygen and energy, and pulse and breathing may increase. after exercise stops, the values tend to return gradually toward the resting level. In the model, recovery is tracked by measurements taken at the same time intervals. Sweating can contribute to water loss. A single measurement does not describe the whole recovery process.

Problem data. A means “measurements have been taken at equal intervals”, B means “the effort has ended”. A box applies the same unknown logical rule: A=NO, B=NO → result=YES; A=NO, B=YES → result=NO; A=YES, B=YES → result=NO. Candidates: R1=A AND B; R2=A OR B; R3=exactly one; R4=neither A nor B.

Question. Eliminate candidate rules that are incompatible with even one example. Which rule remains? Use it for the new case A=YES, B=NO.
