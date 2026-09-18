# 773 — Discovering a rule from examples

Given knowledge. Animals can respond to seasons through migration, hibernation, storing food, or changing their coat. In the model, a strategy succeeds if the animal secures energy, protection, and access to resources under the season’s conditions. Migration means seasonal movement between regions. Hibernation greatly reduces activity during certain periods.

Problem data. A means “there is sufficient energy”, B means “there is protection from the cold”. A box applies the same unknown logical rule: A=NO, B=NO → result=NO; A=NO, B=YES → result=NO; A=YES, B=YES → result=YES. Candidates: R1=A AND B; R2=A OR B; R3=exactly one; R4=neither A nor B.

Question. Eliminate candidate rules that are incompatible with even one example. Which rule remains? Use it for the new case A=YES, B=NO.
