# 753 — Discovering a rule from examples

Given knowledge. In the simplified model, pollination succeeds when compatible pollen reaches a flower’s stigma. A visitor can touch a flower without carrying pollen, and carrying pollen does not help if the correct part of the flower is not touched. Nectar may attract insects, but nectar is not pollen. Some plants are pollinated mainly by animals, others mainly by wind.

Problem data. A means “the visitor carries compatible pollen”, B means “the visitor touches the stigma”. A box applies the same unknown logical rule: A=NO, B=NO → result=NO; A=NO, B=YES → result=NO; A=YES, B=YES → result=YES. Candidates: R1=A AND B; R2=A OR B; R3=exactly one; R4=neither A nor B.

Question. Eliminate candidate rules that are incompatible with even one example. Which rule remains? Use it for the new case A=YES, B=NO.
